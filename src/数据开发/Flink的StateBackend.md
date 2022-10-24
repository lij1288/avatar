## **Flink的StateBackend**

### MemoryStateBackend 

- state保存在内存中，执行checkpoint时，state快照保存到JobManager内存中

### FsStateBackend 

- state保存在内存中，执行checkpoint时，state快照保存到配置的文件系统(可以是HDFS)

### RocksDBBackend 

- 克服了受内存限制的缺点，又可以持久化到远程文件系统

- state直接写入TaskManager本地RocksDB数据库，checkpoint时，本地的数据增量写入配置的远程文件系统（可以是HDFS）

- 适用场景：使用大量large state、long windows、large key/value state（如布隆过滤器）

- 整合方式：1. 在pom文件添加依赖 2. 修改全局配置文件flink-conf.yaml