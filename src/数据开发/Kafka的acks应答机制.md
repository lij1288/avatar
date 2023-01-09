## **Kafka的acks应答机制**

- The number of acknowledgments the producer requires the leader to have received before considering a request complete. This controls the durability of records that are sent. 

- Kafka服务端向Producer应答消息写入成功的条件

- 取值
  - all，3.0.0之后默认，等同于-1，所有的in-sync replicas将记录写入本地日志后，应答写入成功
  - 1，3.0.0之前默认，leader将记录写入本地日志后，应答写入成功
  - 0，producer不等待应答

```java
props.setProperty(ProducerConfig.ACKS_CONFIG, "all");
```

