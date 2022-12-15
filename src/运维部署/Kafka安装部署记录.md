## **Kafka安装部署记录**

### 上传解压安装包

- flink对应的kafka版本查看flink-connector-kafka源码的pom文件

> tar -zxvf kafka_2.12-2.8.1.tgz

### 修改配置文件

> vi config/server.properties

```properties
# 指定broker的id
broker.id=0
# 数据存储目录
log.dirs=/opt/data/kafka-logs
# 数据留存时间
log.retention.hours=168
# 数据留存大小
log.segment.bytes=1073741824
# zk地址
zookeeper.connect=192.168.1.101:2181,192.168.1.102:2181,192.168.1.103:2181/kafka
# socket地址
listeners=PLAINTEXT://192.168.1.101:9092
# broker地址
advertised.listeners=PLAINTEXT://192.168.1.101:9092
```

### 将配置好的kafka拷贝到其他节点

> scp -r kafka_2.12-2.8.1 192.168.1.102:$PWD

> scp -r kafka_2.12-2.8.1 192.168.1.103:$PWD

### 修改其他节点配置文件

- broker.id
- listeners
- advertised.listeners

### 配置环境变量

> vi /etc/profile

```shell
export KAFKA_HOME=/opt/app/kafka_2.12-2.8.1
export PATH=$PATH:$KAFKA_HOME/bin
```

### 在所有节点启动Kafka

> /opt/app/kafka_2.12-2.8.1/bin/kafka-server-start.sh -daemon /opt/app/kafka_2.12-2.8.1/config/server.properties

- 批量启停脚本

```shell
#!/bin/bash

if [ $1 == start ]
then
for i in {1..3}
do
ssh  192.168.1.10${i} "source /etc/profile;/opt/app/kafka_2.12-2.8.1/bin/kafka-server-start.sh -daemon /opt/app/kafka_2.12-2.8.1/config/server.properties"
done
fi

if [ $1 == stop ]
then
for i in {1..3}
do
ssh  192.168.1.10${i} "source /etc/profile;/opt/app/kafka_2.12-2.8.1/bin/kafka-server-stop.sh"
done
fi
```

> [root@192.168.1.101 utils]# sh kfk.sh start