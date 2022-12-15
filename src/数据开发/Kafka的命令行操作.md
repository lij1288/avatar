## **Kafka的命令行操作**

### 查看topic

> kafka-topics.sh --zookeeper 10.0.43.101:2181/kafka --list

### 查看topic状态

> kafka-topics.sh --zookeeper 10.0.43.101:2181/kafka --describe --topic test

```
Topic: test	TopicId: NsNJpExiQiS_gt2o_mvfyg	PartitionCount: 3	ReplicationFactor: 3	Configs: 
	Topic: test	Partition: 0	Leader: 2	Replicas: 2,0,1	Isr: 2,0,1
	Topic: test	Partition: 1	Leader: 0	Replicas: 0,1,2	Isr: 0,1,2
	Topic: test	Partition: 2	Leader: 1	Replicas: 1,2,0	Isr: 1,2,0
```

### 创建topic

- 指定副本数量和分区数量

> kafka-topics.sh --zookeeper linux01:2181 --create --topic test --replication-factor 3 --partitions 3

- 指定分配方案

> kafka-topics.sh --zookeeper 10.0.43.101:2181/kafka --create --topic test --replica-assignment 0:1,2:1

partition0所在broker为0、1且leader为0，partition1所在broker为1、2且leader为2

### 删除topic

> kafka-topics.sh --zookeeper 10.0.43.101:2181/kafka --delete --topic test

### 增加partition

> kafka-topics.sh --zookeeper 10.0.43.101:2181/kafka --alter --topic test --partitions 3

### 启动命令行生产者

> kafka-console-producer.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --topic test

> (kafka-console-producer.sh --broker-list 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --topic test)

### 启动命令行消费者

- --from-beginning 消费以前产生的所有数据，否则消费消费者组未消费的数据

> kafka-console-consumer.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --topic test --from-beginning

- --group 指定消费者组

> kafka-console-consumer.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --topic test --from-beginning --group g01

- 指定分区及偏移量

> kafka-console-consumer.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --topic test --partition 2 --offset 1

### 查看偏移量

> kafka-console-consumer.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --topic __consumer_offsets --formatter "kafka.coordinator.group.GroupMetadataManager\\$OffsetsMessageFormatter" --consumer.config /opt/app/kafka_2.12-2.8.1/config/server.properties --from-beginning | grep g01

```
[g01,test,1]::OffsetAndMetadata(offset=6, leaderEpoch=Optional[0], metadata=, commitTimestamp=1671087356104, expireTimestamp=None)
[g01,test,0]::OffsetAndMetadata(offset=6, leaderEpoch=Optional[0], metadata=, commitTimestamp=1671087356104, expireTimestamp=None)
[g01,test,2]::OffsetAndMetadata(offset=7, leaderEpoch=Optional[0], metadata=, commitTimestamp=1671087356104, expireTimestamp=None)
```

### 在zkCli查看broker信息

```
[zk: localhost:2181(CONNECTED) 0] ls /kafka
[cluster, controller_epoch, controller, brokers, feature, admin, isr_change_notification, consumers, log_dir_event_notification, latest_producer_id_block, config]
[zk: localhost:2181(CONNECTED) 1] get /kafka/brokers/topics/test/partitions/0/state
{"controller_epoch":1,"leader":2,"version":1,"leader_epoch":0,"isr":[2,0,1]}
cZxid = 0x300000506
ctime = Wed Dec 14 15:31:02 CST 2022
mZxid = 0x300000506
mtime = Wed Dec 14 15:31:02 CST 2022
pZxid = 0x300000506
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 76
numChildren = 0
```

### 动态配置管理

- 查看配置

> kafka-configs.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --describe --entity-type topics --entity-name test

> kafka-configs.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --describe --entity-type brokers --entity-name 0

- 修改配置

> kafka-configs.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --alter --entity-type topics --entity-name test --add-config flush.messages=1

> kafka-topics.sh --zookeeper 10.0.43.101:2181/kafka --alter --topic test --config flush.messages=1

```
[zk: localhost:2181(CONNECTED) 0] get /kafka/config/topics/test
{"version":1,"config":{"flush.messages":"1"}}
cZxid = 0x3000004fc
ctime = Wed Dec 14 15:31:02 CST 2022
mZxid = 0x300000642
mtime = Thu Dec 15 16:11:09 CST 2022
pZxid = 0x3000004fc
cversion = 0
dataVersion = 3
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 45
numChildren = 0
```

- 删除配置

> kafka-configs.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --alter --entity-type topics --entity-name test --delete-config flush.messages

> kafka-topics.sh --zookeeper 10.0.43.101:2181/kafka --alter --topic test --delete-config flush.messages
