## **DataNode的上线/下线操作**

### 节点上线操作

1. 关闭新增节点的防火墙
2. 在NameNode节点的hosts文件中添加新增节点的hostname
3. 在每个新增节点的hosts文件中添加NameNode的hostname
4. 在NameNode节点上进行新增节点的ssh免密登录操作
5. 在NameNode节点上的dfs.hosts文件中添加新增节点的hostname
6. 在其他节点上进行刷新操作，hdfs dfsadmin -refreshNodes
7. 在NameNode节点的slaves文件中添加新增节点的hostname
8. 启动DataNode节点
9. 查看NameNode的监控页面是否有新增节点

### 节点下线操作

1. 在dfs.hosts.exclude文件中添加需下线节点的hostname，阻止下线机器连接NameNode
2. 进行刷新操作，hadoop dfsadmin -refreshNodes，进行block块的移动
3. 关闭需下线机器
4. 将节点hostname从dfs.hosts.exclude文件中移除