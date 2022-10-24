## **Spark的数据倾斜**

### 原理及现象

- 一个Spark任务，绝大多数Task运行速度很快，但有几个Task非常慢，有时可能接着报数据溢出问题
- 数据倾斜发生在shuffle类算子中，在进行shuffle时，必须将各个节点的相同key拉到某个节点的一个Task处理，比如按照key进行聚合或join操作，如果其中一个key对应的数据量特别多，就会发生数据倾斜

### 确定问题及定位代码

- 通过Spark Web UI查看stage，看运行卡住或报错的那个stage各个Task的运行时间和分配的数据量，确定是数据倾斜问题
- 根据stage划分原理推断发生倾斜的是哪一部分代码，找shuffle类算子：reduceByKey、aggregateByKey、groupByKey、join、cogroup、repartition、distinct等

- 判断哪个key对应数据量特别大导致数据倾斜，进行采样，sample算子，countByKey算子

```scala
val words = lines.flatMap(_.split(" "))
val pairs = words.map((_, 1))
val wordCounts = pairs.reduceByKey(_+_)

val sampledPairs = pairs.sample(false, 0.1)
val sampledWordCounts = sampledPairs.countByKey()
sampledWordCounts.foreach(println(_))
```

### 问题解决

#### 两阶段聚合

- 针对聚合类shuffle操作
- 进行两次聚合操作，打上随机前缀进行第一次聚合，然后去掉前缀进行第二次聚合

#### 将reduce join转为map join

- 两个rdd进行join，其中一个数据量不大，比如小于5G
- 将数据量小的拉到Driver端，通过广播变量的方式广播出去，再进行的话数据在Executor中，不会有数据传输，也就避免了数据倾斜

#### 采样倾斜key并分拆join

- 解决两个大表join

1. 通过sample算子进行采样，countByKey确定数据量大的key
2. 将这些key对应的数据从原来的RDD中过滤出来，打上n以内的前缀，剩余的数据形成另一个RDD
3. 需要join的另一个RDD，也过滤处倾斜key对应的数据，每条膨胀为n倍，打上前缀，剩余的数据形成另一个RDD
4. 将随机前缀的RDD和膨胀后的RDD进行join，将原来相同的key打成n份，分散到多个Task中进行join了
5. 两个普通的RDD照常join
6. 再将两次计算结果union得到最终join结果

#### 提高shuffle并行度

- 给shuffle算子传入一个参数，reduceByKey的shuffle read task默认值是200，可以teduceByKey(500)，分配到每个Task中的key就少了
- 实现简单，一定程度上缓解数据倾斜

#### 使用Hive预处理数据

- 针对Hive表导致数据倾斜
- 在Hive预处理后再跑Spark，彻底避免了shuffle算子，Hive每天跑一次，慢点没关系
- 治标不治本，但效果好

#### 过滤导致倾斜的key

- 针对导致倾斜的key极少，而且对计算本身影响不大
- 实现简单，效果好，完全避免数据倾斜