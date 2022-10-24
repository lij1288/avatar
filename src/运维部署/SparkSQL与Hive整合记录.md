## **SparkSQL与Hive整合记录**

1. 将hive-site.xml放入spark安装目录的conf中

2. 将core-site.xml放入spark安装目录的conf中（可加载hadoop的，需要把hadoop安装目录配到系统环境变量中）

3. 将驱动jar包放入spark/jars

   > cp mysql-connector-java-5.1.39.jar /opt/app/spark-2.3.3-bin-hadoop2.7/jars/

4. 启动sparksql的thrift服务进程

   > sbin/start-thriftserver.sh

5. 使用支持jdbc:hive2的客户端（如beeline）连接

   > bin/beeline -u jdbc:hive2://localhost:10000 -n root