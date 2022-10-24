## **HBase的读写流程**

### HBase的存储结构

- 表中所有行按Rowkey的字典顺序排列，在行的方向上分割为多个Region
- Region是HBase分布式存储和负载均衡的最小单元，一个RegionServer有多个Region，每个RegionServer维护一个HLog日志
- Region由Store组成，每个Store保存一个列族，每个Store由一个MemStore和多个StoreFile组成，StoreFile以HFile格式保存在HDFS上

### HBase的读写流程

1. Client从Zookeeper中读取metaRegion所在RegionServer，获取metaRegion的路由信息后，再从metaRegion中定位要读写的Rowkey所关联的Region信息
2. Client会缓存Region的路由信息，避免每次读写都去访问Zookeeper或metaRegion

#### 写数据流程

1. Client向RegionServer发送写请求，RegionServer将请求转发给对应的Region，Region中写入的数据，都暂时先缓存在MemStore中，为了保障数据可靠性，会先将数据顺序写入到一个WAL（Write-Ahead-Log）日志文件中，WAL中的数据按时间顺序组织，如果内存中的数据尚未持久化，遇到断电，只需将WAL中的数据回放到Region中即可

2. 每一个列族在Region内部被抽象为一个Store对象，每一个Store有MemStore来缓存一批最近被写入的数据，在2.0版本中，默认的Flush是将正在写的MemStore中的数据归档为一个不可变的Segment，MemStore由一个可写的ActiveSegment和多个不可写的ImmutableSegment构成

3. MemStore中的数据先Flush成一个不可写的Segment，多个不可写的Segment可以在内存中进行Compaction，当达到一定阈值后才将内存中的数据持久化为HDFS中的HFile文件

4. 达到触发条件会进行Compaction，将多个HFile的交错无序状态，变成单个HFile的有序状态，降低读取延时

   小范围的HFile文件合并，称为MinorCompaction

   一个列族中将所有HFile文件合并，称为MajorCompaction，除了文件合并范围不同外，MajorCompaction还会清理过期，版本过旧以及标记删除的数据

5. 随着Region增大到阈值后，会触发Split操作，将Region一分为二

#### 读数据流程

1. 定位Rowkey所关联Region，Client发送读取请求到对应的RegionServer
2. RegionServer处理Get请求时先将Get转换成一个StartRow和StopRow重叠的Scan操作
3. 扫描MemStore和HFile查询数据响应给Client