## **Spark的参数调优**

> ./bin/spark-submit \ 
>
> --**master** yarn-cluster \ 
>
> --**num-executors** 100 \ 
>
> --**executor-memory** 6G \ 
>
> --**executor-cores** 4 \ 
>
> --**driver-memory** 1G \ 
>
> --**conf spark.default.parallelism**=1000 \ 
>
> --**conf spark.storage.memoryFraction**=0.5 \ 
>
> --**conf spark.shuffle.memoryFraction**=0.3 \ 

### num-executors

- 设置Spark作业总共要用多少个Executor进程执行
- 不设置的话，只会启动少量的Executor进程
- 50-100，太少不能充分利用集群资源，太多大部分队列没有足够资源

### executor-memory

- 设置每个Executor进程的内存
- 4-8G，Executor进程内存总和 = num-executors * executor-memory，共享队列不超过1/2

### executor-cores

- 设置每个Executor进程的cpu core数量，决定了每个Executor进程并行执行Task线程的能力
- 2-4，共享队列不超过1/2

### driver-memory

- 设置Driver进程的内存
- 不设置或1G，如果使用collect算子拉取数据到Driver进行处理，确保内存足够

### spark.default.parallelism

- 设置**每个stage的默认Task数量**
- 不设置，Spark会根据切片数量设置Task数量，默认数量偏少，设置的Executor参数无效，不管Executor进程、内存和cpu是多少，没有几个Task，导致大多数Executor没有任务执行，浪费资源
- 500-1000，设置为num-executors * executor-cores的2-3倍

### spark.storage.memoryFraction

- 设置**RDD持久化数据在Executor内存中能占的比例**
- 默认0.6

### spark.shuffle.memoryFraction

- 设置**shuffle过程，进行聚合操作能使用的Executor内存比例**
- 超出限制多余的会溢写到磁盘，极大降低性能
- 默认0.2