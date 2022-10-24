## **基于Docker的Kafka安装**

### 拉取镜像

> docker pull wurstmeister/zookeeper
>
> docker pull wurstmeister/kafka

### 启动Zookeeper

> docker run -d --name zk -p 2181:2181 -t wurstmeister/zookeeper

### 启动Kafka

> docker run -d --name kfk \
> -p 9092:9092 \
> -e KAFKA_BROKER_ID=0 \
> -e KAFKA_ZOOKEEPER_CONNECT=192.168.1.111:2181 \
> -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.1.111:9092 \
> -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 wurstmeister/kafka

### 进入容器

> docker exec -it kfk bash

### 创建生产者和消费者

> cd /opt/kafka
>
> ./bin/kafka-console-producer.sh --broker-list 192.168.1.111:9092 --topic test
>
> ./bin/kafka-console-consumer.sh --bootstrap-server 192.168.1.111:9092 --topic test --from-beginning

### Flink连接测试

```java
package test;

import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaConsumer;

import java.util.Properties;

public class KafkaSource {

    public static void main(String[] args) throws Exception {

        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        Properties props = new Properties();
        //指定Kafka的Broker地址
        props.setProperty("bootstrap.servers", "192.168.1.111:9092");
        //指定组ID
        props.setProperty("group.id", "test");
        //如果没有记录偏移量，第一次从最开始消费
        props.setProperty("auto.offset.reset", "earliest");
        //kafka的消费者不自动提交偏移量
        props.setProperty("enable.auto.commit", "false");
        
        //KafkaSource
        FlinkKafkaConsumer<String> kafkaSource = new FlinkKafkaConsumer<>(
                "test",
                new SimpleStringSchema(),
                props);
        //Source
        DataStream<String> lines = env.addSource(kafkaSource);
        //Sink
        lines.print();

        env.execute("KafkaSource");
    }
}
```