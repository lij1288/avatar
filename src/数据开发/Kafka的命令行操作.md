## **Kafka的命令行操作**

### 列出topic

> kafka-topics.sh --zookeeper 10.0.43.101:2181/kafka --list

### 查看topic信息

> kafka-topics.sh --zookeeper 10.0.43.101:2181/kafka --describe --topic test

```
Topic: test	TopicId: NsNJpExiQiS_gt2o_mvfyg	PartitionCount: 3	ReplicationFactor: 3	Configs: 
	Topic: test	Partition: 0	Leader: 2	Replicas: 2,0,1	Isr: 2,0,1
	Topic: test	Partition: 1	Leader: 0	Replicas: 0,1,2	Isr: 0,1,2
	Topic: test	Partition: 2	Leader: 1	Replicas: 1,2,0	Isr: 1,2,0
```

### 创建topic

- 指定副本数量和分区数量

> kafka-topics.sh --zookeeper 10.0.43.101:2181/kafka --create --topic test --replication-factor 3 --partitions 3

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

- 指定起始偏移量重置策略

> kafka-console-consumer.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --topic test --from-beginning

- 指定消费者组

> kafka-console-consumer.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --topic test --from-beginning --group g01

- 指定分区及偏移量

> kafka-console-consumer.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --topic test --partition 2 --offset 1

- 指定再均衡分配策略

> kafka-console-consumer.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --topic demo --group g01 --consumer-property partition.assignment.strategy=org.apache.kafka.clients.consumer.RoundRobinAssignor

### 列出消费者组

> kafka-consumer-groups.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --list test-consumer-group

### 查看消费者组信息

> kafka-consumer-groups.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --describe --group g01

### 查看偏移量

> kafka-console-consumer.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --topic __consumer_offsets --formatter "kafka.coordinator.group.GroupMetadataManager\\$OffsetsMessageFormatter" --consumer.config /opt/app/kafka_2.12-2.8.1/config/server.properties --from-beginning | grep g01

```
[g01,test,0]::OffsetAndMetadata(offset=0, leaderEpoch=Optional.empty, metadata=, commitTimestamp=1672913436699, expireTimestamp=None)
[g01,test,1]::OffsetAndMetadata(offset=0, leaderEpoch=Optional.empty, metadata=, commitTimestamp=1672913436699, expireTimestamp=None)
[g01,test,2]::OffsetAndMetadata(offset=1, leaderEpoch=Optional[0], metadata=, commitTimestamp=1672913436699, expireTimestamp=None)
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

### 解析存储文件

> kafka-run-class.sh kafka.tools.DumpLogSegments --files 00000000000000000000.index --print-data-log

```
Dumping 00000000000000000000.index
offset: 55 position: 4150
offset: 300 position: 8330
```

> kafka-run-class.sh kafka.tools.DumpLogSegments --files 00000000000000000000.log --print-data-log

```
Dumping 00000000000000000000.log
Starting offset: 0
baseOffset: 0 lastOffset: 0 count: 1 baseSequence: -1 lastSequence: -1 producerId: -1 producerEpoch: -1 partitionLeaderEpoch: 0 isTransactional: false isControl: false position: 0 CreateTime: 1672034989919 size: 74 magic: 2 compresscodec: NONE crc: 1830590829 isvalid: true
| offset: 0 isValid: true crc: null keySize: -1 valueSize: 6 CreateTime: 1672034989919 baseOffset: 0 lastOffset: 0 baseSequence: -1 lastSequence: -1 producerEpoch: -1 partitionLeaderEpoch: 0 batchSize: 74 magic: 2 compressType: NONE position: 0 sequence: -1 headerKeys: [] payload: value0
baseOffset: 1 lastOffset: 1 count: 1 baseSequence: -1 lastSequence: -1 producerId: -1 producerEpoch: -1 partitionLeaderEpoch: 0 isTransactional: false isControl: false position: 74 CreateTime: 1672034990952 size: 74 magic: 2 compresscodec: NONE crc: 1124278838 isvalid: true
| offset: 1 isValid: true crc: null keySize: -1 valueSize: 6 CreateTime: 1672034990952 baseOffset: 1 lastOffset: 1 baseSequence: -1 lastSequence: -1 producerEpoch: -1 partitionLeaderEpoch: 0 batchSize: 74 magic: 2 compressType: NONE position: 74 sequence: -1 headerKeys: [] payload: value5
baseOffset: 2 lastOffset: 2 count: 1 baseSequence: -1 lastSequence: -1 producerId: -1 producerEpoch: -1 partitionLeaderEpoch: 0 isTransactional: false isControl: false position: 148 CreateTime: 1672034991976 size: 75 magic: 2 compresscodec: NONE crc: 3760709816 isvalid: true
| offset: 2 isValid: true crc: null keySize: -1 valueSize: 7 CreateTime: 1672034991976 baseOffset: 2 lastOffset: 2 baseSequence: -1 lastSequence: -1 producerEpoch: -1 partitionLeaderEpoch: 0 batchSize: 75 magic: 2 compressType: NONE position: 148 sequence: -1 headerKeys: [] payload: value10
baseOffset: 3 lastOffset: 3 count: 1 baseSequence: -1 lastSequence: -1 producerId: -1 producerEpoch: -1 partitionLeaderEpoch: 0 isTransactional: false isControl: false position: 223 CreateTime: 1672034992994 size: 75 magic: 2 compresscodec: NONE crc: 3235670643 isvalid: true
| offset: 3 isValid: true crc: null keySize: -1 valueSize: 7 CreateTime: 1672034992994 baseOffset: 3 lastOffset: 3 baseSequence: -1 lastSequence: -1 producerEpoch: -1 partitionLeaderEpoch: 0 batchSize: 75 magic: 2 compressType: NONE position: 223 sequence: -1 headerKeys: [] payload: value15
baseOffset: 4 lastOffset: 4 count: 1 baseSequence: -1 lastSequence: -1 producerId: -1 producerEpoch: -1 partitionLeaderEpoch: 0 isTransactional: false isControl: false position: 298 CreateTime: 1672034994014 size: 75 magic: 2 compresscodec: NONE crc: 3706759663 isvalid: true
| offset: 4 isValid: true crc: null keySize: -1 valueSize: 7 CreateTime: 1672034994014 baseOffset: 4 lastOffset: 4 baseSequence: -1 lastSequence: -1 producerEpoch: -1 partitionLeaderEpoch: 0 batchSize: 75 magic: 2 compressType: NONE position: 298 sequence: -1 headerKeys: [] payload: value20
baseOffset: 5 lastOffset: 5 count: 1 baseSequence: -1 lastSequence: -1 producerId: -1 producerEpoch: -1 partitionLeaderEpoch: 0 isTransactional: false isControl: false position: 373 CreateTime: 1672034995031 size: 75 magic: 2 compresscodec: NONE crc: 620151198 isvalid: true
| offset: 5 isValid: true crc: null keySize: -1 valueSize: 7 CreateTime: 1672034995031 baseOffset: 5 lastOffset: 5 baseSequence: -1 lastSequence: -1 producerEpoch: -1 partitionLeaderEpoch: 0 batchSize: 75 magic: 2 compressType: NONE position: 373 sequence: -1 headerKeys: [] payload: value25
```

### 内部topic解析

> kafka-console-consumer.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --topic __consumer_offsets --formatter "kafka.coordinator.group.GroupMetadataManager\\$GroupMetadataMessageFormatter" --from-beginning

> kafka-console-consumer.sh --bootstrap-server 10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 --topic __transaction_state --formatter "kafka.coordinator.transaction.TransactionLog\\$TransactionLogMessageFormatter" --from-beginning

### 生产者性能测试

- throughput：最大吞吐量（每秒消息数量）限制，-1为不限制

> kafka-producer-perf-test.sh --topic test --num-records 1000000 --record-size 1024 --throughput -1 --producer-props bootstrap.servers=10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092 acks=-1

```
usage: producer-performance [-h] --topic TOPIC --num-records NUM-RECORDS [--payload-delimiter PAYLOAD-DELIMITER] --throughput THROUGHPUT
                            [--producer-props PROP-NAME=PROP-VALUE [PROP-NAME=PROP-VALUE ...]] [--producer.config CONFIG-FILE] [--print-metrics]
                            [--transactional-id TRANSACTIONAL-ID] [--transaction-duration-ms TRANSACTION-DURATION] (--record-size RECORD-SIZE | --payload-file PAYLOAD-FILE)

This tool is used to verify the producer performance.

optional arguments:
  -h, --help             show this help message and exit
  --topic TOPIC          produce messages to this topic
  --num-records NUM-RECORDS
                         number of messages to produce
  --payload-delimiter PAYLOAD-DELIMITER
                         provides delimiter to be used when --payload-file is provided. Defaults to  new  line.  Note that this parameter will be ignored if --payload-file is not
                         provided. (default: \n)
  --throughput THROUGHPUT
                         throttle maximum message throughput to *approximately* THROUGHPUT messages/sec. Set this to -1 to disable throttling.
  --producer-props PROP-NAME=PROP-VALUE [PROP-NAME=PROP-VALUE ...]
                         kafka producer related configuration properties like bootstrap.servers,client.id  etc.  These  configs  take precedence over those passed via --producer.
                         config.
  --producer.config CONFIG-FILE
                         producer config properties file.
  --print-metrics        print out metrics at the end of the test. (default: false)
  --transactional-id TRANSACTIONAL-ID
                         The transactionalId to use if transaction-duration-ms is >  0.  Useful  when  testing  the performance of concurrent transactions. (default: performance-
                         producer-default-transactional-id)
  --transaction-duration-ms TRANSACTION-DURATION
                         The max age of each transaction. The commitTransaction will  be  called  after  this  time  has  elapsed.  Transactions are only enabled if this value is
                         positive. (default: 0)

  either --record-size or --payload-file must be specified but not both.

  --record-size RECORD-SIZE
                         message size in bytes. Note that you must provide exactly one of --record-size or --payload-file.
  --payload-file PAYLOAD-FILE
                         file to read the message payloads from. This works only  for  UTF-8  encoded  text  files.  Payloads  will  be  read from this file and a payload will be
                         randomly selected when sending messages. Note that you must provide exactly one of --record-size or --payload-file.
```

### 消费者性能测试

> kafka-consumer-perf-test.sh --topic test --messages 1000000 --bootstrap-server=10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092

```
Option                                   Description                            
------                                   -----------                            
--bootstrap-server <String: server to    REQUIRED unless --broker-list          
  connect to>                              (deprecated) is specified. The server
                                           (s) to connect to.                   
--broker-list <String: broker-list>      DEPRECATED, use --bootstrap-server     
                                           instead; ignored if --bootstrap-     
                                           server is specified.  The broker     
                                           list string in the form HOST1:PORT1, 
                                           HOST2:PORT2.                         
--consumer.config <String: config file>  Consumer config properties file.       
--date-format <String: date format>      The date format to use for formatting  
                                           the time field. See java.text.       
                                           SimpleDateFormat for options.        
                                           (default: yyyy-MM-dd HH:mm:ss:SSS)   
--fetch-size <Integer: size>             The amount of data to fetch in a       
                                           single request. (default: 1048576)   
--from-latest                            If the consumer does not already have  
                                           an established offset to consume     
                                           from, start with the latest message  
                                           present in the log rather than the   
                                           earliest message.                    
--group <String: gid>                    The group id to consume on. (default:  
                                           perf-consumer-50407)                 
--help                                   Print usage information.               
--hide-header                            If set, skips printing the header for  
                                           the stats                            
--messages <Long: count>                 REQUIRED: The number of messages to    
                                           send or consume                      
--num-fetch-threads <Integer: count>     DEPRECATED AND IGNORED: Number of      
                                           fetcher threads. (default: 1)        
--print-metrics                          Print out the metrics.                 
--reporting-interval <Integer:           Interval in milliseconds at which to   
  interval_ms>                             print progress info. (default: 5000) 
--show-detailed-stats                    If set, stats are reported for each    
                                           reporting interval as configured by  
                                           reporting-interval                   
--socket-buffer-size <Integer: size>     The size of the tcp RECV size.         
                                           (default: 2097152)                   
--threads <Integer: count>               DEPRECATED AND IGNORED: Number of      
                                           processing threads. (default: 10)    
--timeout [Long: milliseconds]           The maximum allowed time in            
                                           milliseconds between returned        
                                           records. (default: 10000)            
--topic <String: topic>                  REQUIRED: The topic to consume from.   
--version                                Display Kafka version.         
```

