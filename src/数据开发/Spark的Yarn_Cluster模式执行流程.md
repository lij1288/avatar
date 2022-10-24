## **Spark的Yarn Cluster模式执行流程**

1. Client向ResourceManager申请资源，返回一个application ID和资源提交路径

2. Client上传spark jars下面的jar包、自己写的jar和配置到HDFS

3. ResourceManager随机找一个资源充足的NodeManager

4. 让NodeManager从HDFS下载jar包和配置，启动ApplicationMaster

5. ApplicationMaster向ResourceManager申请资源

6. ResourceManager找到符合条件的NodeManager，将NodeManager的信息返回给ApplicationMaster

7. ApplicationMaster分NodeManager通信

8. NodeManager从HDFS下载依赖

9. NodeManager启动Executor

10. Executor启动后反向向ApplicationMaster(Driver)注册

- Yarn-cluster和Yarn-client区别：Yarn-cluster的Driver在集群节点中随机选取启动，Yarn-client的Driver是做任务提交的客户端中启动