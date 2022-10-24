## **Flink的历史数据累加**

- aggregate(AggregateFunction af, WindowFunction wf)

- WindowFunction取出历史状态，加上窗口聚合结果，再保存状态