## **MapReduce的MapSideJoin和ReduceSideJoin**

### MapSideJoin

- 例如大表关联小表，通过DistributedCache将小表缓存
- 在setup()获取缓存数据，输出join条件作为key，其他数据作为value
- map()：按key进行关联

### ReduceSideJoin

- 在setup()通过context获取任务切片信息，获得文件名
- map()：输出join条件作为key，其他数据作为value，并打上数据类型标记
- reduce()：根据类型标记，分离两表数据，然后拼接