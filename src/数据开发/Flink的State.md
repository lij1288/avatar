## **Flink的State**

### 概念

- Flink计算过程的中间结果和状态信息

- Flink的一大特性：有状态的计算

### 作用

- 失败恢复
- 增量计算

### 分类

- KeyState：调用keyBy方法后，每个分区相互独立的state

- OperatorState：没有分组前的state，每一个subTask维护的状态

- BroadcastState：广播state，一个可以通过connect方法获取广播流的数据，广播流的特点是可以动态更新

  广播state通常作为字典数据、维度数据关联。广播到属于该任务的所有TaskManager中，类似map-side join，提高效率

### 使用

1. 定义一个状态描述器
2. 通过context获取state
3. 对数据处理后更新数据