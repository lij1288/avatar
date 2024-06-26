## MySQL的索引机制与使用

- 索引：帮助高效获取数据的数据结构
- MySQL索引上限为16个

- 作用
  - 减少磁盘IO次数，保证数据唯一性，加速表连接，减少分组和排序的时间
- 影响
  - 创建和维护耗费时间，占用磁盘空间，降低更新表的速度

### 索引的分类

#### 聚簇索引

![](assets\MySQL的索引机制与使用\聚簇索引.jpg)

- 不是一种单独的索引类型，而是一种数据存储方式（所有用户记录都存储在叶子节点），索引即数据，数据行和相邻的键值存储在一起
- **聚簇索引在MySQL中不需要显式地使用index语句创建，InnoDB存储引擎会自动创建聚簇索引**
- 特点
  - 页内记录按主键大小顺序组成单向链表
  - 各个存放用户记录的页按页中记录的主键大小组成双向链表
  - 存放目录项记录的页分为不同层次，同一层次的页按页中目录项记录的主键大小组成双向链表
  - **叶子节点存放完整的用户记录**
- 记录的组成部分
  - 记录类型：**0普通记录、1目录项记录**、2最小记录、3最大记录
  - 下一条记录地址相对本条记录地址的偏移量
  - 各列的值：c1、c2、c3...
  - 其他信息
- B+树的形成过程
  - 表创建后没有数据时，根节点中没有用户记录和目录项记录
  - 插入用户记录时，先存储到根节点中
  - 根节点没有空间后再插入用户记录，根节点的所有记录复制到一个新分配的页a，然后对新页进行**页分裂**，得到另一个新页，新插入的记录根据键值大小分配的两个新叶中，根节点升级为存储目录项的页
- 使用影响
  - 插入速度依赖于插入顺序，使用自增ID为主键
  - 更新主键会导致被更新的记录移动，设置主键为不可更新

#### 二级索引![](assets\MySQL的索引机制与使用\二级索引.jpg)

- 需进行**回表**，根据二级索引确定主键值后，通过聚簇索引查找数据

- 特点

  - 页内记录按c2列的大小顺序排成单向链表

  - 各个存放用户记录的页按页中记录的c2列大小组成双向链表

  - 存放目录项记录的页分为不同层次，同一层次的页按页中目录项记录的c2列大小组成双向链表

  - **叶子节点不存放完整用户记录，存放c2列和主键**

  - **目录项节点为保证目录项记录的唯一性，存放c2列和主键**
- **联合索引**
  - 各个记录和页按c2列排序，在c2列相同的情况下按c3列进行排序

### InnoDB和MyISAM

- InnoDB有聚簇索引和二级索引，其中聚簇索引叶子节点保存完整的数据记录，MyISAM的索引都是二级索引，叶子节点保存索引和数据的地址，需进行回表
- MyISAM的回表操作是根据地址偏移量进行取数，速度快于InnoDB获取主键后再到聚簇索引取数
- InnoDB必须有主键，若没有定义主键，InnoDB会选择非空的唯一列替代，若没有非空唯一列，则隐式定义主键作为主键，MyISAM可以没有主键
