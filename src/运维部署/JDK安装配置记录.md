## **JDK安装配置记录**

### 卸载自带JDK

> rpm -qa | grep jdk

```
java-1.7.0-openjdk-headless-1.7.0.261-2.6.22.2.el7_8.x86_64
copy-jdk-configs-3.3-10.el7_5.noarch
java-1.8.0-openjdk-headless-1.8.0.262.b10-1.el7.x86_64
java-1.8.0-openjdk-1.8.0.262.b10-1.el7.x86_64
java-1.7.0-openjdk-1.7.0.261-2.6.22.2.el7_8.x86_64
```

> yum remove java-1.7.0-openjdk*

> yum remove java-1.8.0-openjdk*

### 解压安装包

- [Java Archive Downloads - Java SE 8 (oracle.com)](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html)

> tar -zxvf jdk-8u202-linux-x64.tar.gz

### 环境变量配置

> vi /etc/profile

```shell
export JAVA_HOME=/opt/app/jdk1.8.0_202
export PATH=$PATH:$JAVA_HOME/bin
```

### 加载参数

> source /etc/profile

### 查看环境变量

> echo $PATH

> /usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin:/opt/app/jdk1.8.0_202/bin

### 测试安装结果

> java