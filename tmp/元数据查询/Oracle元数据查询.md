## Oracle元数据查询

### all_tables

```sql
select owner,tablespace_name,table_name from all_tables
```

### all_tab_columns

```sql
select owner,table_name,table_type,comments from all_tab_columns
```

### all_col_columns

```sql
select owner,table_name,column_name,comments from all_col_columns where owner='=' and table_name
```



