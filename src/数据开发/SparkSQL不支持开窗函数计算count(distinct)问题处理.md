## SparkSQL不支持开窗函数计算count(distinct)问题处理

### 南大通用

```sql
count(distinct cust_id) over(partition by area_id,month_id)
```

### SparkSQL

```sql
size(collect_set(cust_id) over(partition by area_id,month_id))
```

