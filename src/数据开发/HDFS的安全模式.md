## **HDFS的安全模式**

- 安全模式是HDFS的一种特殊工作状态，安全模式下只接收读数据请求，不接受修改、删除等变更请求

- NameNode启动时，首先将fsimage载入内存，并执行编辑日志中的操作，合并完成后会创建新的镜像文件和一个空的日志文件，新的日志文件用于记录后续的操作

- 在安全模式下，各个DataNode会向NameNode发送自身的block信息，NameNode对每个文件对应的block副本数进行统计，当一定比例的block都达到最小副本数并保持一定时间后，便会在30秒后退出安全模式，否则NameNode会对副本数不足的数据块进行复制，直到达到安全标志

- 系统离开安全模式的条件

  1. 可用的block占总数的比例
  2. 可用的数据节点数量符合要求

- 相关配置(hdfs-site.xml)

  - dfs.namenode.replication.min

    > Default value = 1
    >
    > Minimal block replication. [1]

  - dfs.namenode.safemode.threshold-pct

    > Default value = 0.999f
    >
    > Specifies the percentage of blocks that should satisfy the minimal replication requirement defined by dfs.namenode.replication.min.
    >
    > Values less than or equal to 0 mean not to wait for any particular percentage of blocks before exiting safemode.
    >
    > Values greater than 1 will make safe mode permanent. [0.999f]

  - dfs.namenode.safemode.min.datanodes

    > Default value = 0
    >
    > Specifies the number of datanodes that must be considered alive before the name node exits safemode.
    >
    > Values less than or equal to 0 mean not to take the number of live datanodes into account when deciding whether to remain in safe mode during startup.
    >
    > Values greater than the number of datanodes in the cluster will make safe mode permanent.

  - dfs.namenode.safemode.extension

    > Default value = 30000
    >
    > Determines extension of safe mode in milliseconds after the threshold level is reached.

- 相关命令

  > hadoop dfsadmi -safemode <command>
  >
  > - get     查看当前状态
  > - enter     进入安全模式
  > - leave     强制离开安全模式
  > - wait     等待直到安全模式结束