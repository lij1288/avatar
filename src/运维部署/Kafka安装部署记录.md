## **Kafka安装部署记录**

### 上传解压安装包

### 修改配置文件

- vi server.properties

```properties
#指定broker的id
broker.id=1
#数据存储的目录
log.dirs=/opt/app/data/kafka
#指定zk地址
zookeeper.connect=linux01:2181,linux02:2181,linux03:2181
#可以删除topic的数据(生产环境不配置)
delete.topic.enable=true
```

### 将配置好的kafka拷贝到其他节点

### 修改其他节点Kafka的broker.id

### 启动zookeeper

### 在所有节点启动Kafka

> /opt/app/kafka_2.11-1.1.1/bin/kafka-server-start.sh -daemon /opt/app/kafka_2.11-1.1.1/config/server.properties