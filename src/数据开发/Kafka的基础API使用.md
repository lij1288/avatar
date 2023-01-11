## **Kafka的基础API使用**

- 客户端只需要知道一台服务器地址，就可以获知整个集群的信息，指定多台服务器地址防止指定的服务器不在线

- 序列化和反序列化
  - Kafka底层的存储没有类型维护机制
  - Producer需要一个针对所发送数据类型的序列化工具类，且这个工具类需要实现Kafka的序列化接口（org.apache.kafka.common.serialization.Serializer）
  - Consumer需要一个针对所消费数据类型的反序列化工具类，且这个工具类需要实现Kafka的反序列化接口（org.apache.kafka.common.serialization.Deserializer）

- 数据的时间戳类型
  - log.message.timestamp.type
    - CreateTime：producer创建数据的时间
    - LogAppendTime：broker写入log文件的时间

- 生产者写入数据时的分区选择
  - 若未指定分区编号和key，则采用轮询策略将数据均匀写入分区
  - 若指定了分区编号，则写入对应分区
  - 若未指定分区编号，指定了key，则分区编号为对key的哈希值以分区数取模
  
  ```java
  public ProducerRecord(String topic, Integer partition, K key, V value) {
      this(topic, partition, (Long)null, key, value, (Iterable)null);
  }
  ```
  
- 消费者起始偏移量重置策略

  - 消费者从所属组之前记录的偏移量开始消费，若没有记录的偏移量则采用重置策略确定起始偏移量

  - latest，默认，重置到每个分区最后新的一条消息
  - earliest，重置到每个分区最开始的一条消息

  - none，无重置策略，没有记录的偏移量则抛出错误

- 取消订阅

  ```java
  consumer.unsubscribe();
  consumer.subscribe(new ArrayList<String>());
  consumer.assign(new ArrayList<TopicPartition>());
  ```

  

### ProducerDemo

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;

public class ProducerDemo {
    public static void main(String[] args) throws InterruptedException {
        
        // 配置参数
        Properties props = new Properties();
        props.setProperty(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092");
        props.setProperty(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.setProperty(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        // 消息发送应答级别
        props.setProperty(ProducerConfig.ACKS_CONFIG, "all");
        
        // 生产者客户端
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);
        for(int i=0; i<100; i++){
            // 指定key
//            ProducerRecord<String, String> record = new ProducerRecord<>("demo", "key"+i, "value"+i);
            // 指定分区编号
            ProducerRecord<String, String> record = new ProducerRecord<>("demo", i%3,null, "value"+i);
            producer.send(record);
            Thread.sleep(200);
        }
        
        // 关闭客户端
        producer.close();
    }
}
```

### ConsumerDemo

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.header.Headers;
import org.apache.kafka.common.record.TimestampType;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.Properties;

public class ConsumerDemo {
    public static void main(String[] args) throws InterruptedException {
        // 配置参数
        Properties props = new Properties();
        props.setProperty(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,"10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092");
        props.setProperty(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.setProperty(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        // 消费者组设置
        props.setProperty(ConsumerConfig.GROUP_ID_CONFIG,"g01");
        // 消费起始偏移量
        props.setProperty(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,"earliest");
        // 自动记录最新的消费位移，默认true
        props.setProperty(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG,"true");
        // 记录消费位移的时间间隔，默认5000
        props.setProperty(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG,"5000");

        // 消费组客户端
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
        // 订阅topic，可订阅多个
        consumer.subscribe(List.of("demo"));

        while (true){
            // 客户端拉取数据时，如果服务端未响应，会保持连接等待服务端响应
            // 指定客户端等待的最大时长
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(Long.MAX_VALUE));
            for(ConsumerRecord<String, String> record:records){
                String key = record.key();
                String value = record.value();
                String topic = record.topic();
                int partition = record.partition();
                long offset = record.offset();
                // 时间戳类型
                TimestampType timestampType = record.timestampType();
                long timestamp = record.timestamp();
                // 当前这条数据所在分区的leader的纪年
                Optional<Integer> leaderEpoch = record.leaderEpoch();
                // 生产者写入数据时添加的数据头
//                Headers headers = record.headers();

                System.out.println(String.format("key: %s, value: %s, topic: %s, partition: %d ,offset: %d, timestampType: %s, timestamp: %d, leaderEpoch: %s",
                        key,value,topic,partition,offset,timestampType.name,timestamp,leaderEpoch.get()));

                Thread.sleep(200);
            }
        }
    }
}
```

### AssignDemo

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.TopicPartition;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.Properties;

public class AssignDemo {
    public static void main(String[] args) throws IOException, InterruptedException {
        Properties props = new Properties();
        props.load(AssignDemo.class.getClassLoader().getResourceAsStream("consumer.properties"));
        props.setProperty(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,"earliest");
        props.setProperty(ConsumerConfig.GROUP_ID_CONFIG,"g01");

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);

        consumer.assign(List.of(new TopicPartition("demo", 0)));

        // 指定起始partition和offset
        consumer.seek(new TopicPartition("demo",0),5);


        while (true){
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(Long.MAX_VALUE));
            for(ConsumerRecord<String, String> record:records){
                System.out.println(String.format("key: %s, value: %s, topic: %s, partition: %d ,offset: %d, timestampType: %s, timestamp: %d, leaderEpoch: %s",
                        record.key(),record.value(),record.topic(),record.partition(),record.offset(),record.timestampType().name,record.timestamp(),record.leaderEpoch().get()));

                Thread.sleep(200);
            }
        }
    }
}
```

### ProducerDemo

```scala
import java.util.{Properties, UUID}

import org.apache.kafka.clients.producer.{KafkaProducer, ProducerRecord}
import org.apache.kafka.common.serialization.StringSerializer

object ProducerDemo {
  def main(args: Array[String]): Unit = {

    // 配置参数
    val props = new Properties()

    // 连接kafka节点
    props.setProperty("bootstrap.servers", "10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092")
    // 指定key序列化方式
    props.setProperty("key.serializer", "org.apache.kafka.common.serialization.StringSerializer")
    // 指定value序列化方式
    props.setProperty("value.serializer", classOf[StringSerializer].getName)

    val topic = "demo"

    // 生产者客户端
    val producer: KafkaProducer[String, String] = new KafkaProducer[String, String](props)

    for(i <- 41 to 50){
      val record: ProducerRecord[String, String] = new ProducerRecord[String, String](topic, UUID.randomUUID().toString, "value-" + i)
      // 发送消息
      producer.send(record)
    }

    // 关闭客户端
    producer.close()
  }
}
```



### ConsumerDemo

```scala
import java.util
import java.util.Properties

import org.apache.kafka.clients.consumer.{ConsumerRecords, KafkaConsumer}
import org.apache.kafka.common.serialization.StringDeserializer

object ConsumerDemo {
  def main(args: Array[String]): Unit = {

    // 配置参数
    val props = new Properties()

    props.setProperty("bootstrap.servers", "10.0.43.101:9092,10.0.43.102:9092,10.0.43.103:9092")
    props.setProperty("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer")
    props.setProperty("value.deserializer", classOf[StringDeserializer].getName)
    props.setProperty("group.id", "g01")
    props.setProperty("auto.offset.reset", "earliest")
//    props.setProperty("enable.auto.commit", "false")

    // 消费者客户端
    val consumer: KafkaConsumer[String, String] = new KafkaConsumer[String, String](props)

    // 订阅topic，参数类型为java的集合，可以订阅多个topic
    val topic: util.List[String] = java.util.Arrays.asList("test")
    consumer.subscribe(topic)

    while(true){
      // 指定超时时长
      val records: ConsumerRecords[String, String] = consumer.poll(2000)

      import scala.collection.JavaConversions._
      for(cr <- records){
        println(cr)
      }
    }
  }
}
```

