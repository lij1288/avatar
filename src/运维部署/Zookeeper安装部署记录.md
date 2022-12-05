## **ZooKeeper安装部署记录**

### 解压安装包

> tar -zxvf zookeeper-3.4.6.tar.gz -C /opt/app/

### 修改配置文件

> cd conf

> cp zoo_sample.cfg zoo.cfg

- vi zoo.cfg

```shell
dataDir=/opt/data/zookeeper

# Set to "0" to disable auto purge feature
#autopurge.purgeInterval=1
server.1=192.168.1.101:2888:3888
server.2=192.168.1.102:2888:3888
server.3=192.168.1.103:2888:3888
```

- 在各个节点上，手动创建数据存储目录

> mkdir -p /opt/data/zookeeper

- 在各个节点的数据存储目录中，生成一个myid文件，内容为它的id

> echo 1 > /opt/data/zookeeper/myid

> echo 2 > /opt/data/zookeeper/myid

> echo 3 > /opt/data/zookeeper/myid

### 拷贝到其他机器

> scp -r zookeeper-3.4.6/ 192.168.1.102:$PWD

> scp -r zookeeper-3.4.6/ 192.168.1.103:$PWD

### 启停Zookeeper

> bin/zkServer.sh start
>
> bin/zkServer.sh stop

- 批量启停脚本

> vi zk.sh

```shell
#!/bin/bash

for i in {1..3}
do
ssh 192.168.1.10${i} "source /etc/profile;/opt/app/zookeeper-3.4.6/bin/zkServer.sh $1 "
done

sleep 2

if [ $1 == start ]
then
for i in {1..3}
do
ssh 192.168.1.10${i} "source /etc/profile;/opt/app/zookeeper-3.4.6/bin/zkServer.sh status "
done
fi
```

> [root@192.168.1.101 zookeeper-3.4.6]# sh zk.sh start
>
> JMX enabled by default
>
> Using config: /opt/app/zookeeper-3.4.6/bin/../conf/zoo.cfg
>
> Starting zookeeper ... STARTED
>
> JMX enabled by default
>
> Using config: /opt/app/zookeeper-3.4.6/bin/../conf/zoo.cfg
>
> Starting zookeeper ... STARTED
>
> JMX enabled by default
>
> Using config: /opt/app/zookeeper-3.4.6/bin/../conf/zoo.cfg
>
> Starting zookeeper ... STARTED
>
> JMX enabled by default
>
> Using config: /opt/app/zookeeper-3.4.6/bin/../conf/zoo.cfg
>
> Mode: follower
>
> JMX enabled by default
>
> Using config: /opt/app/zookeeper-3.4.6/bin/../conf/zoo.cfg
>
> Mode: leader
>
> JMX enabled by default
>
> Using config: /opt/app/zookeeper-3.4.6/bin/../conf/zoo.cfg
>
> Mode: follower

### 查看状态

> bin/zkServer.sh status