## **MapReduce的分组topN高效实现**

- 利用MapReduce的排序机制来排序
- 自定义类型作为map输出的key，实现WritableComparable，重写compare方法，先比较field1，再比较field2，value为null
- 控制数据分区规则，自定义Partitioner的子类，重写getPartition方法，按field1分区
- 控制分组规则，按field1分组