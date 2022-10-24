## **Hive的数据导入导出**

### 1. 数据导入

#### 1.1 load

> load data [local] inpath '/tmp/datas/demo.txt' [overwrite] into table demo [partition(patcol1=val1,...)];

- local：从本地加载数据，否则从HDFS加载数据
- inpath：表示加载数据的路径
- overwrite：覆盖表中已有数据，否则表示追加
- patititon：上传到指定分区

#### 1.2 insert...values

> insert into|overwrite table demo partition(month='201601') values(1,"katara");

#### 1.3 insert...select

- 单表插入

```sql
insert into|overwrite table demo partition(month='201601')
select id,name from demo2 where month='201601';
```

- 多表插入

```sql
from demo2
insert into|overwrite table demo partiton(month='201602')
select id,name where month='201602'
insert into|overwrite table demo partiton(month='201603')
select id,name where month='201603';
```

#### 1.4 create..as

```sql
create table if not exists demo
as
select id,name from demo2
```

#### 1.5 location

```sql
create table demo(id int, name string)
row format delimited fields terminated by ','
location '/user/hive/warehouse/demo'
```

#### 1.6 import

- 先export导出后，再将数据导入

> import table demo partition(month='201601') from '/user/hive/warehouse/export/demo';

### 2. 数据导出

#### 2.1 insert

- 将查询结果导出到本地

> insert overwrite local directory '/tmp/avatar/demo' select * from demo;

- 将查询结果导出到HDFS

> insert overwrite directory '/user/avatar/demo' select * from demo;

- 将查询结果格式化导出

```sql
insert overwrite local directory 'tmp/avatar/demo'
row format delimited fields terminaterd by '\t'
select * from demo;
```

#### 2.2 export

- 导出到HDFS

> export table default.demo to 'user/hive/warehouse/export/demo';

#### 2.3 sqoop

- 导出到其他关系型数据库

### 3. 清除表中数据

- 只能清除内部表中数据

> truncate table demo;