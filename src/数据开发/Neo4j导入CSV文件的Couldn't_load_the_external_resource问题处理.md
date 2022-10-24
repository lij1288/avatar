## **Neo4j导入CSV文件的Couldn't load the external resource问题处理**

### 问题记录

- Neo4j导入CSV文件过程中，将文件放入import后运行命令

```
load csv with headers from 'file:///Stock.csv' as line
create(:Stock{fullname:line.fullname,englishname:line.englishname,address:line.address,code:line.code,name:line.name,fdate:line.fdate})
```

- 报错内容

> Neo.ClientError.Statement.ExternalResourceFailed Couldn't load the external resource at: file:/stock.csv ()

### 解决过程

- Windows版Neo4j的配置文件conf/neo4j.conf中默认配置了dbms.directories.import=import，所以可以将文件放入improt后使用相对路径导入

- docker版Neo4j的配置文件中没有配置dbms.directories.import参数，所以需要使用全路径导入

```
load csv with headers from 'file:///var/lib/neo4j/import/Stock.csv' 
```

- 或者在conf/neo4j.conf中配置dbms.directories.import后重启