# TiDB常用查询语句

## 查询正在处理的请求

```sql
select * from information_schema.cluster_processlist where command<>'Sleep' and info like '%database_name.table_name%'
```

## 取消正在处理的请求

```sql
select concat('kill ',id,';') from information_schema.cluster_processlist where command<>'Sleep' and info like '%database_name.table_name%'
```

## 查询DDL处理任务

```sql
admin show ddl jobs
```

