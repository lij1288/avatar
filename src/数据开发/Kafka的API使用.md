## **Kafka的API使用**

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
    props.setProperty("bootstrap.servers", "linux01:9092,linux02:9092,linux03:9092")
    // 指定key序列化方式
    props.setProperty("key.serializer", "org.apache.kafka.common.serialization.StringSerializer")
    // 指定value序列化方式
    props.setProperty("value.serializer", classOf[StringSerializer].getName)

    val topic = "test"

    // 生产者的实例对象
    val producer: KafkaProducer[String, String] = new KafkaProducer[String, String](props)

    for(i <- 41 to 50){

      // 不指定key和分区，默认策略是轮询，将数据均匀写入多个分区中
//      val record: ProducerRecord[String, String] = new ProducerRecord[String, String](topic, "value-" + i)

      // 指定分区编号
//      val record: ProducerRecord[String, String] = new ProducerRecord[String, String](topic, 1, null, "value-" + i)

      // 指定数据均匀写入3个分区中
//      val partitionNum = i % 3
//      val record: ProducerRecord[String, String] = new ProducerRecord[String, String](topic, partitionNum, null, "value-" + i)

      // 不指定分区编号，指定key，分区编号为key.hashcode % 3
//      val record: ProducerRecord[String, String] = new ProducerRecord[String, String](topic, "mykey", "value-" + i)

      val record: ProducerRecord[String, String] = new ProducerRecord[String, String](topic, UUID.randomUUID().toString, "value-" + i)

      // 发送消息
      producer.send(record)
    }

    // 释放资源
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

    // 连接kafka节点
    props.setProperty("bootstrap.servers", "linux01:9092,linux02:9092,linux03:9092")
    // 指定key反序列方式
    props.setProperty("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer")
    // 指定value反序列化方式
    props.setProperty("value.deserializer", classOf[StringDeserializer].getName)

    // 指定group.id
    props.setProperty("group.id", "g101")

    // 指定消费的offset从哪里开始，earliest--从头开始，latest--从消费者启动后开始
    props.setProperty("auto.offset.reset", "earliest")

    // 是否自动提交偏移量
    // 默认为true, 消费者每5s更新偏移量, groupid,topic,partition -> offset
//    props.setProperty("enable.auto.commit", "false")

    // 消费者的实例对象
    val consumer: KafkaConsumer[String, String] = new KafkaConsumer[String, String](props)

    // 订阅topic，参数类型为java的集合，可以订阅多个topic
    val topic: util.List[String] = java.util.Arrays.asList("test")
    consumer.subscribe(topic)

    while(true){
      // 拉取数据，timeout=2000，拉取同一条数据超过2s则认为超时
      val msgs: ConsumerRecords[String, String] = consumer.poll(2000)

      import scala.collection.JavaConversions._
      for(cr <- msgs){
        println(cr)
      }
    }
  }
}
```

