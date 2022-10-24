## **Flink的Window分类**

- 把数据攒到一起进行计算

- CountWindow：按照数据条数生成Window

- TimeWindow：按照时间生成Window
  - 滚动窗口TumblingWindow
  - 滑动窗口SlidingWindow
  - 会话窗口SessionWindow，间隔超过多少划分窗口