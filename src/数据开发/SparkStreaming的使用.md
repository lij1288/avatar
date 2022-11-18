## **SparkStreaming的使用**

### StreamingContext

- SparkContext的包装类，是对SparkContext的增强，里面持有SparkContext的引用，并且要指定生成批次的时间间隔，用来创建原始的DStream

### DStream

- SparkStreaming中最基本的抽象，是对RDD的进一步封装，DStream可以定期生成RDD



- DStream可以从很多数据源创建



- 对DStream进行操作，本质是对DStream中的RDD进行操作，对RDD的每一个分区进行操作



- DStream上的方法也分为Transformation和Action，调用Transformation后可以生成一个新的DStream

### 整合Kafka

#### 直连方式

- 使用Kafka底层高效的API



- 一个Kafka Topic对应一个RDD的分区，即RDD分区的数量和Kafka分区的数量是一一对应的，生成的Task直接连到Kafka Topic的Leader分区拉取数据，一个消费者Task对应一个Kafka分区



- 可以编程自己管理偏移量



- 再Driver端调用foreachRDD获取DStream中的KafkaRDD，传入foreachRDD方法的函数在Driver端会周期性执行



- KafkaDStream必须调用foreachRDD方法才能获取到KafkaRDD，只有KafkaRDD中有偏移量



- KafkaRDD实现了HasOffsetRanger接口，可以获取Kafka分区的偏移量，一个批次处理完后，可以将偏移量写入到Kafka、MySQL活Redis

#### 保证ExactlyOnce

- 自动更新可能处理数据后，在更新偏移量时出现异常，重启会再读一次



- 聚合过的
  - 数据经过聚合后，数据量依据变得很少，可以将计算好的结果手机到Driver端
  - 在Driver端获取偏移量，然后将计算好的结果和偏移量，使用支持事务的数据库，在同一个事务中将偏移量和计算好的数据写入到数据库，保证同时成功
  - 如果失败，让任务重启，接着上一次成功的偏移量继续读取



- 未聚合的
  - 在Executor端获取偏移量
  - 将偏移量和计算好的结果同时写入到HBase或ES
  - 因为幂等性，如果数据写入成功，但偏移量没更新，覆盖原来的数据