## PostgreSQL根据字段注释查询库表

```sql
select t3.table_schema,t2.relname,t4.attname,t1.description from
(select objoid,objsubid,description from pg_description where description like '%身份证%' and description != '身份证原始发证地') t1
join 
(select relname,oid from pg_class) t2
on t1.objoid = t2.oid
join
(select table_schema,table_name from information_schema.tables where table_schema not like 'z_beijing%') t3
on t2.relname = t3.table_name
join
(select attrelid,attname,attnum from pg_attribute) t4
on t1.objoid = t4.attrelid and t1.objsubid = t4.attnum
```

