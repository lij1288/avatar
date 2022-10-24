## **Docker版Neo4j安装记录**

### 拉取镜像源

```shell
docker pull neo4j
```

### 启动容器

```shell
docker run -d --name neo4jtest \
-p 7474:7474 -p 7687:7687 \
-v /opt/neo4j/data:/data \
-v /opt/neo4j/logs:/logs \
-v /opt/neo4j/conf:/var/lib/neo4j/conf \
-v /opt/neo4j/import:/var/lib/neo4j/import \
--env NEO4J_AUTH=neo4j/123456 \
neo4j
```

- 挂载目录

- data：数据目录
- logs：日志目录
- conf：配置目录
- import：导入目录

### 新建数据库

1. 修改conf/neo4j.conf

```
dbms.active_database=test.db
```

1. 重启容器

```
docker container restart neo4jtest
```

### 参数修改

1. 查看推荐内存

```
bin/neo4j-admin memrec --memory=32g --docker
```

```
...
# Based on the above, the following memory settings are recommended:
EXPORT NEO4J_dbms_memory_heap_initial__size='12g'
EXPORT NEO4J_dbms_memory_heap_max__size='12g'
EXPORT NEO4J_dbms_memory_pagecache_size='4g'
...
```

2. 修改conf/neo4j.conf

```
dbms.memory.heap.initial_size=12g
dbms.memory.heap.max_size=12g
dbms.memory.pagecache.size=4g
```

3. 重启容器

```
docker container restart neo4jtest
```