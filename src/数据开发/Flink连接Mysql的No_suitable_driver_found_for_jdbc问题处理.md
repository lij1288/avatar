## **Flink连接Mysql的No suitable driver found for jdbc问题处理**

### 问题记录

- Flink连接Mysql5.7，有时会报错No suitable driver found for jdbc，重启Flink，重新提交作业后恢复正常。

### 解决过程

- 将Flink的lib目录下的mysql-connector-java-5.1.39.jar替换为mysql-connector-java-6.0.2-bin.jar。