## **Flink的实时TopN**

- 划分窗口后调用aggregate(AggregateFunction af, WindowFunction wf)，第一个预聚合，第二个输出窗户数据（把数据和窗口结束边界一起输出）

  apply(WindowFunction wf)会将窗口中的数据都存储下来，最后一起计算

- 按窗口结束边界聚合，调用自定义ProcessFunction，底层方法，可以onTimer

  processElement方法，把数据保存到ListState，并注册windowEnd+1的定时器（不会重复注册）

  onTimer方法，定时器触发时，取出ListState数据进行排序输出