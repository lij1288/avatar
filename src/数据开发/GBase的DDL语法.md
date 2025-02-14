## GBase的DDL语法

### 时间转字符串

```sql
date_format（now(),'%Y%m%d%H%i%s')
```



### 字符串转时间

```sql
str_to_date('20241213134535','%Y%m%d%H%i%s')
```

### 修改字段名称

```sql
alter table database_name.table_name change column1 column1_new varchar(10);
```

### 时间差

```sql
timestampdiff(year,'20250103','20240305')
```

```sql
timestampdiff(year,'2025-01-03','2024-03-05')
```

