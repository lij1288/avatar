## **Hive的调优方法**

### 参数优化

#### 简单命令不走MR

- hive.fetch.task.conversion = more
- select、filter、limit时不用转换为MR程序

- 默认为minimal

#### 并行执行

- hive.exec.parallel = true
- 一个sql中有多个job但没有依赖，让顺序执行变为并行执行（union）

#### 推测执行

- mapred.map.tasks.speculative.execution = true

  mapred.reduce.tasks.speculative.execution = true

- 根据已经完成任务的平均速度，为任务运行速度远慢于平均速度的任务， 启动一个备份任务同时运行， 采用先运行完的结果

#### 小表自动加载到内存（数据倾斜）

- hive.auto.convert.join = true
- 大表关联小表，小表自动加载到内存

#### join/group by自动优化（数据倾斜）

- hive.optimize.skewjoin = true

  hive.skewjoin.key如果join键对应的记录数超过这个值，分为两个job

- hive.groupby.skewindata = true

  hive.groupby.mapaggr.checkinterval如果group键对应的记录数超过这个值，分为两个job

### HQL优化

#### union all

- union会进行去重，使用union all然后用group by去重

#### where位置优化

- join结合指定字段，把where提到join前，where条件在map端执行而不是在reduce端执行

#### 不用count distinct

- 使用group by子查询

```sql
--只有一个reduce，先去重再count负担比较大
select count(distinct id) from tablename;
--启动两个job，一个负责子查询，有多个reduce，另一个负责count(1)
select count(1) from (select id from tablename group by id) tmp;
```

### 小文件处理

#### 合并输入小文件

- hive.input.format=org.apache.hadoop.hive.ql.io.CombineHiveInputFormat

  多个split合并为一个

#### 合并输出小文件

- hive.merge.smallfiles.avgsize=256000000

  输出文件平均值小于这个值，启动job进行合并

### 文件格式和压缩编码

parquet + snappy，压缩到30%

- Map输出压缩

  hive.exec.compress.intermediate=true

  mapred.map.output.compression.codec= org.apache.hadoop.io.compress.SnappyCodec

- Reduce输出压缩

  hive.exec.compress.output=true

  mapred.output.compression.codec=org.apache.hadoop.io.compress.SnappyCodec

### 数据倾斜

#### 表现

- 任务进度长时间维持在99%，查看监控界面，只有少量reduce子任务未完成

#### 原因

- 某个reduce数据输入量远大于其他reduce数据输入量
- join
- group by
- count distinct

#### 解决

- hive.optimize.skewjoin = true

- hive.groupby.skewindata = true

- 优化sql逻辑，explain sql查看执行计划