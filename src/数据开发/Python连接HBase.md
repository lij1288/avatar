## Python连接HBase

- 在远程集群的master节点安装并启动Thrift服务

- 本地安装thrift和hbase-thrift

- 在venv\Lib\site-packages\hbase中替换文件

  1. Hbase.py（https://github.com/SparksFly8/Tools/blob/master/Hbase.py）

  2. ttypes.py（https://github.com/SparksFly8/Tools/blob/master/ttypes.py）

- 连接HBase

```python
from thrift.transport import TSocket, TTransport
from thrift.protocol import TBinaryProtocol
from hbase import Hbase

socket = TSocket.TSocket('10.0.43.31', 9090)
socket.setTimeout(5000)

transport = TTransport.TBufferedTransport(socket)
protocol = TBinaryProtocol.TBinaryProtocol(transport)

client = Hbase.Client(protocol)
socket.open()

# 获取所有表名
print(client.getTableNames())
```

