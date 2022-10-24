## **Hadoop安装部署记录**

### 解压安装包

> tar -zxvf hadoop-2.8.5.tar.gz -C /opt/app/

### 删除文档

位置：$HADOOP_HOME/share

> rm -rf doc

### 修改配置文件

#### HDFS配置

位置：$HADOOP_HOME/etc/hadoop/

> vi hadoop-env.sh

```shell
# The java implementation to use.
export JAVA_HOME=/opt/app/jdk1.8.0_202/
```

> vi hdfs-site.xml

```xml
<configuration>
<!--namenode的rpc通信地址-->
<property>
<name>dfs.namenode.rpc-address</name>
<value>linux01:9000</value>
</property>
<!--secondary namenode的http地址-->
<property>
<name>dfs.namenode.secondary.http-address</name>
<value>linux02:50090</value>
</property>
<!--namenode的元数据持久化存储目录-->
<property>
<name>dfs.namenode.name.dir</name>
<value>/opt/hdpdata/name/</value>
</property>
<!--secondarynamenode的存储目录-->
<property>
<name>dfs.namenode.checkpoint.dir</name>
<value>/opt/hdpdata/secondayname/</value>
</property>
<!--data的块存储目录-->
<property>
<name>dfs.datanode.data.dir</name>
<value>/opt/hdpdata/data/</value>
</property>
</configuration>
```

> vi core-site.xml

```xml
<!--hdfs客户端默认访问的文件系统-->
<property>
<name>fs.defaultFS</name>
<value>hdfs://linux01:9000/</value>
</property>
```

#### Yarn配置

> vi yarn-site.xml 

```xml
<!--主节点所在机器-->
<property>
<name>yarn.resourcemanager.hostname</name>
<value>linux01</value>
</property>

<!--为mr程序提供shuffle服务-->
<property>
<name>yarn.nodemanager.aux-services</name>
<value>mapreduce_shuffle</value>
</property>
```

#### MapReduce配置

> cp mapred-site.xml.template mapred-site.xml
>
> vi mapred-site.xml

```xml
<!--mr运行模型，默认为local-->
<property>
  <name>mapreduce.framework.name</name>
  <value>yarn</value>
</property>
```

### 拷贝到其他机器

> for i in {2..3}
>
> \> do
>
> \> scp -r /opt/app/hadoop-2.8.5 linux0${i}:/opt/app/
>
> \> done

### 配置环境变量

> vi /etc/profile

```shell
export JAVA_HOME=/opt/app/jdk1.8.0_202
export HADOOP_HOME=/opt/app/hadoop-2.8.5
export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/sbin:$HADOOP_HOME/bin
```

> source /etc/profile

### 初始化元数据目录

> hadoop namenode -format

### 启动组件

#### 启动HDFS

- 单独启动

> hadoop-daemon.sh start namenode
>
> hadoop-daemon.sh start datanode
>
> hadoop-daemon.sh start secondarynamenode
>
> hadoop-daemon.sh stop namenode
>
> hadoop-daemon.sh stop datanode
>
> hadoop-daemon.sh stop secondarynamenode

- 批量启动

> vi slaves

```
linux01
linux02
linux03
```

> start-dfs.sh
>
> stop-dfs.sh

#### 启动Yarn

- 单独启动

> yarn-daemon.sh start resourcemanager
>
> yarn-daemon.sh stop resourcemanager
>
> yarn-daemon.sh start nodemanager
>
> yarn-daemon.sh stop nodemanager

- 批量启动

> start-yarn.sh
>
> stop-yarn.sh

#### 测试MapReduce

> cd /opt/app/hadoop-2.8.5/share/hadoop/mapreduce
>
> hadoop jar hadoop-mapreduce-examples-2.8.5.jar
>
> hadoop jar hadoop-mapreduce-examples-2.8.5.jar pi 10 10

### 注意事项

- 元数据目录不会像DateNode块存储目录那样根据配置文件自动创建

> cat /opt/hdpdata/name/current/VERSION

```shell
#Mon Jan 11 17:34:40 CST 2021
namespaceID=1710038
clusterID=CID-e944a738-e42e-4f76-add1-74180a7a7ed1 #集群ID
cTime=1610357680824 #创建时间
storageType=NAME_NODE
blockpoolID=BP-1113767523-192.168.1.101-1610357680824 #块池ID，NameNode的IP，创建时间
layoutVersion=-63
```

- 新的DateNode会去找NameNode注册，NameNode会返回集群ID、块池ID给DateNode，DateNode创建集群存储目录

> ll /opt/hdpdata/data/current

```
drwx------. 4 root root 4096 Jan 11 18:42 BP-1113767523-192.168.1.101-1610357680824
-rw-r--r--. 1 root root  229 Jan 11 18:42 VERSION
```

> cat /opt/hdpdata/data/current/VERSION

```shell
#Mon Jan 11 18:42:04 CST 2021
storageID=DS-cb0fb282-8c4a-46f9-b52a-9fce1cc1f7e4
clusterID=CID-e944a738-e42e-4f76-add1-74180a7a7ed1
cTime=0
datanodeUuid=99f887b8-fb83-4dd5-8ce8-f4411029f7cc
storageType=DATA_NODE
layoutVersion=-57
```

- 监听端口
  - 9000：hdfs的rpc端口，DataNode、Client与NameNode通信的端口
  - 50070：hdfs的http服务端口
  - 8088：yarn的http服务端口

> jps

```
5765 NameNode
7350 NodeManager
5897 DataNode
7257 ResourceManager
8767 Jps
```

> netstat -nltp | grep 5765

```
tcp        0      0 0.0.0.0:50070               0.0.0.0:*                   LISTEN      5765/java           
tcp        0      0 192.168.1.101:9000          0.0.0.0:*                   LISTEN      5765/java          
```

> netstat -nltp | grep 7257

```
tcp        0      0 ::ffff:192.168.1.101:8088   :::*                        LISTEN      7257/java           
tcp        0      0 ::ffff:192.168.1.101:8030   :::*                        LISTEN      7257/java           
tcp        0      0 ::ffff:192.168.1.101:8031   :::*                        LISTEN      7257/java           
tcp        0      0 ::ffff:192.168.1.101:8032   :::*                        LISTEN      7257/java           
tcp        0      0 ::ffff:192.168.1.101:8033   :::*                        LISTEN      7257/java           
```

- 查看启动命令

> ps -ef | grep java

```
root       5765      1  0 Jan11 ?        00:01:00 /opt/app/jdk1.8.0_202//bin/java -Dproc_namenode -Xmx1000m -Djava.net.preferIPv4Stack=true -Dhadoop.log.dir=/opt/app/hadoop-2.8.5/logs -Dhadoop.log.file=hadoop.log -Dhadoop.home.dir=/opt/app/hadoop-2.8.5 -Dhadoop.id.str=root -Dhadoop.root.logger=INFO,console -Djava.library.path=/opt/app/hadoop-2.8.5/lib/native -Dhadoop.policy.file=hadoop-policy.xml -Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Stack=true -Dhadoop.log.dir=/opt/app/hadoop-2.8.5/logs -Dhadoop.log.file=hadoop-root-namenode-linux01.log -Dhadoop.home.dir=/opt/app/hadoop-2.8.5 -Dhadoop.id.str=root -Dhadoop.root.logger=INFO,RFA -Djava.library.path=/opt/app/hadoop-2.8.5/lib/native -Dhadoop.policy.file=hadoop-policy.xml -Djava.net.preferIPv4Stack=true -Dhadoop.security.logger=INFO,RFAS -Dhdfs.audit.logger=INFO,NullAppender -Dhadoop.security.logger=INFO,RFAS -Dhdfs.audit.logger=INFO,NullAppender -Dhadoop.security.logger=INFO,RFAS -Dhdfs.audit.logger=INFO,NullAppender -Dhadoop.security.logger=INFO,RFAS org.apache.hadoop.hdfs.server.namenode.NameNode
root       5897      1  0 Jan11 ?        00:00:43 /opt/app/jdk1.8.0_202//bin/java -Dproc_datanode -Xmx1000m -Djava.net.preferIPv4Stack=true -Dhadoop.log.dir=/opt/app/hadoop-2.8.5/logs -Dhadoop.log.file=hadoop.log -Dhadoop.home.dir=/opt/app/hadoop-2.8.5 -Dhadoop.id.str=root -Dhadoop.root.logger=INFO,console -Djava.library.path=/opt/app/hadoop-2.8.5/lib/native -Dhadoop.policy.file=hadoop-policy.xml -Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Stack=true -Dhadoop.log.dir=/opt/app/hadoop-2.8.5/logs -Dhadoop.log.file=hadoop-root-datanode-linux01.log -Dhadoop.home.dir=/opt/app/hadoop-2.8.5 -Dhadoop.id.str=root -Dhadoop.root.logger=INFO,RFA -Djava.library.path=/opt/app/hadoop-2.8.5/lib/native -Dhadoop.policy.file=hadoop-policy.xml -Djava.net.preferIPv4Stack=true -server -Dhadoop.security.logger=ERROR,RFAS -Dhadoop.security.logger=ERROR,RFAS -Dhadoop.security.logger=ERROR,RFAS -Dhadoop.security.logger=INFO,RFAS org.apache.hadoop.hdfs.server.datanode.DataNode
root       7257      1  0 01:22 pts/0    00:00:43 /opt/app/jdk1.8.0_202//bin/java -Dproc_resourcemanager -Xmx1000m -Dhadoop.log.dir=/opt/app/hadoop-2.8.5/logs -Dyarn.log.dir=/opt/app/hadoop-2.8.5/logs -Dhadoop.log.file=yarn-root-resourcemanager-linux01.log -Dyarn.log.file=yarn-root-resourcemanager-linux01.log -Dyarn.home.dir= -Dyarn.id.str=root -Dhadoop.root.logger=INFO,RFA -Dyarn.root.logger=INFO,RFA -Djava.library.path=/opt/app/hadoop-2.8.5/lib/native -Dyarn.policy.file=hadoop-policy.xml -Dhadoop.log.dir=/opt/app/hadoop-2.8.5/logs -Dyarn.log.dir=/opt/app/hadoop-2.8.5/logs -Dhadoop.log.file=yarn-root-resourcemanager-linux01.log -Dyarn.log.file=yarn-root-resourcemanager-linux01.log -Dyarn.home.dir=/opt/app/hadoop-2.8.5 -Dhadoop.home.dir=/opt/app/hadoop-2.8.5 -Dhadoop.root.logger=INFO,RFA -Dyarn.root.logger=INFO,RFA -Djava.library.path=/opt/app/hadoop-2.8.5/lib/native -classpath /opt/app/hadoop-2.8.5/etc/hadoop:/opt/app/hadoop-2.8.5/etc/hadoop:/opt/app/hadoop-2.8.5/etc/hadoop:/opt/app/hadoop-2.8.5/share/hadoop/common/lib/*:/opt/app/hadoop-2.8.5/share/hadoop/common/*:/opt/app/hadoop-2.8.5/share/hadoop/hdfs:/opt/app/hadoop-2.8.5/share/hadoop/hdfs/lib/*:/opt/app/hadoop-2.8.5/share/hadoop/hdfs/*:/opt/app/hadoop-2.8.5/share/hadoop/yarn/lib/*:/opt/app/hadoop-2.8.5/share/hadoop/yarn/*:/opt/app/hadoop-2.8.5/share/hadoop/mapreduce/lib/*:/opt/app/hadoop-2.8.5/share/hadoop/mapreduce/*:/opt/app/hadoop-2.8.5/contrib/capacity-scheduler/*.jar:/opt/app/hadoop-2.8.5/contrib/capacity-scheduler/*.jar:/opt/app/hadoop-2.8.5/contrib/capacity-scheduler/*.jar:/opt/app/hadoop-2.8.5/share/hadoop/yarn/*:/opt/app/hadoop-2.8.5/share/hadoop/yarn/lib/*:/opt/app/hadoop-2.8.5/etc/hadoop/rm-config/log4j.properties org.apache.hadoop.yarn.server.resourcemanager.ResourceManager
root       7350      1  0 01:22 ?        00:00:25 /opt/app/jdk1.8.0_202//bin/java -Dproc_nodemanager -Xmx1000m -Dhadoop.log.dir=/opt/app/hadoop-2.8.5/logs -Dyarn.log.dir=/opt/app/hadoop-2.8.5/logs -Dhadoop.log.file=yarn-root-nodemanager-linux01.log -Dyarn.log.file=yarn-root-nodemanager-linux01.log -Dyarn.home.dir= -Dyarn.id.str=root -Dhadoop.root.logger=INFO,RFA -Dyarn.root.logger=INFO,RFA -Djava.library.path=/opt/app/hadoop-2.8.5/lib/native -Dyarn.policy.file=hadoop-policy.xml -server -Dhadoop.log.dir=/opt/app/hadoop-2.8.5/logs -Dyarn.log.dir=/opt/app/hadoop-2.8.5/logs -Dhadoop.log.file=yarn-root-nodemanager-linux01.log -Dyarn.log.file=yarn-root-nodemanager-linux01.log -Dyarn.home.dir=/opt/app/hadoop-2.8.5 -Dhadoop.home.dir=/opt/app/hadoop-2.8.5 -Dhadoop.root.logger=INFO,RFA -Dyarn.root.logger=INFO,RFA -Djava.library.path=/opt/app/hadoop-2.8.5/lib/native -classpath /opt/app/hadoop-2.8.5/etc/hadoop:/opt/app/hadoop-2.8.5/etc/hadoop:/opt/app/hadoop-2.8.5/etc/hadoop:/opt/app/hadoop-2.8.5/share/hadoop/common/lib/*:/opt/app/hadoop-2.8.5/share/hadoop/common/*:/opt/app/hadoop-2.8.5/share/hadoop/hdfs:/opt/app/hadoop-2.8.5/share/hadoop/hdfs/lib/*:/opt/app/hadoop-2.8.5/share/hadoop/hdfs/*:/opt/app/hadoop-2.8.5/share/hadoop/yarn/lib/*:/opt/app/hadoop-2.8.5/share/hadoop/yarn/*:/opt/app/hadoop-2.8.5/share/hadoop/mapreduce/lib/*:/opt/app/hadoop-2.8.5/share/hadoop/mapreduce/*:/contrib/capacity-scheduler/*.jar:/contrib/capacity-scheduler/*.jar:/opt/app/hadoop-2.8.5/share/hadoop/yarn/*:/opt/app/hadoop-2.8.5/share/hadoop/yarn/lib/*:/opt/app/hadoop-2.8.5/etc/hadoop/nm-config/log4j.properties org.apache.hadoop.yarn.server.nodemanager.NodeManager
root       8795   8754  0 02:50 pts/1    00:00:00 grep java
```