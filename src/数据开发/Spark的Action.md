## Spark的Action

### saveAsTextFile

### count

### sum

### take

### first

### min/max

### takeOrdered

### top

### collect

### aggregate

- 函数1：分区内局部聚合；函数2：分区计算好的结果全局聚合

### reduce

### fold

### foreach

- 将数据一条一条取出，传入一个函数，这个函数返回Unit，比如传入打印逻辑

### foreachPartition

- 以分区为单位，一个分区一个Task，可以将数据写入数据库，一个分区一个连接，效率更高
