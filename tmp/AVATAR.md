## HDFS写入机制

1. Client向NameNode请求写入一个文件，附带路径、副本数量、切块大小
2. NameNode检查路径合法性，响应可以写入
3. Client请求写入第一个Block块
4. NameNode响应blockid以及三台DataNode1、2、3
5. Client向DataNode1请求写入一个Block，附带blockid，还有DataNode2、3 DataNode1向DataNode2请求建立连接，附带blockid，还有DataNode3 DataNode2向DataNode3请求建立连接，附带blockid
6. DataNode3响应DataNode2 DataNode2响应DataNode1 DataNode1响应Client，pipeline构建完成
7. Client发送数据给DataNode1 DataNode1将数据写入同时发送给DataNode2 DataNode2将数据写入同时发送给DataNode3
8. 发送完毕，关闭pipeline
9. Client请求写入下一个Block
10. 过程中，NameNode记录元数据

## HDFS读取机制

1. Client向NameNode请求读取一个文件
2. NameNode响应文件的元数据，blockid、大小、存储位置
3. Client向最近的一台DataNode请求读取第一个Block
4. DataNode向Client发送数据
5. 第一个Block读取完后，若还需要继续读，Client向最近的一台DataNode请求读取下一个Block

## HDFS的checkpoint机制

- NameNode负责管理元数据，元数据存在内存中，但在磁盘上有元数据镜像文件FSimage和操作日志文件edits

  内存中的元数据和磁盘镜像文件有状态差，状态差体现在操作日志文件中

  SecondaryNameNode会定期将NameNode上的操作日志文件下载到本地，跟上一个状态的镜像文件合并，得到新的镜像文件并上传给NameNode，让NameNode的镜像文件和内存元数据状态差保持在一个比较小的范围

- 触发条件：时间间隔、操作事件次数、操作日志文件数目

  1分钟检查一次是否触发触发条件，两次checkpoint间的最大周期是1小时，最大操作记录是100万，最大操作日志保留数目是100万

1. 达到触发条件后，Secondary NameNode通知NameNode滚动操作日志
2. Secondary NameNode下载元数据镜像文件和操作日志
3. Secondary NameNode加载镜像文件，回放操作日志更新元数据对象，再序列化为新的镜像文件上传到NameNode

## HDFS的HA机制

1. HealthMonitor初始化完成后启动内部线程来定时调用NameNode的HAServiceProtocol接口的方法，监控健康状态
2. HealthMonitor如果监控到NameNode的健康状态发生变化，会回调ZKFailoverController注册的相应方法进行通知
3. 如果ZKFailoverController判断需要进行主备切换，会通过ActiveStandbyElector来进行自动的主备选举
4. ActiveStandbyElector与Zookeeper进行交互完成自动的主备选举
5. ActiveStandbyElector在主备选举完成后，回调ZKFailoverController的相应方法来通知主备选举结果
6. ZKFailoverController调用对应NameNode的HAServiceProtocol接口的方法将NameNode转换为Active状态或Standby状态

## HQL转化为MapReduce的过程

1. 通过开源**语法分析器**Antlr完成SQL解析，将SQL转化为**抽象语法树**（AST AbstractSyntaxTree）
2. 遍历抽象语法树，生成查询的基本组成单元**QueryBlock**，是一个递归的过程，QueryBlock包括输入源、计算过程、输出，是一个子查询
3. 遍历OueryBlock，翻译为执行操作树**OperatorTree**
4. 对OperatorTree进行优化，如分桶Map端聚合、合并相关的操作、将过滤操作提前
5. 遍历OperatorTree，翻译为**MapReduce任务**
6. 进行**物理层优化**，生成最终的执行计划

## HIVE底层与数据库交互过程

1. 命令行或WebUI等Hive接口将查询发送给**Driver**（任何数据库驱动程序如JDBC）
2. Driver借助编译器进行查询的检查和解析
3. **编译器**将元数据请求发送给**Metastore**（任何数据库）
4. Metastore将**元数据**响应给编译器
5. 编译器生成**最终计划**发送给Driver
6. Driver将**执行计划**发送给执行引擎
7. 执行引擎将任务发送到**ResourceManager**，执行MapReduce任务
8. 任务执行同时，执行引擎可以通过**Metastore**进行元数据操作
9. 任务执行结束，执行引擎从**DataNode**上获取结果并发送给Driver
10. Driver将**结果**发送给Hive接口