## **Spark的相关概念**

### RDD

- Resiliennt Distributed Datasets

#### 概述

- **分布式、弹性、可容错的分布式数据集**
- 是一个**抽象**的数据集，RDD中不保存要计算的数据，保存的是**数据的描述信息和计算逻辑**，如数据从哪读、如何运算
- 可以认为是一个代理，对RDD进行操作，相当于在Driver端记录下计算的描述信息，然后生成Task，将Task调度到Executor端才执行真正的计算逻辑

#### 特点

- 有多个分区，分区数量决定任务并行度

  1. 从HDFS中读取

     - **分区数量由HDFS中数据的输入切片数量决定**

     - **sc.textFile可以指定RDD的分区数量**，最小分区数为2

     - 如果一个大文件，一个小文件，**大文件大于小文件的1.1倍，大文件会有2个输入切片**

     - **当分区数量大于切片数量，多个Task可以读取一个输入切片**

       **当分区数量小于切片数量，RDD分区数量由切片数量决定**

  2. 将Driver端集合并行化为RDD

     - RDD默认分区数量由total-executor-cores决定
     - 可以指sc.parallelize(arr, 6)指定分区数量

- 一个功能函数作用在分区上，函数决定计算逻辑

- RDD和RDD存在依赖关系，可以根据依赖关系恢复失败任务和划分Stage

- 如果发生Shuffle，要使用分区器，默认使用HashPartitioner，分区器决定数据到下游哪个分区

- 最优位置，会尽量把Executor启动在数据所在节点上，减少跨网络读数据，大数据所说的移动计算而不移动数据

### DAG

- Directed acyclic graph

#### 概述

- **有向无环图**，是**对多个RDD转换过程和依赖关系的描述**
- 触发Action就会形成一个完整的DAG，**一个DAG就是一个Job**

### Task

#### 概述

- **Spark中任务最小的执行单元**
- 本质是类的实例，有属性—从哪里读数据，有方法—如何计算
- Task的数量决定并行，同时也要考虑可用的cores

#### 分类

- ShuffleMapTask

  - 专门为shuffle做准备

  - 可以读取各种数据源的数据
  - 可以读取shuffle后的数据

- ResultTask

  - 专门为了产生计算结果
  - 可以读取各种数据源的数据
  - 可以读取shuffle后的数据

### TaskSet

- **保存同一种计算逻辑的多个Task的集合**
- 一个TaskSet中的Task计算逻辑都一样，处理的数据不一样

### Stage

- **任务执行阶段**
- Stage执行有先后顺序
- **一个Stage对应一个TaskSet**
- 一个TaskSet中的**Task数量取决于Sage中最后一个RDD的分区数量**

### Dependency

- 依赖关系，指父RDD和子RDD之间的依赖关系

- 窄依赖：没有shuffle产生，多个算子被合并到一个Task中，即一个pipeline中

  宽依赖：有shuffle产生，是划分Stage的依据

### Shuffle

- 需要通过网络将数据传输到多台机器，数据被打散，有网络传输不一定有shuffle
- shuffle是上游RDD的一个分区将数据给了下游RDD的多个分区，shuffle过程是下游Task到上游拉取数据
- shuffle的功能是将数据按照指定的分区规则，通过网络传输到指定的一台机器的一个分区即Task中

### Job

- Driver向Executor提交的作业
- 触发一次Action形成一个完整的DAG
- 一个DAG对应一个Job
- 一个Job中有多个Stage，一个Stage中有多个Task

### Application

- 使用SparkSubmit提交的计算应用
- 一个Application中可以触发多次Action，触发一次Action形成一个DAG，一个DAG对应一个Job
- 一个Application中可以有一到多个Job