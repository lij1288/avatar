## **Kafka的静态成员功能**

- 通过配置group.instance.id设置消费者为静态成员（Static Membership）
- 若静态成员断开连接，在超时时间（session.timeout.ms）内不会触发再均衡，直到超时后仍未恢复连接

```java
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.TopicPartition;

import java.io.IOException;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import java.util.Properties;

public class StaticDemo {
    public static void main(String[] args) throws IOException, InterruptedException {
        Properties props = new Properties();
        props.load(AssignDemo.class.getClassLoader().getResourceAsStream("consumer.properties"));
        props.setProperty(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,"earliest");
        props.setProperty(ConsumerConfig.GROUP_ID_CONFIG,"g01");
        // 设置静态成员
        props.setProperty(ConsumerConfig.GROUP_INSTANCE_ID_CONFIG,"0");
        // 设置超时时间
        props.setProperty(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG,"60000");

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);

        consumer.subscribe(List.of("demo", "demo2"), new ConsumerRebalanceListener() {
            @Override
            public void onPartitionsRevoked(Collection<TopicPartition> collection) {
                System.out.println("取消主题：" + collection);
            }

            @Override
            public void onPartitionsAssigned(Collection<TopicPartition> collection) {
                System.out.println("分配主题：" + collection);
            }
        });

        while (true){
            ConsumerRecords<String, String> msgs = consumer.poll(Duration.ofMillis(Long.MAX_VALUE));
            for(ConsumerRecord<String, String> msg:msgs){
                System.out.println(msg.value());
                Thread.sleep(200);
            }
        }
    }
}
```

