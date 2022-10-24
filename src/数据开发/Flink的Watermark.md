## **Flink的Watermark**

- 水位线，Flink中的一种延迟触发任务机制，和EventTime结合使用



- 要设置使用EventTime作为时间标准env.setStreamtimeCharacteristic(TimeCharacteristic.EventTime)



- 要提取数据的EventTime作为TimeStamp



- 可以设置允许乱序的时间



- Watermark=数据所携带的最大EventTime - 延迟执行时间



- 触发时机：Watermark的时间>=窗口的结束边界