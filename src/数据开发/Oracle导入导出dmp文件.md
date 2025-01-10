# **Oracle导入导出dmp文件**

## impdp 

### 查询默认导出目录

```sql
select * from dba_directories where directory_name='DATA_PUMP_DIR';
-- /opt/myoracle/oracle/admin/orcl/dpdump
```

### 导出导入所有表

- 导出test2下所有表

  > expdp test2/test2_pwd@orcl dumpfile=test2.dmp

- 导入文件（可不存在test2用户，如果test2中存在同名表则跳过）

  > impdp test/test_pwd@orcl dumpfile=test2.dmp

### 导出导入目标表

- 导出test2下的table1和table2（数据库中表名需大写）

  > expdp test2/test2_pwd@orcl tables=table1,table2 dumpfile=table.dmp

- 导入文件（需存在test2用户）

  > impdp test/test_pwd@orcl tables=test2.table1,test2.table2 dumpfile=table.dmp

### 指定导出目录

- 创建目录并授权

  > create directory dmp_dir as '/opt/myoracle/tmp';

  > chown -R oracle:oinstall /opt/myoracle/tmp

- 导出test2下所有表

  > expdp test2/test2_pwd@orcl directory=dmp_dir dumpfile=test2.dmp

- 导入文件

  > impdp test/test_pwd@orcl directory=dmp_dir dumpfile=test2.dmp

## 操作记录

- 创建表空间

```sql
create tablespace FASP
datafile 'F:\app\Administrator\admin\orcl\dpdump\FASP.dbf'
size 500M
autoextend on next 100M maxize unlimited logging
extent management local autoallocate
segement space management auto;
```

- 若表空间不足则进行追加

```sql
alter tablespace FASP add datafile 'F:\app\Administrator\admin\orcl\dpdump\new_datafile.dbf' size 4096M;
alter database datafile 'F:\app\Administrator\admin\orcl\dpdump\new_datafile.dbf' autoextend on;
```

- 还原文件（LPP为已有）

> impdp LPP/orcl@orcl table_exists_action=replace directory=DATA_PUMP_DIR dumpfile=fasp001.dmp SCHEMAS=FASP logfile=log.log

## 问题处理

### 用户或角色不存在

```sql
create user USER_NAME identified by orcl default tablespace USER_NAME;

grant connect,resource,dba to USER_NAME;

create directory USER_NAME as 'F:\USER_NAME';

grant read,write on directory USER_NAME to USER_NAME;
```

### 只能指定一个COMPRESS或NOCOMPRESS子句

- 添加transform=segment_attributes:n

### 对象类型TABKE_STATICS创建失败

- EXCLUDE=STATISTICS