## **Neo4j的命令行操作**

### 创建一个节点

```
create(n:Stock{name:'安琪酵母',code:'600298',launchDate:date('2000-08-18')}) return n
```

### 创建多个节点

```
create(n:Stock{name:'招商银行',code:'600036',launchDate:date('2002-04-09')}),
(:Stock{name:'中科创达',code:'300496',launchDate:date('2015-12-10')}),
(:Stock{name:'华工科技',code:'000988',launchDate:date('2000-06-09')}),
(:Stock{name:'国信证券',code:'002736',launchDate:date('2014-12-29')})
```

```
create(n:SecuritiesExchange{name:'上海证券交易所'}),(:SecuritiesExchange{name:'深圳证券交易所'})
```

```
create(n:Province{name:'北京'}),(:Province{name:'湖北'}),(:Province{name:'广东'})
```

### 建立关系

```
match(a:Stock),(b:SecuritiesExchange) where a.name = '安琪酵母' and b.name = '上海证券交易所' create (a)-[r:Exchange]->(b) return r
```

```
match(a:Stock),(b:Province) where a.name = '安琪酵母' and b.name = '湖北' create (a)-[r:Area]->(b) return r
```

### 查询某个节点

```
match(a:Stock) where a.name = '安琪酵母' return a
```

### 查询某个标签的所有节点

```
match(a:Stock) return a
```

### 查询某个标签的节点个数

```
match(a:Stock) return count(a)
```

### 查询两个节点之间的关系类型

```
match(:Stock{name:'安琪酵母'})-[r]->(:Province{name:'湖北'}) return type(r)
```

### 查询某个节点所有的关系

```
match a = ()-[]->(:Province{name:'上海'}) return a
```

### 查询某个节点所有的关系类型

```
match(:Stock{name:'安琪酵母'})-[r]->() return type(r)
```

### 删除某个节点

```
match(a:Stock) where a.name = '中科创达' delete a
```

### 删除某个标签的所有节点

```
match(n:Stock) delete n
```

### 删除所有节点

```
match(n) delete n
```

### 删除两个节点之间的关系

```
match(:Stock{name:'安琪酵母'})-[r]->(:Province{name:'湖北'}) delete r
```

### 删除某个节点的所有关系

```
match(:Stock{name:'安琪酵母'})-[r]->() delete r
```

### 删除某个标签的所有关系

```
match(:Stock)-[r]->() delete r
```

### 增加节点的属性

```
match(a:Stock) where a.name = '安琪酵母' set a.abbreviation = 'AQJM' return a
```

### 删除节点的属性

```
match(a:Stock) where a.name = '安琪酵母' remove a.abbreviation return a
```

### 查询某个节点有关的节点和关系
```
match (m)-[r]-(n:Stock{name:'安琪酵母'}) return m,r,n
```
### 删除某个节点有关的节点和关系
```
match (m)-[r]-(n:Stock{name:'安琪酵母'}) delete m,r,n
```