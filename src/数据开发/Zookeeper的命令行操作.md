## **Zookeeper的命令行操作**

### 基本操作

- 客户端启动链接

  > bin/zkCli.sh

- 查看某个路径下的key

  > ls /

- 创建一个znode

  > create /a 1

- 创建一个znode的子节点

  > create /a/b 2

- 查看一个key的value

  > get /a

  > 1
  > cZxid = 0x100000004
  > ctime = Tue Jan 12 07:49:41 CST 2021
  > mZxid = 0x100000004
  > mtime = Tue Jan 12 07:49:41 CST 2021
  > pZxid = 0x100000005
  > cversion = 1
  > dataVersion = 0
  > aclVersion = 0
  > ephemeralOwner = 0x0
  > dataLength = 1
  > numChildren = 1

| 字段           | 含义                                                 |
| -------------- | ---------------------------------------------------- |
| cZxid          | 创建节点时的事务id                                   |
| ctime          | 创建节点的时间                                       |
| mZxid          | 修改节点时的事务id, 与子节点无关                     |
| mtime          | 修改节点的时间                                       |
| pZxid          | 创建或删除子节点时的事务id, 与孙子节点无关           |
| cversion       | 创建或删除子节点时的版本号, 操作一次加1              |
| dataVersion    | 本节点的版本号, 更新数据时加1                        |
| aclVersion     | 权限版本号, 修改权限时加1                            |
| ephemeralOwner | 与临时节点绑定的sessionid, 如果不是临时节点, 此值为0 |
| dataLength     | 本节点的数据长度                                     |
| numChildren    | 本节点的子节点数, 与孙子节点无关                     |

- 修改一个key的value

  > set /a 2

- 删除一个znode

  > rmr /a

- 退出

  > quit

### 事件监听

- zookeeper中对znode的变化描述有3种事件类型

  - 节点value的变化事件
  - 节点的子节点变化事件
  - 节点被创建、被删除事件

- 对应的客户端向zk注册监听的命令

  > get /a watch
  >
  > ls /a watch
  >
  > stat /a watch

- 客户端向zk注册的事件监听，只会被通知一次，若需要持续监听，则需要反复注册