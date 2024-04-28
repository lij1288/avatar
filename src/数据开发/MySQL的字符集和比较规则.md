## MySQL的字符集和比较规则

- MySQL5.7库表默认字符集为latin1，添加中文会报错，MySQL8.0库表默认字符集为utf8mb4

### 查看字符集和比较规则

```sql
show character set

show collation
```

- 建表时指定字符集和比较规则

```sql
CREATE TABLE test.test (
    Column1 BIGINT(20) auto_increment NOT NULL COMMENT 'Column1',
    Column2 varchar(100) DEFAULT 0 NULL COMMENT 'Column2',
    CONSTRAINT test_PK PRIMARY KEY (Column1)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8
COLLATE=utf8_bin
COMMENT='test';
```

### 默认字符集变更

- 修改my.cnf

  > character_set_server=utf8

- 重启MySQL服务

### 已有库表字符集变更

- 修改库表字符集

```sql
alter database db_name character set 'utf8';

alter table t_name convert to character set 'utf8';
```

- 原有数据需重新导入

### 字符集分类

- character_set_server：服务器的字符集
- character_set_database：当前数据库的字符集
- character_set_client：服务器解码请求时使用的字符集
- character_set_connection：服务器处理请求时会把请求字符串从character_set_client转为 character_set_connection
- character_set_results：服务器向客户端返回数据时使用的字符集

#### 服务器级别

- character_set_server ：服务器的字符集

#### 数据库级别

- character_set_database ：当前数据库的字符集

#### 数据表级别

```sql
create table 表名 (列的信息)
 [[default] character set 字符集名称]
 [collate 比较规则名称]]

 alter table 表名
[[default] character set 字符集名称]
 [collate 比较规则名称]
```

#### 数据列级别

```sql
create table 表名(
列名 字符串类型 [character set 字符集名称] [collate 比较规则名称],
其他列...
 );
 alter table 表名 modify 列名 字符串类型 [character set 字符集名称] [collate 比较规则名称];
```

### 比较规则相关操作

| 后缀 | 描述                         |
| ---- | ---------------------------- |
| _ai  | accent insensitive不区分重音 |
| _as  |                              |
| _ci  |                              |
| _cs  |                              |
| _bin |                              |

- 比较规则后缀
  - _ai
    - accent insensitive不区分重音
  - _as
    - accent sensitive区分重音
  - _ci
    -  case insensitive不区分大小写
  - _cs
    - case sensitive区分大小写
  - _bin
    - 以二进制方式比较

- 查看比较规则

```sql
show collation like 'utf8%';
```

- 查看服务器的字符集和比较规则

```sql
show variables like '%_server';
```

- 查看数据库的字符集和比较规则

```sql
show variables like '%_database';
```

- 查看具体数据库的字符集

```sql
show create database db_name;
```

- 修改具体数据库的字符集

```sql
alter database dbtest1 default character set 'utf8' collate 'utf8_general_ci';
```

- 查看表的字符集

```sql
show create table t_name;
```

- 查看表的比较规则

```sql
show table status from db_name like 't_name';
```

- 修改表的字符集和比较规则

```sql
alter table t_name default character set 'utf8' collate 'utf8_general_ci'
```

