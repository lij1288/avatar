## HDFS写入机制

1. Client向NameNode请求写入一个文件，附带路径、副本数量、切块大小
2. NameNode检查路径合法性，响应可以写入
3. Client请求写入第一个Block块
4. NameNode响应blockid以及三台DataNode1、2、3
5. Client向DataNode1请求写入一个Block，附带blockid，还有DataNode2、3 DataNode1向DataNode2请求建立连接，附带blockid，还有DataNode3 DataNode2向DataNode3请求建立连接，附带blockid
6. DataNode3响应DataNode2 DataNode2响应DataNode1 DataNode1响应Client，pipeline构建完成
7. Client发送数据给DataNode1 DataNode1将数据写入同时发送给DataNode2 DataNode2将数据写入同时发送给DataNode3
8. 发送完毕，关闭pipeline
9. Client请求写入下一个Block
10. 过程中，NameNode记录元数据

## HDFS读取机制

1. Client向NameNode请求读取一个文件
2. NameNode响应文件的元数据，blockid、大小、存储位置
3. Client向最近的一台DataNode请求读取第一个Block
4. DataNode向Client发送数据
5. 第一个Block读取完后，若还需要继续读，Client向最近的一台DataNode请求读取下一个Block

## HDFS的checkpoint机制

- NameNode负责管理元数据，元数据存在内存中，但在磁盘上有元数据镜像文件FSimage和操作日志文件edits

  内存中的元数据和磁盘镜像文件有状态差，状态差体现在操作日志文件中

  SecondaryNameNode会定期将NameNode上的操作日志文件下载到本地，跟上一个状态的镜像文件合并，得到新的镜像文件并上传给NameNode，让NameNode的镜像文件和内存元数据状态差保持在一个比较小的范围

- 触发条件：时间间隔、操作事件次数、操作日志文件数目

  1分钟检查一次是否触发触发条件，两次checkpoint间的最大周期是1小时，最大操作记录是100万，最大操作日志保留数目是100万

1. 达到触发条件后，Secondary NameNode通知NameNode滚动操作日志
2. Secondary NameNode下载元数据镜像文件和操作日志
3. Secondary NameNode加载镜像文件，回放操作日志更新元数据对象，再序列化为新的镜像文件上传到NameNode