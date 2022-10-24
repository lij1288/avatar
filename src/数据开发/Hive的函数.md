## **Hive的函数**

### 1. 帮助指令

- 查看系统自带函数

> show functions;

- 查看自带函数用法

> desc function upper;

- 查看自带函数详细用法

> desc function extended upper;

### 2. 单行运算函数

#### 2.1 类型转换函数

```sql
cast('135' as int)
cast('20160211' as date)
cast(current_timestamp as date)
```

#### 2.2 数学运算函数

```sql
round(6.5) --6，四舍五入
round(6.1345,3) --6.135
ceil(6.5) --7，向上取整
floor(6.5) --5，向下取整
abs(-6.5) --6.5，绝对值
greatest(1,3,6) --6，最大值
least(1,3,6) --1，最小值
```

#### 2.3 时间函数

##### date_format

```sql
date_format('2016-04-25','yyyyMMdd')
```

##### current_timestamp

- 获取当前时间

##### unix_timestamp

- 获取当前时间戳

##### current_date

- 获取当前日期

##### from_unixtime

- unix时间戳转字符串格式

> form_unixtime(bigint unixtime[,string format])

```sql
from_unixtime(unix_timestamp())
from_unixtime(unix_timestamp(),'yyyy/MM/dd HH:mm:ss')
from_unixtime(unix_timestamp()+28800,'yyyy/MM/dd HH:mm:ss')
```

##### unix_timestamp

- 字符串格式转unix时间戳

```sql
unix_timestamp() --不带参数，取当前时间的秒数时间戳
unix_timestamp('2016-02-11 12:00:00')
unix_timestamp('2016/02/11 12:00:00','yyyy/MM/dd HH:mm:ss')
```

##### to_date

- 字符串转日期

```sql
to_date('2016-02-11 12:00:00') --2016-02-11
```

##### datediff

- 求日期差

```sql
datediff('2016-02-11','2019-08-18')
```

##### date_add

- 往后推n天

```sql
date_add('2016-02-11',3)
```

##### date_sub

- 往前推n天

```sql
date_sub('2016-02-11',3)
```

##### next_day

- 下一个星期几的日期

```sql
next_day('2016-02-11','monday')
```

##### weekofyear

- 指定日期在一年中是第几周

```sql
weekofyear('2016-02-11')
```

#### 2.4 字符串函数

##### substr/substring

- 截取子串

```sql
substr(string str,int start)
substr(string str,intstart,int len)
```

##### concat

- 拼接

```sql
concat(string a,string b,...)
concat(string sep,string a,string b,...)
```

##### length

- 长度

```sql
length('135389')
```

##### split

- 切分

```sql
split('192.168.1.101','\\.') --.为正则特定字符
```

##### upper/lower

- 转大小写

```sql
upper(string str)
lower(string str)
```

##### lpad/rpad

- 在a左/右边填充pad，到长度len

```sql
lpad(string a,int len,string pad)
rpad(string a,int len,string pad)
```

##### get_json_object

- 解析json

```sql
--xjson字段:{"id":"1","name":"katara"}
select get_json_object(xjson,'$.id'),get_json_object(xjson,'$.name') from demo;
```

##### base64

- 将二进制格式转为base64编码

```sql
base64(binary('135389'))
```

#### 2.5 条件分支函数case

```sql
case [expression]
	when condition1 then result1
	when condition2 then result2
	...
	when condition3 then result3
	else result
end
```

#### 2.6 条件分支函数if

```sql
if(expression,result1,result2)
```

#### 2.7 集合函数

##### array_contaions(Array\<T>,value)

- 是否包含

##### sort_array(Array\<T>)

- 返回排序后数组

##### size(Array\<T>)

##### size(Map<K,V>)

##### map_keys(Map<K,V>)

- 返回所有key

##### map_values(Map<K,V>)

- 返回所有value

#### 2.8 NULL相关函数

```sql
nvl(expr1,expr2) --如果第一个参数为空，则取第二个；如果第一个参数不为空，则取第一个
nvl2(expr1,expr2,expr3) --如果第一个参数为空，则取第二个；如果第一个参数不为空，则取第三个
coalesce(expr1,expr2...exprn) --取第一个不为空的值，都为空则为NULL
nullif(expr1,expr2) --如果两参数相等则返回NULL
```

### 3. 窗口分析函数

#### 3.1 序号函数

##### row_number() over()

- 相同值序号不同

> row_number() over (partition by col1 order by col2) 

##### rank() over()

- 相同值的序号相同，下一个值的序号跳变

##### dense_rank() over()

- 相同值的序号相同，下一个值的序号连续

#### 3.2 sum

- sum() over()在窗口内，对指定的行进行滚动累加
- 行的运算范围：
  - 往前：n/unbounded preceding
  - 往后：n/unbounded following
  - 当前：current row

```sql
sum(amount) over(partition by id order by mth rows between unbounded preceding and current row)
--不指定运算范围，但指定排序，默认为：最前->当前
sum(amount) over(partition by name order by mth)
--不指定运算范围，且不指定排序，默认为：最前->最后
sum(amount) over(partition by name)
--不指定运算范围，且不指定排序，且不指定窗口，则将整个表视为一个窗口
sum(amount) over()
```

#### 3.3 count()

- 计数

#### 3.4 lead()/lag()

```sql
--将下一行的某个字段输出
lead(amount,1) over(partition by name order by mth)
--将上一行的某个字段输出
lag(amount,1) over(partition by name order by mth)
```

#### 3.5 first_value()/last_value()

- 窗口某个字段的第一个/最后一个

### 4. 分组聚合函数

```sql
sum() --总和
avg() --平均
max() --最大
min() --最小
count() --总行数
collection_list() --列转行，不去重
collection_set() --列转行，去重
```

### 5. 表生成函数

#### 5.1 行转列函数explode()

```sql
select explode(subjects) as subject from demo;
```

#### 5.2 表生成函数lateral view

- 相当于两表join，左表是原表，右表是explode（某个集合字段）之后产生的表，这个join只在同一行的数据间进行

```sql
select o.name,o.subject from
(select name,tmp.subject as subject
 from demo lateral view explode(subjects) tmp as subject) o
```

#### 5.3 json解析函数

```sql
{"movie":"135","rate":"5","timeStamp":"958500750","uid":"1"}
create table demo
as
select json_tuple(xjson,'movie','rate','timeStamp','uid') as(movie,rate,ts,uid)
from demo2;
```

### 6. 高阶聚合函数

#### 6.1 with cube

- 数据立方体，可以实现所有维度的组合情况，是grouping sets的简化版

#### 6.2 grouping sets

- 自由指定要计算的维度组合

#### 6.3 with rollup

- 实现维度key存在级联关系的统计，维度key从右到左递减多级的统计，如省市区、省市、省

### 7. 自定义函数

1. 依赖为org.apache.hive,hive-exec

2. 继承org.apache.hadoop.hive.ql.UDF

3. 实现evaluate函数，支持重载

4. 在hive的命令行窗口创建函数

   - 添加jar

     > add jar /opt/module/datas/udfdemo.jar'

   - 创建function

     > create [temporary] function mf as 'com.avtar.func.MyFunction';

5. 在hive的命令行窗口删除函数

   > drop [temporary] function [if exists] mf;

6. UDF必须有返回类型，可以返回null，但返回类型不能为void