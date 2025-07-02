# TiDB使用Dumpling和Lightning导出和恢复



## 导出文件

> dumpling -u [username] -p [password] -h [host] -P 6000 --filetype sql -t 32 -o /data/lij/data/ -r 200000 - F 256MiB -T database_name.table_name

## 恢复数据

- lightning1.toml

```toml
[lightning]
# 日志
level = "info"
file = "lightning1.log"

[mydumper]
# 源数据目录，即上一章节中 Dumpling 保存数据的路径。
data-source-dir = "/data/lij/data/" 

[tikv-importer]
# "local"：默认使用该模式，适用于 TB 级以上大数据量，但导入期间下游 TiDB 无法对外提供服务。
# "tidb"：TB 级以下数据量也可以采用`tidb`后端模式，下游 TiDB 可正常提供服务。
backend = "local"
# 设置排序的键值对的临时存放地址，目标路径必须是一个空目录，目录空间须大于待导入数据集的大小。
sorted-kv-dir = "/data/lij/sort1"

[tidb]
# 目标集群的信息
host = ${host}                # 例如：172.16.32.1
port = ${port}                # 例如：4000
user = "${username}"         # 例如："root"
password = "${password}"      # 例如："rootroot"
status-port = ${status-port}  # 导入过程 Lightning 需要在从 TiDB 的“状态端口”获取表结构信息，例如：10080
pd-addr = "${ip}:${port}"     # 集群 PD 的地址，Lightning 通过 PD 获取部分信息，例如 172.16.31.3:2379。当 backend = "local" 时 status-port 和 pd-addr 必须正确填写，否则导入将出现异常。
```

> nohup tiup tidb-lightning -config lightning72.toml > nohup72.out &