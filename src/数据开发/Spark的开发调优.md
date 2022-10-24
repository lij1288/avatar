## **Spark的开发调优**

### RDD相关

- 不要对同一份数据**重复创建RDD**，增加性能开销

- 尽可能**复用RDD**，减少算子执行次数
- 对多次使用的RDD进行**cache持久化**，保存到内存或磁盘，否则每次对RDD执行算子，都会重新从源头计算一次，persist可以指定持久化级别，选择顺序：
  - MEMORY_ONLY，默认，性能最高
  - MEMORY_ONLY_SER，缓存到内存前会对RDD中的数据进行序列化
  - MEMORY_AND_DISK_SER，到这一步说明数据量很大，也是优先缓存在内存中

### 算子相关

- 避免使用shuffle算子，如使用广播变量，否则会发生磁盘文件读写和数据网络传输，影响性能
- 使用**map-side预聚合的算子**，如使用reduceByKey、aggregateByKey代替groupByKey
- 使用**mapPartitions代替map**，使用**foreachPartitions代替foreach**，一次函数调用处理一个paitition的数据（可能导致内存溢出），而不是一次函数调用处理一条数据，比如可以一个partition创建一个数据库连接，写1万条mysql性能提升30%

- **filter后使用coalesce减少partiton数量**，过滤后每个task处理的partition中数据量减少了，资源浪费，Task越多，可能反而越慢

### 广播变量

- **对大变量进行广播**，如100M-1G的集合

- Broadcast后，每个Executor的内存中有一份，如果不广播，要把变量复制然后发到每个Task中，需要网络传输，而且占用更多内存

### 使用Kryo进行序列化

- 算子中使用外部变量，变量需要序列化进行网络传输

  使用序列化的持久化策略，会将RDD每个partition序列化成一个字节数组

- 可以**使用Kryo序列化**，优化性能，高10倍左右

```scala
1.	// 创建SparkConf对象。  
2.	val conf = new SparkConf().setMaster(...).setAppName(...)  
3.	// 设置序列化器为KryoSerializer。  
4.	conf.set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")  
5.	// 注册要序列化的自定义类型。  
6.	conf.registerKryoClasses(Array(classOf[MyClass1], classOf[MyClass2])
```
