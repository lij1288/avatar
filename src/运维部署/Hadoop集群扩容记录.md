## Hadoop集群扩容记录

### 挂载磁盘

### 修改主机名

### 配置hosts

### 配置免密登录

### 安装jdk

### 复制hadoop到新节点

### 配置环境变量

### 启动新节点datanode和nodemanager

### 验证集群状态

- hdfs dfsadmin -report
- yarn node -list

### 进行数据均衡

- 在非namenode节点运行start-balancer.sh，监控logs
- 根据情况调整balancer参数
  - 数据均衡最大带宽：hdfs dfsadmin -setBalancerBandwidth 104857600