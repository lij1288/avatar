## **Spark的创建RDD方法**

- 使用SparkContext创建最原始的RDD
- textFile，指定从哪里读取数据创建RDD，需要指定文件系统的协议
- parallelize/makeRDD，将Driver端的scala集合并行化为RDD，记录以后从集合哪些位置获取数据