## **Kafka的Timed out waiting for connection while in state: CONNECTING问题处理**

### 问题记录

- 宕机节点重启失败

- 报错内容

> kafka.zookeeper.ZooKeeperClientTimeoutException: Timed out waiting for connection while in state: CONNECTING

### 解决过程

- 修改server.properties中客户端与Zookeeper建立连接的超时时间

> zookeeper.connection.timeout.ms=60000