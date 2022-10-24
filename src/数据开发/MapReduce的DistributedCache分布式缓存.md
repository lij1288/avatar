## **MapReduce的DistributedCache分布式缓存**

- 将需要缓存的文件分发到各个执行任务的子节点

- 不同文件类型添加方法

  ```java
  job.addCacheFile(uri);// 缓存普通文件到task运行节点的工作目录
  job.addCacheArchive(uri);// 缓存压缩包文件到task运行节点的工作目录
  job.addFileToClassPath(file);// 缓存普通文件到task运行节点的classpath中
  job.addArchiveToClassPath(archive);// 缓存jar包到task运行节点的classpath中
  ```

- 在Mapper类的setup()方法中读取分布式缓存文件

- 可以在原本HDFS文件路径上加"#linkName"来设置符号链接，这样可以直接调用linkName

  > new FileInputStream("linkName")