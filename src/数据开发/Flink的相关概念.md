## **Flink的相关概念**

### JobManager

- Flink中的管理进程
- 管理TaskManager，生成Task
- 类似Spark中的Master+Driver

### TaskManager

- Flink中负责执行管理计算资源和执行SubTask的进程
- 类似Saprk中的Worker + Executor

### Client

- 提交任务的客户端，可以用命令行提交，也可以用浏览器提交

### Task

- 一个阶段多个功能相同的SubTask的集合
- 类似Spark中的TaskSet

### SubTask

- Flink中任务的最小执行单元，是一个Java类的实例，有属性和方法，完成具体的计算逻辑
- 类似Spark中的Task

### Operator Chain

- 没有shuffle的多个算子合并在SubTask中形成OperatorChain
- 类型Spark中的Pipeline

### Dataflow Graph

- 类似Spark中的DAG

### Slot

- 计算资源进行隔离的单元，一个Slot中可以运行多个SubTask，但这些SubTask必须来自统一Job的不同Task（阶段）

### State

- 任务运行过程中计算的中间结果

### Checkpoint

- 将中间计算结果持久化到指定存储系统的一直定期执行的机制

### StateBackend

- 用来存储中间计算结果的存储系统，Flink支持三种StateBackend：Memory、FsBackend、RocksDB