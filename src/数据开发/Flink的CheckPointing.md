## **Flink的CheckPointing**

- 为了容错，定期将计算结果保存到指定存储系统的机制

  > env.enableCheckpointing(1000);



- JobManager定期向TaskManager中的SubTask发送RPC消息，SubTask将计算的State保存到StateBackEnd，并向JobManager响应是否成功，如果程序出现异常重启，TaskManager中的SubTask可以从上一次成功Checkpoint的State恢复



- 默认重启策略是无限重启，一般设置重启次数每次间隔时间



- 设置程序异常退出或主动取消不删除checkpoint数据



- 可以指定恢复数据的目录Savepoint Paths，启动任务-s参数