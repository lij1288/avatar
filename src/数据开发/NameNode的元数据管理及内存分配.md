## **NameNode的元数据管理及内存分配**

### NameNode的元数据管理

- NameNode管理整个HDFS文件系统的元数据，元数据分为两部分:
  - Namespace，负责管理文件系统中的目录树结构以及文件与数据块的映射关系
  - BlockManager，负责管理文件系统中文件的物理块与实际存储位置的映射关系BlocksMap

- Namespace管理的元数据除内存常驻外，会周期性持久化到FSImage镜像文件

- BlockManagement管理的元数据只在内存中存在，当NameNode重启，首先会读取FSImage镜像文件构建NameSpace，然后根据DataNode的汇报信息重新构建BlocksMap

### NameNode的内存分配

Namespace和BlockManager内存占比分别接近50%

- Namespace：维护整个文件系统的目录树结构及目录树上的状态变化

  - 保存了目录树及每个目录/文件的属性

  - 包括INodeDirectory和INodeFile两种数据结构，分别标识目录树中的目录和文件

  - INodeDirectory特有列表ArrayList\<INode> children，按照子节点name有序存储

  - INodeFile特有标识副本数和数据块大小的long header，以及该文件包含的Block信息的有序数组BlockInfo[] blocks

    BlockInfo包含名为triplets的Object数组，表明实际数据由哪些DataNode管理，大小为3*副本数，包含

    1. Block所在的DataNode
    2. 该DataNode上前一个Block
    3. 该DataNode上后一个Block

    BlockInfo表明文件包含哪些Block、这些Block分布存在哪些DataNode、DataNode上所有Block的前后链表关系

- BlockManager：维护整个文件系统中与数据块相关的信息及数据块的状态变化

  - 为了通过blockid快速定位Block，引入BlocksMap，本质是一个链式解决冲突的哈希表
  - 集群启动时，DataNode进行BlockReport，计算每一个Block的HashCode，将对应的BlcokInfo插入到相应位置构建BlocksMap
  - 通过Block查找对应的BlockInfo时，先对Block计算HashCode，定位到对应的BlockInfo信息

- NetworkTopology：维护机架拓扑及DataNode信息，机架感知的基础

  - 树状的机架拓扑是根据机架感知在集群启动完成后建立
  - 每一个DataNode上的Block形成一个双向链表，这个链表的入口时机架拓扑结构叶子节点管理的DatanodeStorageInfo

- LeaseManager：维护文件与Lease，客户端与Lease的对应关系

  - 支持HDFS的Write-Once-Read-Many的核心数据结构

  - Lease实际上是时间约束锁，客户端写文件时需先申请一个Lease，一旦由客户端持有了某个文件的Lease，其他客户端就不能再申请到该文件的Lease