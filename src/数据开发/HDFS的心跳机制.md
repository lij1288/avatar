## **HDFS的心跳机制**

- DataNode以固定周期 (3s) 向NameNode发送心跳，NameNode如果在一段时间内没有收到心跳，会把该节点判定为死亡

- 超时时长的计算公式为: 

  > timeout = 2 * heartbeat.recheck.interval + 10 * dfs.heartbeat.interval

  默认heartbeat.recheck.interval 为5分钟，dfs.heartbeat.interval 为3秒

  HDFS默认的超时时长为10分钟+30秒 (3*10+5+5)

- hdfs-default.xml

  默认配置文件并不在hadoop的etc目录下，而是在hadoop-hdfs-2.8.5.jar

  可通过hadoop/etc/hdfs-site.xml修改

  配置文件中heartbeat.recheck-interval的单位为毫秒，dfs.heartbeat.interval的单位为秒
  
  ```xml
  <property>
    <name>dfs.namenode.heartbeat.recheck-interval</name>
    <value>300000</value>
    <description>
      This time decides the interval to check for expired datanodes.
      With this value and dfs.heartbeat.interval, the interval of
      deciding the datanode is stale or not is also calculated.
      The unit of this configuration is millisecond.
    </description>
  </property>
  <property>
    <name>dfs.heartbeat.interval</name>
    <value>3</value>
    <description>Determines datanode heartbeat interval in seconds.</description>
  </property>
  ```
  
  
