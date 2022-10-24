## **Zookeeper的数据模型和监听机制**

### 数据模型

- 数据模型是key-value形式，key采用路径的形式，节点之间存在层级关系，value是任意数据，不过必须序列化为byte数组才能存入
- 数据节点znode分类：
  - 持久节点：一旦创建就会被Zookeeper一直保存，除非主动删除
  - 临时节点：创建之后如果与Zookeeper断开连接，就会被Zookeeper删除
  - 序号节点：创建节点后，Zookeeper会在key后自动拼接一个递增序号

### 监听机制

- 节点事件类型包括节点创建、删除、数据变更、直接子节点创建、连接状态变更(如到期， 认证失败， 断开连接)
- 一个Watcher实例是一次性的，当被设置了监听的节点变化时， 服务器将这个变化通知客户端
- 一个Watcher实例多次注册，只会通知一次，多个不同Watcher实例注册，会依次通知

#### 注册方法和监听事件的关系

| 注册方式       | NodeCreated | NodeChildrenChanged | NodeDataChanged | NodeDeleted |
| -------------- | ----------- | ------------------- | --------------- | ----------- |
| zk.getChildren |             | 可监控              |                 | 可监控      |
| zk.exists      | 可监控      |                     | 可监控          | 可监控      |
| zk.getData     |             |                     | 可监控          | 可监控      |

- zk.getData不能监听NodeCreated事件， 节点不存在时， getData这样设置的监听会抛出异常， 注册失败