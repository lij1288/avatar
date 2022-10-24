## **Hive的查询语法**

```sql
select [all | distinct] select_expr, select_expr, ...
  from table_reference
  [where where_condition]
  [group by col_list]
  [order by col_list]
  [cluster by col_list
  |
  [distribute by col_list] [sort by col_list]
  ]
```

### 1. with..as

- 临时表语法

```sql
with tmp as(
select ...from demo ...)
select ...from tmp ...;
```

### 2. select...from

#### 2.1 列别名

- 紧跟列名，或加入as

> select ename as name, deptno dn from dmeo;

#### 2.2 limit

- 限制返回行数

#### 2.3 distinct

> select distinct id,name from demo;

### 3. where

- 逐行过滤

### 4. 运算符

#### 4.1 算术运算符

```sql
+ - * / % & | ^ ~
```

#### 4.2 比较运算符

```sql
 > < =
 a [not] between b and c
 a is null
 a is not null
 in(a,b) --显示列表中的值
 a [not] like b --string类型，b为简单正则表达式（_：一个字符，%：任意个字符）
 a [not] rlike b --string类型，b为标准正则表达式
```

#### 4.3 逻辑运算符

```sql
and or not
```

### 5. 分组

#### 5.1 group by

- 分组

#### 5.2 having

- 分组过滤

### 6. join

```sql
--笛卡尔积
t1 join t2
--内连接，满足拼接条件才拼接
t1 join t2 on t1.id=t2.id
--左（外）连接left outer join，左表所有行都保留，连接不上的右表字段为null
t1 left join t2 on t1.id=t2.id
--右（外）连接right outer join，右表所有行都保留，连接不上的左表字段为null
t1 right join t2 on t1.id=t2.id
--全（外）连接full outer join，左右表的行都保留，连接不上的字段为null
t1 full join t2 on t1.id=t2.id
--左半连接，是sql中in子句的一个变种实现
--限制是右边的表只能在on子句中设置过滤条件,，在where子句，select子句都不行
t1 left semi join t2 on t1.id=t2.id
--等效于（新版本hive支持in子句）
t1 where id in (select id from t2)
--hive中不支持不等值join
```

- 连接中不建议用or，join on t1.id=t2.id or t1.addr=t2.addr，只能将两个表进行笛卡尔积连接，然后对连接后的数据进行过滤，若使用需设置：

> set hive.strict.checks.cartesian.product=false

### 7. 排序

#### 7.1 全局排序order by

- 可选子句：asc|desc

> select * from demo order by salary;

#### 7.2 Task内部排序sort by

- 对全局结果集来说不是排序
- 需设置reduce个数

> set mapreduce.job.reduces=3

- 示例

> select * from demo sort by salary;

#### 7.3 分桶排序查询distribute by+sort by

- distribute by类似mr中的partition，进行分区，可以结合sort by使用
- 需设置reduce个数

> set mapreduce.job.reduces=3

- 示例

> select * from demo distribute by deptno sort by id;

#### 7.4 分桶排序cluster by

- 当distribute by和sort by字段相同时，可以使用cluster by代替
- cluster by的排序只能是升序排序

### 8. 分桶及抽样查询

#### 8.1 分桶表定义

- 对Hive表分桶可以将表中的数据按分桶键的哈希值散列到多个文件中，这些文件称为桶

- 表分区是用不同的子文件夹管理不同的数据

  表分桶是用不同的文件管理不同的数据

- 创建分桶表

```sql
create table demo(id int,name string,province string,age int)
clustered by (province) sorted by (age) into 5 buckets
row format delimited fields terminated by ',';
```

- 向分桶表导入数据

  方式1：直接导入文件，不建议，直接导入的文件可能不符合分桶表的分桶规范，若导入需设置：

> set hive.strict.checks.bucketing=false;

		方式2：通过一个中转表，使用insert...select导入

> set mapreduce.job.reduces=-1（或目标分桶表的桶数）

> insert into demo
>
> select * from demo2;

#### 8.2 分桶表的意义

- join更快，join相同列划分的桶的表，可以使用map-side join，而且能提高计算的并行度，更加高效
- sampling抽样更高效方便，没分桶的话需要扫描整个数据集

#### 8.3 分桶抽样查询

- 对于非常大的数据集，有时需要的是一个具有代表性的查询结果而不是全部结果

- 语法: tablesample(bucket x out of y)

  - y决定抽样的比例，必须是table总bucket数的倍数或因子
    - 例如：总bucket数为4，y=2时，抽取4/2=2个bucket的数据；y=8时，抽取4/8=1/2个bucket的数据

  - x表示从哪个bucket开始抽取，如果需要取多个分区，以后的分区号为当前分区号加y，x的值必须小于y
    - 例如：总bucket数为4，y为2，x为1，表示抽取第1（x）个及第3（x+y）个bucket的数据
  - 示例:

> select * from demo tablesample(bucket 1 out of 2 on id)