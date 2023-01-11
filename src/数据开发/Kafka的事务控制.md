## **Kafka的事务控制**

- KIP-98 - Exactly Once Delivery and Transactional Messaging

### Kafka的事务实现思路

- 将偏移量更新和数据落地绑定在一个事务中—>Kafka不能回滚日志—>需确保应用程序只看到提交事务部分的结果—>消费者过滤掉终止的事务消息

### Kafka的事务控制原理

- 开始事务
  - 发送ControlBatch消息（事务开始）

  提交事务
  - 发送ControlBatch消息（事务提交）

  终止事务
  - 发送ControlBatch消息（事务终止）

- 事务状态持久化到__transaction_state

```
......
trans01::TransactionMetadata(transactionalId=trans01, producerId=12001, producerEpoch=15, txnTimeoutMs=60000, state=Empty, pendingState=None, topicPartitions=Set(), txnStartTimestamp=-1, txnLastUpdateTimestamp=1673256845462)
trans01::TransactionMetadata(transactionalId=trans01, producerId=12001, producerEpoch=15, txnTimeoutMs=60000, state=Ongoing, pendingState=None, topicPartitions=Set(__consumer_offsets-20), txnStartTimestamp=1673256845546, txnLastUpdateTimestamp=1673256845546)
trans01::TransactionMetadata(transactionalId=trans01, producerId=12001, producerEpoch=15, txnTimeoutMs=60000, state=Ongoing, pendingState=None, topicPartitions=Set(__consumer_offsets-20, demo2-0), txnStartTimestamp=1673256845546, txnLastUpdateTimestamp=1673256845550)
trans01::TransactionMetadata(transactionalId=trans01, producerId=12001, producerEpoch=16, txnTimeoutMs=60000, state=PrepareAbort, pendingState=None, topicPartitions=Set(__consumer_offsets-20, demo2-0), txnStartTimestamp=1673256845546, txnLastUpdateTimestamp=1673256880912)
trans01::TransactionMetadata(transactionalId=trans01, producerId=12001, producerEpoch=16, txnTimeoutMs=60000, state=CompleteAbort, pendingState=None, topicPartitions=Set(), txnStartTimestamp=1673256845546, txnLastUpdateTimestamp=1673256880913)
trans01::TransactionMetadata(transactionalId=trans01, producerId=12001, producerEpoch=17, txnTimeoutMs=60000, state=Empty, pendingState=None, topicPartitions=Set(), txnStartTimestamp=-1, txnLastUpdateTimestamp=1673256881020)
trans01::TransactionMetadata(transactionalId=trans01, producerId=12001, producerEpoch=17, txnTimeoutMs=60000, state=Ongoing, pendingState=None, topicPartitions=Set(__consumer_offsets-20), txnStartTimestamp=1673256881115, txnLastUpdateTimestamp=1673256881115)
trans01::TransactionMetadata(transactionalId=trans01, producerId=12001, producerEpoch=17, txnTimeoutMs=60000, state=Ongoing, pendingState=None, topicPartitions=Set(__consumer_offsets-20, demo2-2), txnStartTimestamp=1673256881115, txnLastUpdateTimestamp=1673256881119)
trans01::TransactionMetadata(transactionalId=trans01, producerId=12001, producerEpoch=17, txnTimeoutMs=60000, state=PrepareCommit, pendingState=None, topicPartitions=Set(__consumer_offsets-20, demo2-2), txnStartTimestamp=1673256881115, txnLastUpdateTimestamp=1673256881252)
trans01::TransactionMetadata(transactionalId=trans01, producerId=12001, producerEpoch=17, txnTimeoutMs=60000, state=CompleteCommit, pendingState=None, topicPartitions=Set(), txnStartTimestamp=1673256881115, txnLastUpdateTimestamp=1673256881253)
......
```

### KafKa的事务API使用

```java
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.Set;

public class TransactionDemo {
    public static void main(String[] args) {
        // 配置参数
        Properties props = new Properties();
        // 消费者参数
        props.setProperty(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,"10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092");
        props.setProperty(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.setProperty(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.setProperty(ConsumerConfig.GROUP_ID_CONFIG,"g01");
        props.setProperty(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG,"false");

        // 生产者参数
        props.setProperty(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092");
        props.setProperty(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.setProperty(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        // 事务ID
        props.setProperty(ProducerConfig.TRANSACTIONAL_ID_CONFIG, "trans01");
//        // 开启幂等性（设置事务ID隐含开启幂等性）
//        props.setProperty(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, "true");
//        props.setProperty(ProducerConfig.RETRIES_CONFIG, "3");
//        props.setProperty(ProducerConfig.ACKS_CONFIG, "all");
//        props.setProperty(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, "5");

        // 实例对象
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);

        // 初始化事务
        producer.initTransactions();

        // 订阅topic
        consumer.subscribe(List.of("demo"));

        // 记录最大消费位移
        HashMap<TopicPartition, OffsetAndMetadata> offsets = new HashMap<>();

        while (true){
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(Long.MAX_VALUE));

            // 开启事务，将本次拉取的数据绑定在一个事务中
            producer.beginTransaction();

            try{
                // 获取分区
                Set<TopicPartition> topicPartitions = records.partitions();
                // 遍历所有分区
                for (TopicPartition topicPartition : topicPartitions) {
                    // 获取本分区的所有数据
                    List<ConsumerRecord<String, String>> partionRecords = records.records(topicPartition);
                    for (ConsumerRecord<String, String> record : partionRecords) {
                        // 数据处理
                        String res = record.value() + " Completed";
                        ProducerRecord<String, String> resultRecord = new ProducerRecord<>("demo2", res);
                        // 发送数据
                        producer.send(resultRecord);
                        // 偏移量处理
                        long offset = record.offset();
                        offsets.put(topicPartition, new OffsetAndMetadata(offset + 1));
                    }
                }
                // 提交偏移量
                producer.sendOffsetsToTransaction(offsets, "g01");

                // 提交事务
                producer.commitTransaction();
            }catch (Exception e){
                // 放弃本次事务
                producer.abortTransaction();
            }
        }
    }
}

```

#### transactional.id

- 事务ID，默认null，客户端在开启任何新事务前保证使用相同事务ID的事务已完成

  若配置transactional.id则隐含开启幂等性，开启事务需至少3（transaction.state.log.replication.factor）个Broker

#### isolation.level

- 隔离级别，默认read_uncommitted，返回所有消息

  设置read_committed，则只返回已提交的消息，consumer.poll()方法只返回到LSO（last stable offset）的消息

```
Dumping demo2-0/00000000000000000000.log
Starting offset: 0
baseOffset: 0 lastOffset: 0 count: 1 baseSequence: 0 lastSequence: 0 producerId: 12001 producerEpoch: 12 partitionLeaderEpoch: 0 isTransactional: true isControl: false position: 0 CreateTime: 1673254881509 size: 79 magic: 2 compresscodec: NONE crc: 1867241 isvalid: true
| offset: 0 isValid: true crc: null keySize: -1 valueSize: 11 CreateTime: 1673254881509 baseOffset: 0 lastOffset: 0 baseSequence: 0 lastSequence: 0 producerEpoch: 12 partitionLeaderEpoch: 0 batchSize: 79 magic: 2 compressType: NONE position: 0 sequence: 0 headerKeys: [] payload: 4 Completed
baseOffset: 1 lastOffset: 1 count: 1 baseSequence: -1 lastSequence: -1 producerId: 12001 producerEpoch: 12 partitionLeaderEpoch: 0 isTransactional: true isControl: true position: 79 CreateTime: 1673256742830 size: 78 magic: 2 compresscodec: NONE crc: 952136501 isvalid: true
| offset: 1 isValid: true crc: null keySize: 4 valueSize: 6 CreateTime: 1673256742830 baseOffset: 1 lastOffset: 1 baseSequence: -1 lastSequence: -1 producerEpoch: 12 partitionLeaderEpoch: 0 batchSize: 78 magic: 2 compressType: NONE position: 79 sequence: -1 headerKeys: [] endTxnMarker: COMMIT coordinatorEpoch: 0
baseOffset: 2 lastOffset: 3 count: 2 baseSequence: 1 lastSequence: 2 producerId: 12001 producerEpoch: 12 partitionLeaderEpoch: 0 isTransactional: true isControl: false position: 157 CreateTime: 1673254884173 size: 97 magic: 2 compresscodec: NONE crc: 570296983 isvalid: true
| offset: 2 isValid: true crc: null keySize: -1 valueSize: 11 CreateTime: 1673254884172 baseOffset: 2 lastOffset: 3 baseSequence: 1 lastSequence: 2 producerEpoch: 12 partitionLeaderEpoch: 0 batchSize: 97 magic: 2 compressType: NONE position: 157 sequence: 1 headerKeys: [] payload: 6 Completed
| offset: 3 isValid: true crc: null keySize: -1 valueSize: 11 CreateTime: 1673254884173 baseOffset: 2 lastOffset: 3 baseSequence: 1 lastSequence: 2 producerEpoch: 12 partitionLeaderEpoch: 0 batchSize: 97 magic: 2 compressType: NONE position: 157 sequence: 2 headerKeys: [] payload: 7 Completed
baseOffset: 4 lastOffset: 4 count: 1 baseSequence: -1 lastSequence: -1 producerId: 12001 producerEpoch: 12 partitionLeaderEpoch: 0 isTransactional: true isControl: true position: 254 CreateTime: 1673256745492 size: 78 magic: 2 compresscodec: NONE crc: 3316580587 isvalid: true
| offset: 4 isValid: true crc: null keySize: 4 valueSize: 6 CreateTime: 1673256745492 baseOffset: 4 lastOffset: 4 baseSequence: -1 lastSequence: -1 producerEpoch: 12 partitionLeaderEpoch: 0 batchSize: 78 magic: 2 compressType: NONE position: 254 sequence: -1 headerKeys: [] endTxnMarker: COMMIT coordinatorEpoch: 0
baseOffset: 5 lastOffset: 5 count: 1 baseSequence: 3 lastSequence: 3 producerId: 12001 producerEpoch: 12 partitionLeaderEpoch: 0 isTransactional: true isControl: false position: 332 CreateTime: 1673254886521 size: 79 magic: 2 compresscodec: NONE crc: 2580253690 isvalid: true
| offset: 5 isValid: true crc: null keySize: -1 valueSize: 11 CreateTime: 1673254886521 baseOffset: 5 lastOffset: 5 baseSequence: 3 lastSequence: 3 producerEpoch: 12 partitionLeaderEpoch: 0 batchSize: 79 magic: 2 compressType: NONE position: 332 sequence: 3 headerKeys: [] payload: 9 Completed
baseOffset: 6 lastOffset: 6 count: 1 baseSequence: -1 lastSequence: -1 producerId: 12001 producerEpoch: 12 partitionLeaderEpoch: 0 isTransactional: true isControl: true position: 411 CreateTime: 1673256747845 size: 78 magic: 2 compresscodec: NONE crc: 2471250377 isvalid: true
| offset: 6 isValid: true crc: null keySize: 4 valueSize: 6 CreateTime: 1673256747845 baseOffset: 6 lastOffset: 6 baseSequence: -1 lastSequence: -1 producerEpoch: 12 partitionLeaderEpoch: 0 batchSize: 78 magic: 2 compressType: NONE position: 411 sequence: -1 headerKeys: [] endTxnMarker: COMMIT coordinatorEpoch: 0
......
```
