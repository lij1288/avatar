## **Spark的cache/persist**

- 使用场景：一个application多次触发Action，为了复用签名RDD的数据，避免反复读取HDFS中数据和重复计算



- 可以将数据缓存到内存或磁盘（executor所在磁盘），第一次触发Action才放入内存或磁盘，以后对缓存的RDD进行操作可以复用缓存的数据



- 一个RDD多次触发Action才有意义



- 如果数据缓存到内存，内存不够，以分区为单位，只缓存部分分区的数据



- 支持多种StageLevel，可以将数据序列化，默认放入内存使用的是java对象存储，但占用空间大，优点速度快



- 底层调用的是persist方法，可以指定其他存储级别



- cache和persist方法，严格来说不是ransformation，因为没有生成新RDD，只是标记当前RDD需要cache或persist