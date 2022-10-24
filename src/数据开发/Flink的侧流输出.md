## **Flink的侧流输出**

### 数据流拆分

- 侧流输出比filter效率高，不需要对数据进行多次处理

- 首先定义一个标签：OutputTag\<LogBean> flowOutputTag = new OutputTag\<LogBean>("flow-date"){}

  然后在process方法中进行判断或模式匹配，给结果打上标签ctx.output(flowOutputTag, bean)

  可以通过标签名称从主流获取侧流：mainDataStream.getSideOutput(flowOutputTag)

### 获取窗口延迟数据

- 首先定义窗口延迟数据标签：

  OutputTag\<LogBean> lateOutputTag = new OutputTag\<LogBean>("late-date"){}

  在调用完窗口后调用.sideOutputLateData(lateOutputTag)

  获取延迟数据：.getSideOutput(lateOutputTag)