## **Flink的自定义Operator**

### Source

- 继承RichParallelSourceFunction，实现CheckpointFunction

- run，获取偏移量，读数据，更新偏移量，使用CheckpointLock加锁 

  initializeState，初始化状态或获取历史状态，定义ListStateDescriptor

  snapshotState，定期将偏移量放入状态保存到StateBackend

### Transformation

- 继承RichMapFunction

### Sink

- 继承RichSinkFunction