## **Kafka的相关操作**

### 查看topic

> /usr/apps/kafka_2.11-1.1.1/bin/kafka-topics.sh --list --zookeeper linux01:2181

### 创建topic

> /usr/apps/kafka_2.11-1.1.1/bin/kafka-topics.sh --zookeeper linux01:2181 --create --topic test --replication-factor 3 --partitions 3

### 启动一个命令行生产者

> kafka-console-producer.sh --broker-list 10.0.43.101:9092,10.0.43.102:909210.0.43.103:9092 --topic test

### 启动一个命令行消费者

- --from-beginning 消费以前产生的所有数据，否则消费消费者启动后产生的数据

> /usr/apps/kafka_2.11-1.1.1/bin/kafka-console-consumer.sh --bootstrap-server linux01:9092,linux02:9092,linux03:9092 --topic test --from-beginning

### 在zkCli查看broker信息

```
[zk: localhost:2181(CONNECTED) 1] ls /brokers
[ids, topics, seqid]
[zk: localhost:2181(CONNECTED) 2] ls /brokers/topics
[test, __consumer_offsets]
[zk: localhost:2181(CONNECTED) 3] ls /brokers/topics/test
[partitions]
[zk: localhost:2181(CONNECTED) 4] ls /brokers/topics/test/partitions
[0, 1, 2]
[zk: localhost:2181(CONNECTED) 5] ls /brokers/topics/test/partitions/0
[state]
[zk: localhost:2181(CONNECTED) 7] get /brokers/topics/test/partitions/0/state   
{"controller_epoch":8,"leader":104,"version":1,"leader_epoch":0,"isr":[104,105,103]}
cZxid = 0x7f0000002e
ctime = Sun Oct 06 17:02:06 CST 2019
mZxid = 0x7f0000002e
mtime = Sun Oct 06 17:02:06 CST 2019
pZxid = 0x7f0000002e
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 84
numChildren = 0
```

### 查看topic状态

```
[root@linux01 kafka_2.11-1.1.1]# bin/kafka-topics.sh --zookeeper linux01:2181 --describe --topic test
Topic:test      PartitionCount:3        ReplicationFactor:3     Configs:
Topic: test     Partition: 0    Leader: 104     Replicas: 104,105,103   Isr: 104,105,103
Topic: test     Partition: 1    Leader: 105     Replicas: 105,103,104   Isr: 105,103,104
Topic: test     Partition: 2    Leader: 103     Replicas: 103,104,105   Isr: 103,104,105
```

```
[root@linux01 kafka_2.11-1.1.1]# bin/kafka-topics.sh --zookeeper linux01:2181 --create --topic test2 --replication-factor 3 --partitions 2
Created topic "test2".
[root@linux01 kafka_2.11-1.1.1]# bin/kafka-topics.sh --zookeeper linux01:2181 --describe --topic test2
Topic:test2     PartitionCount:2        ReplicationFactor:3     Configs:
Topic: test2    Partition: 0    Leader: 105     Replicas: 105,103,104   Isr: 105,103,104
Topic: test2    Partition: 1    Leader: 103     Replicas: 103,104,105   Isr: 103,104,105
```

```
[root@linux01 kafka_2.11-1.1.1]# bin/kafka-topics.sh --zookeeper linux01:2181 --create --topic test3 --replication-factor 2 --partitions 3
Created topic "test3".
[root@linux01 kafka_2.11-1.1.1]# bin/kafka-topics.sh --zookeeper linux01:2181 --describe --topic test3
Topic:test3     PartitionCount:3        ReplicationFactor:2     Configs:
Topic: test3    Partition: 0    Leader: 104     Replicas: 104,103       Isr: 104,103
Topic: test3    Partition: 1    Leader: 105     Replicas: 105,104       Isr: 105,104
Topic: test3    Partition: 2    Leader: 103     Replicas: 103,105       Isr: 103,105
```

```
[root@linux01 kafka_2.11-1.1.1]# bin/kafka-topics.sh --zookeeper linux01:2181 --create --topic test4 --replication-factor 2 --partitions 4
Created topic "test4".
[root@linux01 kafka_2.11-1.1.1]# bin/kafka-topics.sh --zookeeper linux01:2181 --describe --topic test4
Topic:test4     PartitionCount:4        ReplicationFactor:2     Configs:
Topic: test4    Partition: 0    Leader: 103     Replicas: 103,104       Isr: 103,104
Topic: test4    Partition: 1    Leader: 104     Replicas: 104,105       Isr: 104,105
Topic: test4    Partition: 2    Leader: 105     Replicas: 105,103       Isr: 105,103
Topic: test4    Partition: 3    Leader: 103     Replicas: 103,105       Isr: 103,105
```

### 删除topic

> /usr/apps/kafka_2.11-1.1.1/bin/kafka-topics.sh --delete --topic test --zookeeper linux01:2181

### 查看某个topic的偏移量

> bin/kafka-console-consumer.sh --topic __consumer_offsets  --bootstrap-server linux01:9092,linux02:9092,linux03:9092  --formatter "kafka.coordinator.group.GroupMetadataManager\$OffsetsMessageFormatter" --consumer.config /usr/apps/kafka_2.11-1.1.1/config/server.properties --from-beginning

过滤出组g101的数据

> bin/kafka-console-consumer.sh --topic __consumer_offsets  --bootstrap-server linux01:9092,linux02:9092,linux03:9092  --formatter "kafka.coordinator.group.GroupMetadataManager\$OffsetsMessageFormatter" --consumer.config /usr/apps/kafka_2.11-1.1.1/config/server.properties --from-beginning | grep g101