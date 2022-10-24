## **Sqoop的相关操作**

### 列出所有库

```shell
sqoop list-databases \
--connect jdbc:mysql://linux01:3306 \
--username root \
--password root
```

### 列出所有表

```shell
sqoop import \
--connect jdbc:mysql://linux01:3306/test_db \
--username root \
--password root \
--table avatar_t \
--target-dir /sqoopdata/avatar_t \
--fields-terminated-by ',' \
--delete-target-dir \
--split-by id \
-m 2
```

### mysql导入hdfs

- 默认按主键划分maptask，可使用--split-by指定划分任务参照 

- 若主键或划分参照非数字需添加参数 -Dorg.apache.sqoop.splitter.allow_text_splitter=true

```shell
sqoop import \
--connect jdbc:mysql://linux01:3306/test_db \
--username root \
--password root \
--table avatar_t \
--target-dir /sqoopdata/avatar_t  \
--fields-terminated-by ',' \
# 若要生成的文件已存在则删除
--delete-target-dir \
--split-by id \
# 指定maptask的并行度
-m 2
```

无主键

Import failed: No primary key could be found for table avatar2_t. Please specify one with --split-by or perform a sequential import with '-m 1'.

主键非数字或指定参照非数字

ERROR tool.ImportTool: Import failed: java.io.IOException: Generating splits for a textual index column allowed only in case of "-Dorg.apache.sqoop.splitter.allow_text_splitter=true" property passed as a parameter

```shell
sqoop import -Dorg.apache.sqoop.splitter.allow_text_splitter=true \
--connect jdbc:mysql://linux01:3306/test_db \
--username root \
--password root \
--table avatar2_t \
--target-dir /sqoopdata/avatar_t4 \
--fields-terminated-by ',' \
--delete-target-dir \
--split-by name \
-m 2 
```

- 指定要生成的文件类型

```shell
--as-avrodatafile 
--as-parquetfile  
--as-sequencefile 
--as-textfile 
```

- 指定压缩方式

```shell
--compression-codec gzip
```

### mysql导入hive

- 实质是先将数据从mysql导入hdfs，然后利用hive的元数据操作jar包在hive的元数据库生成相应的元数据，并将数据文件导入hive表目录

```shell
sqoop import \
--connect jdbc:mysql://linux01:3306/test_db \
--username root \
--password root \
--table avatar_t \
--hive-import \
--hive-table test_db.avtar_t \
--delete-target-dir \
--as-textfile \
--fields-terminated-by ',' \
--compress   \
--compression-codec gzip \
--split-by id \
--null-string '\\N' \
--null-non-string '\\N' \
--hive-overwrite \
-m 2
```

- 条件导入 --where

```shell
sqoop import \
--connect jdbc:mysql://linux01:3306/test_db \
--username root \
--password root \
--table avatar_t \
--hive-import \
--hive-table avatar_t \
--delete-target-dir \
--as-textfile \
--fields-terminated-by ',' \
--compress   \
--compression-codec gzip \
--split-by id \
--null-string '\\N' \
--null-non-string '\\N' \
--hive-overwrite \
--where "id>3"  \
-m 2
```

- 条件导入 --columns

```shell
sqoop import \
--connect jdbc:mysql://linux01:3306/test_db \
--username root \
--password root \
--table avatar_t \
--hive-import \
--hive-table avatar_t \
--delete-target-dir \
--as-textfile \
--fields-terminated-by ',' \
--compress   \
--compression-codec gzip \
--split-by id \
--null-string '\\N' \
--null-non-string '\\N' \
--hive-overwrite \
--where "id>3"  \
--columns "id,name"   \
-m 2
```

- 查询导入 --query

sql语句中必须有\$CONDITIONS条件：where ​\$CONDITIONS 或 where id>10 and​ $CONDITIONS

$CONDITIONS是拼接任务划分条件的占位符

```shell
sqoop import \
--connect jdbc:mysql://linux:3306/test_db \
--username root \
--password root \
--hive-import \
--hive-table test_db.avatar_t  \
--as-textfile \
--fields-terminated-by ',' \
--compress   \
--compression-codec gzip \
--split-by id \
--null-string '\\N' \
--null-non-string '\\N' \
--hive-overwrite  \
--query 'select id,name where age > 12 and $CONDITIONS'  \
--target-dir '/user/root/tmp'   \
-m 2
```

- 增量导入，根据一个增量字段界定增量数据

```shell
sqoop import \
--connect jdbc:mysql://linux01:3306/test_db \
--username root \
--password root \
--table avatar_t \
--hive-import \
--hive-table avatar_t \
--split-by id \
--incremental append \
--check-column id \
--last-value 25 \
-m 2 
```

- 增量导入，根据修改时间来界定增量数据，必须有一个时间字段随数据的修改而修改

  lastmodified模式下的增量导入，不支持hive导入

```shell
sqoop import \
--connect jdbc:mysql://linux01:3306/test_db \
--username root \
--password root \
--table doit_jw_stu_zsgl \
--target-dir '/sqoopdata/avatar_t'  \
--incremental lastmodified \
--check-column updatetime \
--last-value '2018-08-15 23:59:59'  \
--fields-terminated-by ',' \
--merge-key id   \
-m 1 
```

- 增量导入方式

```shell
--append  # 导入的增量数据直接追加

--merge-key id  # 导入的增量数据若存在旧数据则合并，否则更新
```

### hdfs导出mysql

```shell
sqoop export \
--connect jdbc:mysql://linux01:3306/test_db \
--username root \
--password root \
--table avatar \
--export-dir '/user/hive/warehouse/avatar' \
# 以batch模式去执行sql（批量执行）
--batch
```

- 更新模式

```shell
sqoop export \
--connect jdbc:mysql://linux01:3306/test_db \
--username root \
--password root \
--table avatar \
--export-dir '/export3/' \
--input-null-string 'NaN' \
--input-null-non-string 'NaN' \
# 更新新旧数据模式 allowinsert（默认）直接插入新数据，updateonly更新旧数据
--update-mode allowinsert  \
# 判断新旧数据依据
--update-key id \
--batch
```

### 空值处理

- 读数据，视为空

```shell
--input-null-non-string   <null-str>
--input-null-string  <null-str>
```

- 写数据，空写为

```shell
--null-non-string   <null-str>
--null-string  <null-str>
```


