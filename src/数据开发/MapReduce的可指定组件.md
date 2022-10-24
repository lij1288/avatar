## **MapReduce的可指定组件**

### InputFormat

#### InputFormat的分类

- FileInputFormat

  父类

- TextInputFormat

  默认，将每一行在文件中的起始偏移量作为key，每一行的内容作为value

- KeyValueTextInputForamt

  适合处理每一行是两列的数据，如果每行数据以\t分隔，会自动将前面作为key，后面作为value

- SequenceFileInputFormat

  序列文件输入格式，使用序列文件可以提高效率，但不利于查看结果，建议过程中使用

- CombineFileInputFormat

  合并大量小文件

- MultipleInputs

  多路输入，可以为每个输入指定Mapper

#### 自定义InputFormat

- 自定义类继承FileInputFormat
- 自定义类继承RecordReader

### Combiner

- Combiner是MapTask对自己的局部数据进行局部聚合时使用的工具类，位置是环形缓冲区溢出数据到小文件时，以及Merger将小文件合并为大文件时
- Combiner是Reducer的子类，一般处理的是同一种逻辑
- job.setCombinerClass(MyReducer.class);

### Partitioner

- 默认的HashPartitioner先计算key的散列值，然后模除以reducer个数，确认分区
- 可以使用自定义Partitioner的方式来实现Reducer的负载均衡，Partioner的返回值是小于Reducer个数的非负整数

### 多路输出

- 使用MultipleOutputs多路输出器
- setup()中new MulitipleOutputs<>(context)
- reduce()中根据情况调用write()

### 小文件输入

- 使用CombineTextInputFormat组件做输入，将多个小文件规划为一个任务切片

### 全局计数器

- setup()中context.getCounter()
- map()或reduce()中，counter.increment()