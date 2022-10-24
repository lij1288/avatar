## **HBase的命令行操作**

- 启动命令行客户端

  > bin/hbase  shell

### 一般命令

#### status

- 查看HBase的状态, 如服务器数量

#### version

- 查询正在使用的HBase版本

#### whoami

- 查询用户信息

### NameSpace操作

- HBase系统默认定义了两个NameSpace

  1. hbase，系统内建表，包括namespace和meta表

     namespace：系统中的namespace信息，meta：系统中的region信息

  2. default，用户建表时未指定namespace的表创建于此

#### create_namespace

- 创建namespace

- 在namespace下创建表

  > create 'myspace:t1','f1','f2'

#### drop_namespace

- 删除namespace

#### list_namespace

- 列出所有的namespace

#### describe_namespace

- 查看namespace

#### list_namespace_tables

- 查看namespace下的表

### DDL数据定义语言

- Data Definition Language

#### create

- 创建表

  > create 't1','f1'
  >
  > 
  >
  > create 't1',{NAME=>'f1',VERSIONS=>3,TTL=>6000,BLOOMFILTER=>'ROWCOL'},{NAME=>'f2'}
  >
  > VERSIONS：存储数据的最大保留版本数，存储最近的n个版本，以前默认保留3个，现在默认保留1个
  >
  > TTL：数据的生命周期，默认FOREVER
  >
  > BLOOMFILTER：布隆过滤器，可选值：'ROW''(默认)、'ROWCOL'(row+colum[family+qualifier])、'NONE'
  >
  > 
  >
  > create 't1', 'f1', SPLITS => ['10', '20', '30', '40']

#### desc

- 查看表结构

#### drop

- 删除表（需先让表为disable状态）

  > disable 't1'
  >
  > drop 't1'

#### alter

- 变更表信息

  > alter 't1',{NAME=>'f2',VERSIONS=>2}
  >
  > 若NAME不存在则新建

#### list_region

- 查看表的region信息

#### locate_region

- 根据rowkey定位region信息

#### disable/enable

- 禁用/启用表

#### is_disable/is_enable

- 获取一个表的禁用/启用状态

#### exist

- 查看表是否存在

#### show_filters

- 显示可用的查询过滤器

### DML数据操作语言

- Data Manipulation Language

#### put

- 插入、更改数据

> put 't1','r001','f1:name','Aang'

- 使用linux的输入重定向功能，实现hbase shell客户端的批量命令执行

```shell
#!bin/bash
exec /usr/apps/hbase-2.0.4/bin/hbase shell << EOF
put 't1','r001','f1:name','Aang'
put 't1','r001','f1:age','12'
put 't1','r001','f2:gender','male'
put 't1','r002','f1:name','Katara'
put 't1','r002','f1:age','14'
put 't1','r002','f2:gender','female'
put 't1','r003','f1:name','Sokka'
put 't1','r003','f1:age','15'
put 't1','r003','f2:gender','male'
EOF
```

#### scan

- 查看表数据

  > scan 't1'
  >
  > scan 't1',{COLUMNS=>'f1'}
  >
  > scan 't1',{COLUMNS=>'f1:name'}
  >
  > scan 't1',{ROWPREFIXFILTER=>'r'}
  >
  > scan 't1',{STARTROW=>'r001',STOPROW=>'r003'} --------- 左闭右开
  >
  > scan 't1',{STARTROW=>'r002'}

#### get

- 查看指定行/列族/列的数据

  > get 't1','r001'
  >
  > get 't1','r001','f1'
  >
  > get 't1','r001','f1:name'

#### delete

- 删除某列数据

  > delete 't1','r001','f1:name'

#### deleteall

- 删除某行数据

  > deleteall 't1','r001'

#### truncate

- 清空表

  > truncate 't1'
  >
  > 会自动先disable，完成后再enable
  >
  > Truncating 't1' table (it may take a while):
  > Disabling table...
  > Truncating table...
  > Took 2.2426 seconds

#### count

- 统计行数

  > count 't1'

### 运维管理操作

#### zk_dump

- 查看集群及zookeeper的信息

  - master信息
  - regionserver信息
  - zookeeper quorum server信息

  ```
  hbase(main):021:0> zk_dump
  
  HBase is rooted at /hbase
  Active master address: linux01,16000,1567509883457
  Backup master addresses:
  Region server holding hbase:meta: linux02,16020,1567509891501
  Region servers:
  linux02,16020,1567509891501
  linux01,16020,1567509886020
  /hbase/replication: 
  /hbase/replication/peers: 
  /hbase/replication/rs: 
  /hbase/replication/rs/linux01,16020,1567509886020: 
  /hbase/replication/rs/linux02,16020,1567509891501: 
  Quorum Server Statistics:
  linux01:2181
  Zookeeper version: 3.4.6-1569965, built on 02/20/2014 09:09 GMT
  Clients:
  /192.168.1.103:44205[0](queued=0,recved=1,sent=0)
  
  Latency min/avg/max: 0/4/82
  Received: 102
  Sent: 101
  Connections: 1
  Outstanding: 0
  Zxid: 0x31000000ba
  Mode: follower
  Node count: 55
  linux02:2181
  Zookeeper version: 3.4.6-1569965, built on 02/20/2014 09:09 GMT
  Clients:
  /192.168.1.103:43858[1](queued=0,recved=178,sent=178)
  /192.168.1.103:44098[0](queued=0,recved=1,sent=0)
  /192.168.1.104:35102[1](queued=0,recved=213,sent=218)
  /192.168.1.103:44096[1](queued=0,recved=14,sent=14)
  
  Latency min/avg/max: 0/0/98
  Received: 559
  Sent: 563
  Connections: 4
  Outstanding: 0
  Zxid: 0x31000000ba
  Mode: leader
  Node count: 55
  linux03:2181
  Zookeeper version: 3.4.6-1569965, built on 02/20/2014 09:09 GMT
  Clients:
  /192.168.1.103:48768[1](queued=0,recved=371,sent=385)
  /192.168.1.103:49018[0](queued=0,recved=1,sent=0)
  /192.168.1.103:48767[1](queued=0,recved=218,sent=227)
  
  Latency min/avg/max: 0/0/43
  Received: 791
  Sent: 816
  Connections: 3
  Outstanding: 0
  Zxid: 0x31000000ba
  Mode: follower
  Node count: 55
  Took 0.2053 seconds
  ```
  
  

#### flush

- 手动触发regionserver内存中的数据flush到hdfs文件中

  > flush 'TABLENAME'	----- FLUSH整个表的所有region的数据

  

  > flush 'REGIONNAME'	----- FLUSH一个指定的region的数据
  >
  > flush 't1,,1567511352137.0dc090a295f6941eac28467726757449.'

  

  > flush 'ENCODED_REGIONNAME'	----- FLUSH一个指定的region的数据
  >
  > flush '80faf02f78740c27429a385df4d8818d'

  

  > flush 'REGION_SERVER_NAME'	----- FLUSH一个指定的regionserver中托管的所有region的数据

  

#### move

- 移动region

  > move 'ENCODED_REGIONNAME'
  >
  > move '80faf02f78740c27429a385df4d8818d'

  

  > move 'ENCODED_REGIONNAME', 'SERVER_NAME'
  >
  > move '80faf02f78740c27429a385df4d8818d','linux03,16020,1567514124105'
  >
  > move '80faf02f78740c27429a385df4d8818d','linux03,16020'



#### unassign/assign

- 去分配/分配（往往是移动region等其他操作的中间步骤）

  > unassign 'REGIONNAME'
  >
  > unassign 'REGIONNAME', true	----- 强制
  >
  > unassign 'ENCODED_REGIONNAME'
  >
  > unassign 'ENCODED_REGIONNAME', true
  >
  > unassign '80faf02f78740c27429a385df4d8818d'	----- 查看首页Online Regions为0

  

  > assign 'REGIONNAME'
  >
  > assign 'ENCODED_REGIONNAME'
  >
  > assign '80faf02f78740c27429a385df4d8818d'



#### balance_switch true/false

- 开启/关闭自动负载均衡

  > balance_switch true/false

  

#### balancer_enabled

- 查看当前负载均衡状态

  > balancer_enabled



#### split

- 手动触发split操作

  > split 'regionName', 'splitKey'
  >
  > split 'd3e5aa8fffbfff6b2d267ac2b21820e5','r002'



#### merge_region

- 手动合并region

  > hbase> merge_region 'FULL_REGIONNAME', 'FULL_REGIONNAME'
  >
  > hbase> merge_region 'FULL_REGIONNAME', 'FULL_REGIONNAME', true	----- 强制
  >
  > hbase> merge_region 'ENCODED_REGIONNAME', 'ENCODED_REGIONNAME'
  >
  > hbase> merge_region 'ENCODED_REGIONNAME', 'ENCODED_REGIONNAME', true
  >
  > merge_region 'a2744e261ecc71d0e8b83d815ff1e381','68d720bbeb5ba7d2576857cd4e27ef70' 



#### major_compact

- 手动触发major compact

  > major_compact 't1'	----- compact指定表中的所有region
  >
  > major_compact 'r1'	----- compact一个指定的region
  >
  > major_compact 'r1', 'c1'	----- compact一个指定region中一个指定列族
  >
  > major_compact 't1', 'c1'	----- compact指定表中的一个指定列族