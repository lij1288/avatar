## **Spark的Transformatin**

- 延迟执行，调用后生成一个新的RDD

### 不产生shuffle

#### map

- 做映射

#### filter

#### flatMap

- 相当于先map再flatten

#### mapPartition

- 以分区为单位进行map操作，一个分区一个迭代器

#### mapPartitionWithIndex

- 同时获取分区编号

#### union

- 两个RDD合并成一个RDD，生成的RDD分区数是原来两个RDD分区数之和

#### keys

#### values

#### mapValues

#### flatMapValues

### 产生shuffle

#### combineByKey

- reduceByKey、foldByKey、aggregateByKey底层调用的都是combineByKeyWithClassTag
- combineByKeyWithClassTag中创建了一个ShffledRDD，其中有两个函数：局部聚合函数、全局聚合函数
- 在特殊情况下不一定会shuffle，事先分好区再进行聚合，没有改变分区器类型和下游分区数量
- aggregateByKey---函数一致--->foldByKey---无初始值--->reduceByKey

#### reduceByKey

#### foldByKey

#### aggregateByKey

- 第二次聚合不使用初始值

#### sortBy/sortByKey

- sortBy是一个Transformation，但创建RangePartitioner会触发一次Action进行采样，得到数据的数量和范围

#### groupBy/groupByKey

#### cogroup

- 将多个RDD中同一个Key对应的Value组合到一起

#### coalesce

- 参数1：分区数；参数2：是否shuffle
- 增大分区数一定shuffle，减小分区数不一定shuffle，减小分区数使用coalesce避免进行shuffle

#### repartiton

- shuffle

#### partitionBy

- 按照指定的分区器重新分区

#### distinct

- 去重

#### join

#### leftOuterJoin

#### rightOuterJoin

#### fullOuterJoin

#### instersection

- 交集

#### substract

- 差集
