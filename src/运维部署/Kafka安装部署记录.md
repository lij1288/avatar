## **Kafka安装部署记录**

### 上传解压安装包

- flink对应的kafka版本查看flink-connector-kafka源码的pom文件

> tar -zxvf kafka_2.12-2.8.1.tgz

### 修改配置文件

> cd config

> vi server.properties

```properties
#指定broker的id
broker.id=1
#数据存储的目录
log.dirs=/opt/app/data/kafka-logs
#指定zk地址
zookeeper.connect=192.168.1.101:2181,192.168.1.102:2181,192.168.1.103:2181
# delete.topic.enable=true
```

### 将配置好的kafka拷贝到其他节点

> scp -r kafka_2.12-2.8.1 192.168.1.102:$PWD

> scp -r kafka_2.12-2.8.1 192.168.1.103:$PWD

### 修改其他节点Kafka的broker.id

### 在所有节点启动Kafka

> /opt/app/kafka_2.12-2.8.1/bin/kafka-server-start.sh -daemon /opt/app/kafka_2.12-2.8.1/config/server.properties

- 批量启停脚本

```shell
#!/bin/bash

if [ $1 == start ]
then
for i in {1..3}
do
ssh 192.168.1.10${i} "source /etc/profile;/opt/app/kafka_2.12-2.8.1/bin/kafka-server-start.sh -daemon /opt/app/kafka_2.12-2.8.1/config/server.properties"
done
fi

if [ $1 == stop ]
then
for i in {1..3}
do
ssh 192.168.1.10${i} "source /etc/profile;/opt/app/kafka_2.12-2.8.1/bin/kafka-server-stop.sh"
done
fi
```

> [root@192.168.1.101 utils]# sh kfk.sh start
>