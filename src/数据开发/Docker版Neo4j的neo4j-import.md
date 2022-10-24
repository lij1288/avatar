## **Docker版Neo4j的neo4j-import**

### 数据文件

- :LABEL表示标签，一个节点可以有多个标签
- :START_ID和END_ID对应节点的:ID
- :TYPE表示关系类型
- 节点和关系都可以具有属性

movies.csv

```
movieId:ID,title,year:int,:LABEL
tt0133093,"The Matrix",1999,Movie
tt0234215,"The Matrix Reloaded",2003,Movie;Sequel
tt0242653,"The Matrix Revolutions",2003,Movie;Sequel
```

actors.csv

```
personId:ID,name,:LABEL
keanu,"Keanu Reeves",Actor
laurence,"Laurence Fishburne",Actor
carrieanne,"Carrie-Anne Moss",Actor
```

roles.csv

```
:START_ID,role,:END_ID,:TYPE
keanu,"Neo",tt0133093,ACTED_IN
keanu,"Neo",tt0234215,ACTED_IN
keanu,"Neo",tt0242653,ACTED_IN
laurence,"Morpheus",tt0133093,ACTED_IN
laurence,"Morpheus",tt0234215,ACTED_IN
laurence,"Morpheus",tt0242653,ACTED_IN
carrieanne,"Trinity",tt0133093,ACTED_IN
carrieanne,"Trinity",tt0234215,ACTED_IN
carrieanne,"Trinity",tt0242653,ACTED_IN
```

### 导入数据

1. 导入命令

```
docker exec --interactive --tty neo4jtest neo4j-admin import --database=test.db \
--nodes=import/movies.csv  --nodes=import/actors.csv  --relationships=import/roles.csv
```

2. 修改配置文件conf/neo4j.conf

```
dbms.active_database=test.db
```

3. 重启容器

```
docker container restart neo4jtest
```

### 重新导入

1. 删除原数据

```
rm -rf data/databases/test.db
rm -rf data/transactions/test.db
```

2. 重新导入

```
docker exec --interactive --tty neo4jtest neo4j-admin import --database=test.db \
--nodes=import/movies.csv  --nodes=import/actors.csv  --relationships=import/roles.csv
```

3. 重启容器

```
docker container restart neo4jtest
```

### 数据去重

- 查看参数说明

```
docker exec --interactive --tty neo4jtest neo4j-admin import
```

- 按节点ID去重导入

```
docker exec --interactive --tty neo4jtest neo4j-admin import --database=test.db \
--skip-duplicate-nodes \
--nodes=import/movies.csv --nodes=import/actors.csv --relationships=import/roles.csv
```

### 表头单独导入及多文件导入

```
docker exec --interactive --tty neo4jtest neo4j-admin import --database=test.db  \
--nodes=import/movies4-header.csv,import/movies4-part1.csv,import/movies4-part2.csv \
--nodes=import/actors4-header.csv,import/actors4-part1.csv,import/actors4-part2.csv \
--relationships=import/roles4-header.csv,import/roles4-part1.csv,import/roles4-part2.csv
```