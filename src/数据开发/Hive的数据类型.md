## **Hive的数据类型**

### 1. 基本数据类型

#### 1.1 数字类型

- TINYINT
- SMALLINT
- **INT**
- **BIGINT**
- **FLOAT**
- **DOUBLE**

#### 1.2 时间类型

- TIMESTAMP
- DATE

#### 1.3 字符串类型

- **STRING**
- VARCHAR 长度不定字符串，字符数1-65535
- CHAR 长度固定字符串，最大字符数255

#### 1.4 其他类型

- BOOLEAN
- BINARY

### 2. 集合数据类型

#### 2.1 ARRAY

- array<data_type>

```sql
--avatar,aang:katara:sokka,2005-02-21
create table t_movie(movie_name string,actors array<string>,first_show date)
row format delimited fields terminated by ','
collectin items terminated by ':'
--
select movie_name,actors[0] form t_movie;
select movie_name,actors from t_movie where array_contains(actors,'katara');
select movie_name,size(actors) from t_movie;
```

#### 2.2 MAP

- map<primitive_type,data_type>

```sql
--katara,husband:aang#brother:sokka,25
create table t_person(name string,family_members map<string,string>,age int)
row format delimited fields terminated by ','
collection items terminated by '#'
map keys terminated by ':';
--查询指定key的value
select name,family_members['brother'] as brother from t_person;
--查询所有key
select name,map_keys(family_members) as relation from t_person;
--查询所有value
select name,map_values(family_members) from t_person;
select name,map_values(family_members)[0] from t_person;
```

#### 2.3 STRUCT

- struct\<col_name:data_type,...>

```sql
--katara,25:female:fuzhou
create table t_person(name string,info struct<age:int,sex:string,addr:string)
row format delimited fields terminated by ','
collection items terminated by ':';
--
select * from t_person;
select name,info.age from t_person;
```

