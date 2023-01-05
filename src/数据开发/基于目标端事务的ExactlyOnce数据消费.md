## **基于目标端事务的ExactlyOnce数据消费**

```java
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.TopicPartition;

import java.io.IOException;
import java.sql.*;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import java.util.Properties;

public class ExactlyOnceDemo {
    public static void main(String[] args) throws IOException, SQLException {
        Properties props = new Properties();
        props.load(AssignDemo.class.getClassLoader().getResourceAsStream("consumer.properties"));
        props.setProperty(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,"earliest");
        props.setProperty(ConsumerConfig.GROUP_ID_CONFIG,"g0001");
        // 关闭自动记录消费位移
        props.setProperty(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);

        // 创建JDBC连接
        Connection conn = DriverManager.getConnection("jdbc:mysql://10.0.43.101:3306/kafka", "root", "Unidata101.");
        // 关闭自动事务提交
        conn.setAutoCommit(false);

        PreparedStatement insertRecord = conn.prepareStatement("insert into records values (?)");
        PreparedStatement updateOffset = conn.prepareStatement("insert into offsets values(? , ?) on duplicate key update offset= ?");
        PreparedStatement queryOffset = conn.prepareStatement("select offset from offsets where topic_partition = ?");


        consumer.subscribe(List.of("demo"), new ConsumerRebalanceListener() {
            @Override
            public void onPartitionsRevoked(Collection<TopicPartition> collection) {
                System.out.println("取消分区：" + collection);
            }

            @Override
            public void onPartitionsAssigned(Collection<TopicPartition> collection) {
                try {
                    for (TopicPartition topicPartition : collection) {
                        // 去查询mysql中的t_offsets表，得到自己拥有消费权的分区的消费位移记录
                        queryOffset.setString(1, topicPartition.topic() + "-" + topicPartition.partition());
                        ResultSet resultSet = queryOffset.executeQuery();
                        resultSet.next();
                        long offset = resultSet.getLong("offset");

                        System.out.println("分配分区：" + topicPartition + "，偏移量：" + offset);

                        // 指定起始partition和offset
                        consumer.seek(topicPartition, offset);
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        while (true){
            ConsumerRecords<String, String> msgs = consumer.poll(Duration.ofMillis(Long.MAX_VALUE));
            for(ConsumerRecord<String, String> msg:msgs){
                try{
                    // 获取数据
                    insertRecord.setString(1, msg.value());
                    insertRecord.execute();
                    // 更新消费位移
                    System.out.println("更新消费位移：" + msg.topic() + "-" + msg.partition() + " -> " + (msg.offset()+1));
                    updateOffset.setString(1, msg.topic() + "-" + msg.partition());
                    updateOffset.setLong(2, msg.offset() + 1);
                    updateOffset.setLong(3, msg.offset() + 1);
                    updateOffset.execute();
                    // 提交事务
                    conn.commit();

                }catch (Exception e){
                    e.printStackTrace();
                    // 事务回滚
                    conn.rollback();
                }
            }
        }
    }
}

```

