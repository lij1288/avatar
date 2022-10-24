## **Sqoop安装记录**

### 上传解压安装包

> tar -zxvf sqoop-1.4.7.bin__hadoop-2.6.0

### 修改配置文件

> cd conf
>
> cp sqoop-env-template.sh sqoop-env.sh
>
> vi sqoop-env.sh

```shell
# Set Hadoop-specific environment variables here.

#Set path to where bin/hadoop is available
export HADOOP_COMMON_HOME=/usr/apps/hadoop-2.8.5

#Set path to where hadoop-*-core.jar is available
export HADOOP_MAPRED_HOME=/usr/apps/hadoop-2.8.5/share/hadoop/mapreduce

#set the path to where bin/hbase is available
#export HBASE_HOME=

#Set the path to where bin/hive is available
export HIVE_HOME=/usr/apps/hive-2.3.5

#Set the path for where zookeper config dir is
#export ZOOCFGDIR=
```

### 复制mysql驱动包

> cp mysql-connector-java-5.1.40-bin.jar sqoop-1.4.6/lib/

### 配置环境变量

### 验证安装结果

> sqoop version