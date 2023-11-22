## **HBase安装部署记录**

### HDFS+Zookeeper

### 上传安装包并解压

> tar -zxvf hbase-2.0.4-bin.tar.gz -C /opt/app/

### 修改配置文件

- hbase-env.sh

```shell
export JAVA_HOME=/opt/app/jdk1.8.0_202

#是否启动hbase内部集成的zk,端口冲突
export HBASE_MANAGES_ZK=false
```

- hbase-site.xml

```xml
<configuration>
<!-- 指定hbase在HDFS上存储的路径 -->
<property>
<name>hbase.rootdir</name>
<value>hdfs://linux01:9000/hbase</value>
</property>
<!-- 指定hbase是分布式的 -->
<property>
<name>hbase.cluster.distributed</name>
<value>true</value>
</property>
<!-- 指定zk的地址，多个用“,”分割 -->
<property>
<name>hbase.zookeeper.quorum</name>
<value>linux01:2181,linux02:2181,linux03:2181</value>
</property>
    
<property>
<name>hbase.unsafe.stream.capability.enforce</name>
<value>false</value>
</property>
</configuration>
```

- regionservers（启动脚本需要此配置文件, master则是通过zk感知regionserver）

```
linux01
linux02
linux03
```

### 发送到其他节点

> scp -r hbase-2.0.4 linux02:$PWD
>
> scp -r hbase-2.0.4 linux03:$PWD

### 启动服务

> bin/hbase-daemon.sh start master
>
> bin/hbase-daemon.sh stop master
>
> bin/hbase-daemon.sh start regionserver
>
> bin/hbase-daemon.sh stop regionserver

> bin/start-hbase.sh
>
> bin/stop-hbase.sh

### Web页面

> linux01:16010