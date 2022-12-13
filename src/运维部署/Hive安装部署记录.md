## **Hive安装部署记录**

### Mysql设置

- 使用Mysql客户端登录

- 设置远程登陆权限（给root用户授予从任何机器上登陆mysql服务器的权限）


> mysql > grant all privileges on \*.* to 'root'@'%' identified by '\*\*\*\*\*\*\*\*' with grant option;
>
> mysql > flush privileges;

### 上传安装包并解压

> tar -zxvf apache-hive-2.3.5-bin.tar.gz

### 修改配置文件

#### 配置运行环境 (可不配)
- cp hive-env.sh.template hive-env.sh
- vi hive-env.sh

> \# Set HADOOP_HOME to point to a specific hadoop install directory
>
> HADOOP_HOME=/opt/app/hadoop-2.8.5/
>
> \# Hive Configuration Directory can be controlled by:
>
> export HIVE_CONF_DIR=/opt/app/apache-hive-2.3.5-bin/conf/

#### 修改配置文件

> vi conf/hive-site.xml

```xml
<configuration>
<!-- 在mysql中创建名字为hive的数据库 -->
<property>
<name>javax.jdo.option.ConnectionURL</name>
<value>jdbc:mysql://192.168.1.101:3306/hive?createDatabaseIfNotExist=true&amp;useSSL=false</value>
</property>
<property>
<name>javax.jdo.option.ConnectionDriverName</name>
<value>com.mysql.jdbc.Driver</value>
</property>
<property>
<name>javax.jdo.option.ConnectionUserName</name>
<value>root</value>
</property>
<property>
<name>javax.jdo.option.ConnectionPassword</name>
<value>********</value>
</property>
</configuration>
```

#### 添加hadoop配置

> vi $HADOOP_HOME/etc/hadoop/core-site.xml

```xml
<property>
<name>hadoop.proxyuser.root.hosts</name>
<value>*</value>
</property>
<property>
<name>hadoop.proxyuser.root.groups</name>
<value>*</value>
</property>
```

### 拷贝mysql的jdbc驱动jar包

-  拷贝一个mysql的jdbc驱动jar包mysql-connector-java到hive的lib目录中

### 初始化Hive的元数据库

> bin/schematool -initSchema -dbType mysql

### 启动Hive

> bin/hive

### HiveJDBC访问

- 启动hiveserver2服务

> bin/hiveserver2

- 启动beeline

> bin/beeline

- 连hiveserver2

> beeline> !connect jdbc:hive2://192.168.1.101:10000
>
> Connecting to jdbc:hive2://192.168.1.101:10000
>
> Enter username for jdbc:hive2://192.168.1.101:10000: root
>
> Enter password for jdbc:hive2://192.168.1.101:10000:

- 启动beeline并连接hiveserver2

> bin/beeline -u jdbc:hive2://192.168.1.101:10000 -n root