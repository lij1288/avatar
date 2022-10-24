## **Spark的checkpoint**

- 使用场景：适合复杂的计算，为了避免丢失数据重复计算，将中间结果保存到HDFS中



- 再调用前，需要指定checkpoint的目录sc.setCheckPointDir



- 第一次触发Action，才做checkpoint，会额外触发一个Job，目的是将结果保存到HDFS中



- 触发多次Action，checkpoint才有意义，多用于迭代计算



- checkpoint方法，严格来说不是Transformation，只是标记当前RDD要做checkpoint