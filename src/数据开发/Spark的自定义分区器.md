## **Spark的自定义分区器**

- 使用场景：根据自定义规则，将数据shuffle到下游RDD的分区

- 定义一个类，继承partitoner，重写方法，获取分区数量，根据输入数据的key获取该数据返回的分区编号

  在Driver端new一个自定义Partitoner类的实例，将该实例传入调用的会产生shuffle的算子

- 分区器的getPartition方法是做Executor中的Task被调用的