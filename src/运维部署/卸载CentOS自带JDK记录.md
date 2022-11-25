## **卸载CentOS自带JDK记录**

```
[root@192.168.1.101 utils]# rpm -qa|grep jdk
java-1.7.0-openjdk-headless-1.7.0.261-2.6.22.2.el7_8.x86_64
copy-jdk-configs-3.3-10.el7_5.noarch
java-1.8.0-openjdk-headless-1.8.0.262.b10-1.el7.x86_64
java-1.8.0-openjdk-1.8.0.262.b10-1.el7.x86_64
java-1.7.0-openjdk-1.7.0.261-2.6.22.2.el7_8.x86_64
[root@192.168.1.101 utils]# yum remove java-1.7.0-openjdk*
...
[root@192.168.1.101 utils]# yum remove java-1.8.0-openjdk*
...
```

