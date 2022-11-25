## **JDK安装配置记录**

### 解压安装包

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