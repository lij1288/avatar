## **Zookeeper的API使用**

### 连接测试

```java
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.data.Stat;

public class ZKEnvTest {
    public static void main(String[] args) throws Exception {
    	
    	// 参数1：连接的地址，参数2：会话超时时间，参数3：事件处理器
        ZooKeeper zk = new ZooKeeper("linux01:2181,linux02:2181,linux03:2181", 2000, null);
        Stat stat = zk.exists("/demo", false);

        if(stat == null){
            System.out.println("/demo 不存在");
        }else{
            System.out.println("/demo 存在");
        }
        zk.close();
    }
}
```

### 数据操作

```java
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.util.List;

import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.ZooDefs;
import org.apache.zookeeper.ZooKeeper;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class DataOperate {
	
	ZooKeeper zk = null;
	
	@Before
	public void init() throws Exception {
		zk = new ZooKeeper("linux01:2181,linux02:2181,linux03:2181", 2000, null);
	}
	
	// 创建znode
	@Test
	public void testCreate() throws Exception {
		
		// ByteArrayOutputStream数据不在文件里，而是在内存里
		ByteArrayOutputStream bout = new ByteArrayOutputStream();
		DataOutputStream dout = new DataOutputStream(bout);
		dout.writeInt(3545);
		
		byte[] data = bout.toByteArray();
		
		// zk.create(path, data, acl, createMode)
		// 参数1：路径 参数2：值 参数3：权限 参数4：创建模式 返回值：路径（+序号）
		String s = zk.create("/demo", data, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
		
		System.out.println(s);
	}
	
	// 获取znode的value数据
	@Test
	public void getData() throws Exception {
		
		// zk.getData(path, watch, stat)
		// 参数1：路径 参数2：是否注册监听 参数3：元数据（指定版本）
		byte[] data = zk.getData("/demo", false, null);
		
		ByteArrayInputStream bin = new ByteArrayInputStream(data);
		DataInputStream din = new DataInputStream(bin);
		
		int value = din.readInt();
		System.out.println(value);
	}
	
	// 获取指定路径下的子节点
	@Test
	public void getChildren() throws Exception {
		
		// zk.getChildren(path, watch)
		// 参数1：路径 参数2：是否注册监听
		List<String> lst = zk.getChildren("/", null);
		System.out.println(lst);
		
	}
	
	// 修改一个节点的value值
	@Test
	public void setData() throws Exception {
		
		// zk.setData(path, data, version)
		// 参数1：路径 参数2：值 参数3：版本（-1:更改所有版本）
		zk.setData("/demo", "字符串".getBytes(), -1);
		
		byte[] data = zk.getData("/demo", false, null);
		String s = new String(data);
		System.out.println(s);
	}
	
	// 删除一个znode
	@Test
	public void deleteNode() throws Exception {
		
		// zk.delete(path, version);
		// 参数1：路径 参数2：版本（-1:删除所有版本）
		zk.delete("/demo", -1);
        
        // Directory not empty for /demo若有子节点无法删除，rmr可以删除
	}
	
	@After
	public void close() throws Exception {
		zk.close();
	}

}
```

#### 递归删除有子节点的节点

```java
import java.util.List;

import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.data.Stat;

public class RecursiveDelete {
	
	public static void main(String[] args) throws Exception {
		recursiveDelete("/demo");
	}
	
	public static void recursiveDelete(String path) throws Exception	{
		
		ZooKeeper zk = new ZooKeeper("linux01:2181,linux02:2181,linux03:2181", 2000, null);
		
		List<String> children = zk.getChildren(path, false);
		for (String string : children) {
			Stat stat = zk.exists(path + "/" + string, null);
			if(stat != null) {
				recursiveDelete(path + "/" + string);
			}
		}
		
		zk.delete(path, -1);
		
		zk.close();
		
	}
}
```

### 注册监听

```java
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;
import org.junit.Before;
import org.junit.Test;

public class WatchDemo {
	
	ZooKeeper zk = null;
	
	@Before
	public void init() throws Exception {
		
		zk = new ZooKeeper("linux01:2181,linux02:2181,linux03:2181", 2000, new Watcher() {
			
			@Override
			public void process(WatchedEvent event) {// 连接一旦成功，方法会被调用一次
				System.out.println(event.getPath());// 事件发生的节点路径
				System.out.println(event.getState());// 事件发生时，客户端的连接状态
				System.out.println(event.getType());// 事件的类型
			}
		});
	}
	
	
	// 方式1：在注册监听时，传入boolean参数，事件的回调逻辑使用构造zk客户端时传入的回调逻辑
	// 监听节点的value变化事件
	@Test
	public void testWatchDataChanged() throws Exception {
		
		byte[] data = zk.getData("/demo", true, null);
		// zk对象是一个多线程的工作逻辑，对事件的监听是开启了一个另外的线程在工作
		
		Thread.sleep(Long.MAX_VALUE);
	}
	
	// 方式2：在注册监听时，传入Watcher对象，事件的回调逻辑使用此传入的Watcher
	@Test
	public void testWatchDataChanged2() throws Exception {
		
		byte[] data = zk.getData("/demo", new Watcher() {
			
			@Override
			public void process(WatchedEvent event) {
				
				System.out.println("处理事件");
			}
		}, null);
		
		Thread.sleep(Long.MAX_VALUE);
	}
	
	// 监听节点的子节点增减事件
	@Test
	public void TestWatchChildrenChanged() throws Exception {
		
		zk.getChildren("/demo", true);
		Thread.sleep(Long.MAX_VALUE);
	}
	
	// 监听节点被创建或被删除事件
	@Test
	public void testWatchStat() throws Exception {
		
		zk.exists("/demo", true);
		Thread.sleep(Long.MAX_VALUE);
	}
	
}
```

#### 持续监听

```java
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;
import org.junit.Before;
import org.junit.Test;

public class ContinueWatch {
	
	ZooKeeper zk = null;
	
	@Before
	public void init() throws Exception {
		zk = new ZooKeeper("linux01:2181,linux02:2181,linux03:2181", 2000, new Watcher() {
			@Override
			public void process(WatchedEvent event) {
				if(event.getType() == Event.EventType.NodeDataChanged) {
					try {
						// 处理事件
						System.out.println(event.getPath() + "-->" +event.getType());
						// 重新注册监听
						zk.getData("/demo", true, null);
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		});
	}
	
	@Test
	public void continueWatch() throws Exception {
		zk.getData("/demo", true, null);
		Thread.sleep(Long.MAX_VALUE);
	}
}
```

```java
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;
import org.junit.Before;
import org.junit.Test;

public class ContinueWatch {
	
	ZooKeeper zk = null;
	
	@Before
	public void init() throws Exception {
		zk = new ZooKeeper("linux01:2181,linux02:2181,linux03:2181", 2000, null);
	}
	
	@Test
	public void continueWatch() throws Exception {
		zk.getData("/demo", new Watcher() {
			@Override
			public void process(WatchedEvent event) {
				
				try {
					System.out.println(event.getPath() + "-->" +event.getType());
					zk.getData("/demo", this, null);
				} catch (KeeperException | InterruptedException e) {
					e.printStackTrace();
				}
			}
		}, null);
		
		Thread.sleep(Long.MAX_VALUE);
	}
}
```


