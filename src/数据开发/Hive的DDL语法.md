## **Hive的DDL语法**

### 1. 创建数据库

- 创建数据库，在HDFS的默认存储路径为/user/hive/warehouse/*.db

> create database demo;

- 创建时判断是否存在

> create database if not exist demo;

- 指定数据库在HDFS上的存储位置

> create database demo location '/hive_db/demo.db'

### 2. 查询数据库

#### 2.1 显示数据库

- 显示数据库

> show databases;

- 通配符显示查询的数据库

> show databases like 'demo*';

#### 2.2 查看数据库详情

- 显示数据库信息

> desc database demo;

- 显示数据库详细信息extended

> desc database extended demo;

#### 2.3 切换当前数据库

> use demo;

### 3. 设置属性值

> alter database demo set dbproperties('createtime'='20150211');

### 4. 删除数据库

- 删除空数据库

> drop database demo;

- 删除时判断是否存在

> drop database if exists demo;

- 删除非空数据库

> drop database demo cascade;

### 5. 创建表

#### 5.1 建表语法

```sql
create [external] table [if not exists] table_name
   [(col_name data_type [comment col_comment], ...)]
   [comment table_comment]
   [partitioned by (col_name data_type [comment col_comment], ...)]
   [clustered by (col_name, col_name, ...)
   [sorted by (col_name [asc|desc], ...)] into num_buckets buckets]
   [row format row_format]
   [stored as file_format]
   [location hdfs_path]
   [like]
```

#### 5.2 字段说明

##### external

- 创建外部表

##### comment

- 为表或列添加注释

##### partitioned by

- 创建分区表

##### clustered by

- 创建分桶表

##### sorted by

- 进行桶内排序

##### row format

- 指定数据分割信息

```sql
delimited [fields terminated by char] [collection items terminated by char]
[map keys terminated by char] [lines terminated by char] 
| 
serde 'serde_class_name' [with serdeproperties (property_name=property_value, property_name=property_value, ...)]
```

##### stored as

- 指定存储文件类型
  - sequencefile hadoop_kv序列文件
  - textfile 文本
  - rcfile 列式存储格式文件
  - parquetfile 列式存储文件

##### location

- 指定表在HDFS上的存储位置

##### like

- 复制现有表结构，不复制数据

#### 5.3 内部表（管理表）

- 默认创建的表是管理表，Hive会控制数据的生命周期，当删除一个管理表时，Hive也会删除这个表中的数据，管理表不适合和其他工具共享数据

#### 5.4 外部表

- 删除外部表只删除元数据信息，不会删除数据

#### 5.5 内部表和外部表互相转换

- 查询表类型详细属性

> desc formatted demo;

- 内部表转为外部表

> alter table demo set tblproperties('EXTERNAL'='TRUE');

- 外部表转为内部表

> alter table demo set tblproperties('EXTERNAL'='FALSE');

- 'EXTERNAL'='TRUE'及'EXTERNAL'='FALSE'区分大小写

### 6. 分区表

- 分区表的数据可以按照某个字段的不同值, 存储在不同的子文件夹中
- 查询时通过where选择指定分区, 提高查询效率

#### 6.1 静态分区

##### 6.1.1 分区表操作

###### 创建

```sql
create table demo(id string,info string)
partitined by (month string)
row format delimited fields terminated by '\t';
```

###### 加载数据

> load data local inpath '/demo1.txt' into table default.demo partition(month='201501');
>
> load data local inpath '/demo1.txt' into table default.demo partition(month='201502');
>
> load data local inpath '/demo1.txt' into table default.demo partition(month='201503');

###### 查询分区表数据

```sql
-- 单分区查询
select * from demo where month='201501';
-- 多分区联合查询
select * from demo where month='201501'
union
select * from demo where month='201502'
union
select * from demo where month='201503';
```

###### 增加分区

- 增加单个分区

> alter table demo add partition(month='201504');

- 增加多个分区

> alter table demo add partition(month='201504') partition(month='201505');

###### 删除分区

- 删除单个分区

> alter table demo drop partition(month='201504');

- 删除多个分区

> alter table demo drop partition(month='201504') partition(month='201505');

###### 查看分区

> show partition demo;

###### 查看分区表结构

> desc formatted demo;

##### 6.1.2 多级分区

- 定义多个分区字段，本质是分多层子目录

> partitioned by (region string, month string)

#### 6.2 动态分区

##### 6.2.1 机制与意义

- 底层机制：mapreduce中的多路输出mutipleOutputs（根据条件判断，将结果写入不同目录不同文件）
- 意义：自动完成数据划分，一次性处理多个分区数据

##### 6.2.2 创建动态分区表

- 数据源表

```sql
create table demo2(
order_id string,
month string,
name string)
row format delimited fields terminated by '\t';
```

- 动态分区表

```sql
create table demo(
order_id string,
name string)
partitioned by (x string)
row format delimited fields terminated by '\t';
```

- 设置参数

> set hive.exec.dynamic.partition=true; //使用动态分区
>
> set hive.exec.dynamic.partition.mode=nonstrick; //无限制模式, 如果模式是strict，则必须有一个静态分区且放在最前面
>
> set hive.exec.max.dynamic.partitions.pernode=10000; //每个节点生成动态分区的最大个数
>
> set hive.exec.max.dynamic.partitions=100000; //生成动态分区的最大个数
>
> set hive.exec.max.created.files=150000; //一个任务最多可以创建的文件数目
>
> set hive.merge.mapfiles=true; //map端的结果进行合并
>
> set mapreduce.reduce.tasks =20000; //设置reduce task个数，增加reduce阶段的并行度

- 加载数据

```sql
insert into table demo partition(x) --分区变量x应与demo分区变量名一致
select order_id,name,month from demo2; --select字段最后一个month会作为分区变量x的动态值
```

### 7. 修改表定义（元数据）

#### 7.1 重命名表

> alter table demo1 rename to demo2;

#### 7.2 更新列

> alter table demo change old_name new_name string;

#### 7.3 增加列

- 增加字段，在partition字段前，其他字段后

> alter table demo add columns(name string);

#### 7.4 替换列

- 替换表中所有字段

> alter table demo replace columns(name1 string, name2 int);

### 8. 删除表

> drop table demo;

### 9. SerDe组件

- SerDe是Serialize/Deserilize的简称，目的是用于序列化和反序列化，能为表切分、解析列，对列指定相应的数据
- 可以使用Hive自带SerDe或自定义SerDe
- 示例:

```sql
-- 文件内容
id=1,name=aang
id=2,name=katara
-- 期望输出
1	aang
2	katara
-- 
create table demo(id int, name string)
row format serde 'org.apache.hadoop.hive.serde2.RegexSerDe'
with serdeproperties("input.regex"="id=(.*),name=(.*)")
stored as textfile;
```

