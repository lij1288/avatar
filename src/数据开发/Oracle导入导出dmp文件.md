## **Oracle导入导出dmp文件**

### 查询默认导出目录

```sql
select * from dba_directories where directory_name='DATA_PUMP_DIR';
-- /opt/myoracle/oracle/admin/orcl/dpdump
```

### 导出导入所有表

- 导出test2下所有表

  > expdp test2/test2_pwd@orcl dumpfile=test2.dmp

- 删除test2

  > drop user test2 cascade;

- 导入文件

  > impdp test/test_pwd@orcl dumpfile=test2.dmp

### 导出导入目标表

- 导出test2下的table1和table2（数据库中表名需大写，需存在test2用户）

  > expdp test2/test2_pwd@orcl tables=table1,table2 dumpfile=table.dmp

- 删除并创建test2用户

  > drop user test2 cascade;
  >
  > create user test2 identified by test2_pwd;
  >
  > grant connect,resource,dba to test2;

- 导入文件

  > impdp test/test_pwd@orcl tables=test2.table1,test2.table2 dumpfile=table.dmp

### 指定导出目录

- 创建目录并授权

  > create directory dmp_dir as '/opt/myoracle/tmp';

  > chown -R oracle:oinstall /opt/myoracle/tmp

- 导出test2下所有表

  > expdp test2/test2_pwd@orcl directory=dmp_dir dumpfile=test2.dmp

- 删除test2

  > drop user test2 cascade;

- 导入文件

  > impdp test/test_pwd@orcl directory=dmp_dir dumpfile=test2.dmp