## **Flink的ExactlyOnce**

### Kafka

- 开启CheckPointing，FlinkKafkaConsumer会把偏移量保存到StateBackend，CheckPointing成功，记录的偏移量一定准确，因为CheckpointLock，偏移量没改完，不能提交，并且默认会将偏移量写入Kafka的特殊topic __consumer_offset中，目的是重启任务没指定savePint可以接着以前的偏移量消费，还有就是监控读到哪了

### 存储系统支持覆盖

- Redis、HBase

- 利用幂等性，将原来的数据覆盖

- Barrier机制，会不断给数据打上id，可以保证一个流水线的所有算子都成功才进行CheckPoint

- 容错1：Redis出现异常，写入失败，Checkpoint不会更新偏移量

- 容错2：上一次Checkpoint成功了，写入成功即将Checkpoint时任务异常，会从StateBackend恢复上一次的偏移量和计算结果，继续计算然后进行覆盖

### 存储系统不支持覆盖

- Kafka、Mysql

- 需要支持事务，成功后提交事务和更新偏移量，如果失败可以回滚并且不更新偏移量，把这次CheckPoint标记为失败继续进行下一次CheckPoint

- TwoPhaseCommitSinkFunction实现了两个接口

  CheckpointedFunction，snapshotState方法，preCommit

  CheckpointListener接口，commit方法

  保证Checkpoint和事务提交同时成功