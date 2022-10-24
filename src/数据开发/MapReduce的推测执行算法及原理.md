## **MapReduce的推测执行算法及原理**

### 机制

- 发现运行速度远慢于平均速度的任务，启动一个备份任务同时运行，采用先运行完的结果

### 前提

- 每个Task只能有一个备份任务
- 当前Job已完成的Task不少于5%
- 开启推测执行参数，默认打开

### 原理

- estimatedRunTime=(currentTimestamp-taskStartTime)/progress

  推测运行时间=(当前时间-任务启动时间)/任务进度

- estimateEndTime=taskStartTime+estimatedRunTime

  推测结束时间=任务启动时间+推测运行时间

- estimateEndTime'=currentTimestamp+averageRunTime

  推测备份任务结束时间=当前时间+完成任务平均时间

- 为estimateEndTime-estimateEndTime'最大的任务启动备份任务