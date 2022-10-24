## **Flume的相关概念**

### Flume

- Flume是一个数据采集工具，支持在日志系统中定制各类数据源，用于收集数据，并可对数据进行简单处理，写到各种数据接受方（hdfs、hbase、hive、kafka）
- Flume是一个高可用的、高可靠的、分布式的海量日志采集、汇聚和传输工具
- Flume可以采集文件、socket数据包、文件夹、kafka等各种形式源数据，并可将采集到的数据输出到HDFS、HBase、Hive、Kafka等多种外部存储系统中

### Agent

- Flume采集系统是由一个个agent连接起来所形成的一个或简单或复杂的数据传输通道
- 每一个agent是一个独立的守护进程（JVM），负责从数据源接收数据，并发往下一个目的地
- agent内部有三个组件：
  - source：采集组件，用于跟数据源对接，以获取数据
  - channel：传输通道组件，用于从source将数据传递到sink
  - sink：下沉组件，用于往下一集agent传递数据或向最终稿存储系统传递数据

### Event

- 数据在Flume内部以Event的封装形式存在, source组件在获取原始数据后，封装成Event放入channel，sink组件从channel中取出Event后，根据配置要求，转成其他形式的数据输出
- Event封装对象由两部分组成:
  - Header：是一个Map[String,String]，携带kv形式的元数据
  - Body：是一个字节数组, 装着具体的数据内容

### Transaction

- Flume使用两个独立的事务分别负责从source到channel，以及从channel到sink的event传输
- batchsize <= transactionCapacity <= capacity

### Interceptor

- 拦截器工作在source组件之后，从source获得event，做一个逻辑处理，再返回处理之后的event

- 可以在不需要改动source代码的情况下插入一些数据处理逻辑

- 拦截器的调用顺序

  SourceRunner -> source的start()方法 -> 读到一批数据, 调用chennelProcessor.processEventBatch(events)

  processEventBatch方法中调拦截器进行拦截处理 -> 调选择器selector获取要发送的channel -> 提交数据