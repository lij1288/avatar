## **Flink的Time分类**

- EventTime：事件创建事件，要将数据的产生时间字段提取出来，转为Long类型
  assignTimestampsAndWatermarks提取时间，设置Watermark

- IngestionTime：数据进入Flink时间

- Processing Time：算子处理数据的时间，默认的时间属性，使用其他时间需要设置