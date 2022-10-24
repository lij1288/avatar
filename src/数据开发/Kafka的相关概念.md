## **Kafka的相关概念**

- producer
  消息生产者，发布消息到kafka集群的终端或服务
- broker
  kafka集群中安装Kafka的服务器
- topic
  每条发布到kafka集群的消息属于的类，即kafka是面向topic的 (相当于数据库中的表)
- partition
  partition是物理上的概念，每个topic包含一个或多个partition，kafka分配的单位是partition
- consumer
  从kafka集群中消费消息的终端或服务
- consumer group
  high-level consumer API中，每个consumer都属于一个consumer group，每条消息只能被consumer group中的一个consumer消费，但可以被多个consumer group消费
- replica
  partition的副本，保障partition的高可用
- leader
  replica中的一个角色，producer和consumer只跟leader交互
- follower
  replica中的一个角色，从leader中复制数据
- zookeeper
  kafka通过zookeeper来存储集群的meta信息