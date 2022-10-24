## **Hive底层与数据库交互的过程**

1. 命令行或WebUI等Hive接口将查询发送给Driver（任何数据库驱动程序如JDBC）
2. Driver借助编译器进行查询的检查和解析
3. 编译器将元数据请求发送给Metastore（任何数据库）
4. Metastore将元数据响应给编译器
5. 编译器生成最终计划发送给Driver
6. Driver将执行计划发送给执行引擎
7. 执行引擎将任务发送到ResourceManager，执行MapReduce任务
8. 任务执行同时，执行引擎可以通过Metastore进行元数据操作
9. 任务执行结束，执行引擎从DataNode上获取结果并发送给Driver
10. Driver将结果发送给Hive接口