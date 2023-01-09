## **Kafka的幂等性实现**

- enable.idempotence，3.0.0之前默认false，3.0.0之后默认true，开启幂等性，避免生产者重试发送导致的数据重复
  - 开启要求（默认值符合）
    - retries > 0
    - acks = all
    - max.in.flight.requests.per.connection <= 5

> props.setProperty(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, "true");

1. 每个Producer在初始化时生成一个producer_id，并为每个目标partition维护一个消息序列号
2. Producer每发送一条消息，则将<producer_id, partition>对应的序列号增加1
3. Broker端为每个<producer_id, partition>维护一个序列化，并对每条收到的消息，对比服务端的SN_OLD和所接收消息的SN_NEW
   - 若SN_OLD+1=SN_NEW，正常写入
   - 若SN_OLD+1>SN_NEW，数据重复，不进行写入
   - SN_OLD+1<SN_NEW，抛出异常OutOfOrderSequenceException

```
Dumping 00000000000000000000.log
Starting offset: 0
baseOffset: 0 lastOffset: 3 count: 4 baseSequence: 0 lastSequence: 3 producerId: 12000 producerEpoch: 0 partitionLeaderEpoch: 13 isTransactional: false isControl: false position: 0 CreateTime: 1672901399510 size: 113 magic: 2 compresscodec: NONE crc: 166268770 isvalid: true
| offset: 0 isValid: true crc: null keySize: -1 valueSize: 6 CreateTime: 1672901399497 baseOffset: 0 lastOffset: 3 baseSequence: 0 lastSequence: 3 producerEpoch: 0 partitionLeaderEpoch: 13 batchSize: 113 magic: 2 compressType: NONE position: 0 sequence: 0 headerKeys: [] payload: value0
| offset: 1 isValid: true crc: null keySize: -1 valueSize: 6 CreateTime: 1672901399510 baseOffset: 0 lastOffset: 3 baseSequence: 0 lastSequence: 3 producerEpoch: 0 partitionLeaderEpoch: 13 batchSize: 113 magic: 2 compressType: NONE position: 0 sequence: 1 headerKeys: [] payload: value3
| offset: 2 isValid: true crc: null keySize: -1 valueSize: 6 CreateTime: 1672901399510 baseOffset: 0 lastOffset: 3 baseSequence: 0 lastSequence: 3 producerEpoch: 0 partitionLeaderEpoch: 13 batchSize: 113 magic: 2 compressType: NONE position: 0 sequence: 2 headerKeys: [] payload: value6
| offset: 3 isValid: true crc: null keySize: -1 valueSize: 6 CreateTime: 1672901399510 baseOffset: 0 lastOffset: 3 baseSequence: 0 lastSequence: 3 producerEpoch: 0 partitionLeaderEpoch: 13 batchSize: 113 magic: 2 compressType: NONE position: 0 sequence: 3 headerKeys: [] payload: value9
......
```

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;

public class IdempotenceDemo {
    public static void main(String[] args) {
        // 配置参数
        Properties props = new Properties();
        props.setProperty(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092");
        props.setProperty(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.setProperty(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        // 开启幂等性
        props.setProperty(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, "true");
        props.setProperty(ProducerConfig.RETRIES_CONFIG, "3");
        props.setProperty(ProducerConfig.ACKS_CONFIG, "all");
        props.setProperty(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, "5");

        // Producer实例对象
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);
        for(int i=0; i<10; i++){
            ProducerRecord<String, String> msg = new ProducerRecord<>("demo2", i%3,null, "value"+i);
            producer.send(msg);
        }
        // 释放资源
        producer.close();
    }
}
```

