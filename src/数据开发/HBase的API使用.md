## **HBase的API使用**

### DDL

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.NamespaceDescriptor;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Admin;
import org.apache.hadoop.hbase.client.ColumnFamilyDescriptor;
import org.apache.hadoop.hbase.client.ColumnFamilyDescriptorBuilder;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.apache.hadoop.hbase.client.TableDescriptor;
import org.apache.hadoop.hbase.client.TableDescriptorBuilder;
import org.apache.hadoop.hbase.regionserver.BloomType;
import org.junit.Before;
import org.junit.Test;

public class DDLDemo {
	
	Connection conn = null;
	
	@Before
	public void init() throws Exception {
		
		// Configuration conf = new Configuration();会自动加载classpath中的core-site.xml,core-default.xml,
		// hdfs-site.xml,hdfs-default.xml,yarn-site.xml,yarn-default.xml,mpred-site.xml,mpred-default.xml
		Configuration conf = HBaseConfiguration.create();// 除了hadoop的配置，还会加载hbase-site.xml
		
		// 客户端连接不需要指定具体的master或regionserver地址，只需要指定zookeeper地址就行
		conf.set("hbase.zookeeper.quorum", "linux01:2181,linux02:2181,linux03:2181");
		
		conn = ConnectionFactory.createConnection(conf);
		
	}
	
	// 创建名称空间
	@Test
	public void testCreateNameSpace() throws Exception {
		
		// 获取表定义管理器
		Admin admin = conn.getAdmin();
		
		NamespaceDescriptor myspace = NamespaceDescriptor.create("myspace").build();
		admin.createNamespace(myspace);
		
		admin.close();
		conn.close();
	}
	
	// 创建表
	@Test
	public void testCreateTable() throws Exception {
		
		Admin admin = conn.getAdmin();
		
		// 构建一个表定义描述对象构建器
//		TableDescriptorBuilder tbBuilder = TableDescriptorBuilder.newBuilder(TableName.valueOf("myspace", "t1"));
		TableDescriptorBuilder tbBuilder = TableDescriptorBuilder.newBuilder(TableName.valueOf("myspace", "t1"));
		
		// 构建一个列族描述对象构造器
		ColumnFamilyDescriptorBuilder cfBuilder = ColumnFamilyDescriptorBuilder.newBuilder("f1".getBytes());
		// 为列族定义设置参数
		cfBuilder.setBloomFilterType(BloomType.ROWCOL);
		cfBuilder.setTimeToLive(6000);
		cfBuilder.setMaxVersions(3);
		// 获取列族描述对象
		ColumnFamilyDescriptor f1 = cfBuilder.build();
		
		// 用表构建器设置列族，并构建表描述对象
		TableDescriptor t1 = tbBuilder.setColumnFamily(f1).build();
		
		// 用表定义管理器创建表
		admin.createTable(t1);
		
		admin.close();
		conn.close();
	}
	
	// 创建预分区表
	@Test
	public void testCreateTableSplit() throws Exception {
		
		Admin admin = conn.getAdmin();
		
		TableDescriptorBuilder tbBuilder = TableDescriptorBuilder.newBuilder(TableName.valueOf("myspace:t1"));
		
		ColumnFamilyDescriptor f1 = ColumnFamilyDescriptorBuilder.newBuilder("f1".getBytes()).build();
		
		TableDescriptor t1 = tbBuilder.setColumnFamily(f1).build();
		
		byte[][] splitKeys = {"r005".getBytes(), "r008".getBytes()};
		
		// 指定预分区的分界点
		admin.createTable(t1, splitKeys);
		
		admin.close();
		conn.close();
	}
	
	// 修改表定义
	@Test
	public void modifyTableDescription() throws Exception {
		
		Admin admin = conn.getAdmin();		
		
		// 1. 修改之前的列族定义
		// 获得表定义
		TableDescriptor t1 = admin.getDescriptor(TableName.valueOf("myspace:t1"));
		// 从表定义中取出列族f1的定义
		ColumnFamilyDescriptor f1 = t1.getColumnFamily("f1".getBytes());
		// 用列族定义构建起对原来的列族f1定义进行修改
		f1 = ColumnFamilyDescriptorBuilder.newBuilder(f1).setTimeToLive(Integer.MAX_VALUE).build();
		
		// 修改指定表的列族定义
		admin.modifyColumnFamily(TableName.valueOf("myspace:t1"), f1);
		
		// 2. 增加一个新的列族
		// 构建一个新的列族定义
		ColumnFamilyDescriptor f2 = ColumnFamilyDescriptorBuilder.newBuilder("f2".getBytes()).build();
		// 表定义修改过，再取一次
		t1 = admin.getDescriptor(TableName.valueOf("myspace:t1"));
		// 对原来的表定义设置新的列族
		TableDescriptorBuilder tbBuilder = TableDescriptorBuilder.newBuilder(t1);
		tbBuilder.setColumnFamily(f2);
		t1 = tbBuilder.build();
		
		// 通过客户端发送定义修改命令
		admin.modifyTable(t1);
		
		admin.close();
		conn.close();
	}
	
	// 删除列族/表/名称空间
	@Test
	public void delete() throws Exception {
		
		Admin admin = conn.getAdmin();
		
//		// 删除列族
//		admin.deleteColumnFamily(TableName.valueOf("myspace:t1"), "f1".getBytes());
//		
//		// 禁用一个表
//		admin.disableTable(TableName.valueOf("myspace:t1"));
//		
//		// 删除表
//		admin.deleteTable(TableName.valueOf("myspace:t1"));
		
		// 删除名称空间，必须先把其中的表全部删掉
		admin.deleteNamespace("myspace");
		admin.close();
		conn.close();
	}
	
	// 列出所有名称空间/表
	@Test
	public void testList() throws Exception {
		
		Admin admin = conn.getAdmin();
		
		// 列出名称空间
		NamespaceDescriptor[] namespaceDescriptors = admin.listNamespaceDescriptors();
		for (NamespaceDescriptor namespaceDescriptor : namespaceDescriptors) {
			System.out.println(namespaceDescriptor.getName());
		}
		
		// 列出表
		TableName[] tableNames = admin.listTableNames();
		for (TableName tableName : tableNames) {
			System.out.println(tableName.getNameAsString());
		}
		
		admin.close();
		conn.close();
	}
}
```



### DML

```java
import java.util.ArrayList;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Admin;
import org.apache.hadoop.hbase.client.BufferedMutator;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.apache.hadoop.hbase.client.Delete;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Table;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.Before;
import org.junit.Test;

public class DMLDemo {
	
	Connection conn = null;
	
	@Before
	public void init() throws Exception {
		
		Configuration conf = HBaseConfiguration.create();
		conf.set("hbase.zookeeper.quorum", "linux01:2181,linux02:2181,linux03:2181");
		conn = ConnectionFactory.createConnection(conf);
		
	}
	
	// 插入数据
	@Test
	public void testPut() throws Exception {
		
		// 用conn获取表数据操作对象
		Table t1 = conn.getTable(TableName.valueOf("t1"));
		
		// 构造数据封装对象
		Put r001 = new Put("r001".getBytes());
		r001.addColumn("f1".getBytes(), "name".getBytes(), "Aang".getBytes());
		r001.addColumn("f1".getBytes(), "age".getBytes(), Bytes.toBytes(12));
		
		Put r002 = new Put("r002".getBytes());
		r002.addColumn("f1".getBytes(), "name".getBytes(), "Katara".getBytes());
		r002.addColumn("f1".getBytes(), "age".getBytes(), Bytes.toBytes(14));
		
//		t1.put(r001);
		
		ArrayList<Put> puts = new ArrayList<Put>();
		puts.add(r001);
		puts.add(r002);
		
		t1.put(puts);
		
		t1.close();
		conn.close();
	}
	
	/**
	 * 	比较mutator和table.put
	 * 	1. mutator是一个异步操作，客户端先把数据写入本地的缓存，即返回，客户端不需要同步等待数据插入完成，而put是需要同步等待的
	 * 	2. mutator把数据写入本地缓存后，攒满一批再提交到hbase写入，可以提高数据插入的效率
	 * 	put(List<Put>)相当于自己用list将数据缓存起来，然后用put方法同步提交
	 * 	对于静态批量数据（比如hdfs中已经存在的一堆文件）快速导入hbase，还有更高效的方法：Bulkloader
	 * 	原理：不需要通过网络RPC请求来提交数据，而是直接将原始文件转换成hbase的底层文件HFILE，然后直接上传到hbase的表目录中
	 */
	@Test
	public void testPut2() throws Exception {
		
		// put方法是一个同步操作，客户端如果有大量数据需要集中密集写入hbase表，客户端程序需要等待put全部完成
		// 而BufferedMutator则允许客户端设置一个缓冲区，提交的数据先放在缓冲区，后面会异步提交到hbase集群
		BufferedMutator bufferedMutator = conn.getBufferedMutator(TableName.valueOf("t1".getBytes()));
		
		long start = System.currentTimeMillis();
		for(int i = 0; i < 10000; i++) {
			Put r = new Put(("r01" + i).getBytes());
			r.addColumn("f1".getBytes(), "q1".getBytes(), Bytes.toBytes(i));
			
			// 写入客户端的缓存，后续会按周期提交到hbase集群
			bufferedMutator.mutate(r);
		}
		long end = System.currentTimeMillis();
		System.out.println(end - start);// 889
		
		bufferedMutator.close();
		
		
		Table t1 = conn.getTable(TableName.valueOf("t1".getBytes()));
		
		start = System.currentTimeMillis();
		for(int i = 0; i < 10000; i++) {
			Put r = new Put(("r02" + i).getBytes());
			r.addColumn("f1".getBytes(), "q1".getBytes(), Bytes.toBytes(i));
			t1.put(r);
		}
		end = System.currentTimeMillis();
		System.out.println(end - start);// 17499
		
		t1.close();
		conn.close();
	}
	
	// 删除表中的整行/某行的整列族/某行的某个列
	@Test
	public void testDeleteData() throws Exception {
		
		Table t1 = conn.getTable(TableName.valueOf("t1"));
		
		// delete参数对象中，如果只指定行键，则会删除整行的所有key-values
		Delete delete1 = new Delete("r001".getBytes());
		t1.delete(delete1);
		
		// delete参数对象中，指定了行键+列族，则会删除该行的指定列族中的key-values
		Delete delete2 = new Delete("r002".getBytes());
		delete2.addFamily("f1".getBytes());
		t1.delete(delete2);
		
		// delete参数对象中，指定了行键+列族+列名，则会删除该列
		Delete delete3 = new Delete("r003".getBytes());
		delete3.addColumn("f1".getBytes(), "q1".getBytes());
		t1.delete(delete3);
		
		t1.close();
		conn.close();
	}
	
	// 清空整个表的数据，会保留表定义，还可以保留表的region划分
	@Test
	public void testTruncate() throws Exception {
		
		Admin admin = conn.getAdmin();
		
		admin.disableTable(TableName.valueOf("t1".getBytes()));
		
		admin.truncateTable(TableName.valueOf("t1".getBytes()), true);
		
		admin.close();
		conn.close();
	}
}
```



```java
import java.util.ArrayList;
import java.util.Iterator;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.apache.hadoop.hbase.client.Get;
import org.apache.hadoop.hbase.client.Result;
import org.apache.hadoop.hbase.client.ResultScanner;
import org.apache.hadoop.hbase.client.Scan;
import org.apache.hadoop.hbase.client.Table;
import org.junit.Before;
import org.junit.Test;

public class QueryDemo {
	
	Connection conn = null;
	
	@Before
	public void init() throws Exception {
		
		Configuration conf = HBaseConfiguration.create();
		conf.set("hbase.zookeeper.quorum", "linux01:2181,linux02:2181,linux03:2181");
		conn = ConnectionFactory.createConnection(conf);
				
	}
	
	// get
	@Test
	public void testGet() throws Exception {
		
		Table t1 = conn.getTable(TableName.valueOf("t1"));
		
		
		Get get = new Get("r001".getBytes());
		
		// 过滤要返回的数据，满足条件的才返回
		get.setFilter(null);
		
		// Result是对一行中kv数据的封装
		Result result = t1.get(get);
		
		// 清楚数据schema的情况下，直接取某个key的value
//		byte[] value = result.getValue("f1".getBytes(), "name".getBytes());
//		System.out.println(new String(value));
		
		// 不清楚数据schema或每行的schema不一致的情况下，从result中遍历出每一个key-value
		while(result.advance()) {
			Cell cell = result.current();
			printCellUtil(cell);
		}
        
		t1.close();
		conn.close();
	}
	
	// 一次RPC请求，get多行数据
	@Test
	public void testGetSome() throws Exception {
		
		Table t1 = conn.getTable(TableName.valueOf("t1"));
		
		Get get1 = new Get("r001".getBytes());
		Get get2 = new Get("r002".getBytes());
		Get get3 = new Get("r003".getBytes());
		
		ArrayList<Get> gets = new ArrayList<Get>();
		gets.add(get1);
		gets.add(get2);
		gets.add(get3);
		
		Result[] results = t1.get(gets);
		for (Result result : results) {
			while(result.advance()) {
				Cell cell = result.current();
				printCellUtil(cell);
			}
		}
        
        t1.close();
        conn.close();
	}
	
	// scan
	@Test
	public void testScan() throws Exception {
		
		Table t1 = conn.getTable(TableName.valueOf("t1"));
		
		Scan scan = new Scan();
		
		// 指定扫描起始行键，默认包含
		scan.withStartRow("r001".getBytes());
		
		// 指定扫描结束行键，默认不包含
		scan.withStopRow("r003".getBytes(), true);
		
		// 指定返回数据只包含某列族的kv
		scan.addFamily("f1".getBytes());
		
		// 设置返回结果的数据过滤器，相当于实现条件查询
		scan.setFilter(null);
		
		// 设置在本scan中，一个Result中最多包含的kv个数，用于一行数据中kv量太大的情况
		scan.setBatch(2);
		
		// 是否让regionserver侧缓存本次扫描到的数据到内存中
		scan.setCacheBlocks(false);
		
		// 指定本次scan最多返回的result个数
		scan.setLimit(10);
        
        // 每次rpc请求记录数，默认1
        scan.setCaching(100);
		
		// 指定本次scan按反方向进行，从stoprowkey -> startrowkey
		scan.setReversed(false);
		
		// 从另一个维度：字节大小，来限制一个result的大小
		scan.setMaxResultSize(10240);
		
		// 指定本次scan是否要包含raw数据（已经被删除的，或过时的版本数据）
		scan.setRaw(false);
		
		ResultScanner rsScanner = t1.getScanner(scan);
		
		Iterator<Result> iter = rsScanner.iterator();
		// 迭代每一个result
		while(iter.hasNext()) {
			
			Result rs = iter.next();
			
			// 清楚数据schema的情况下，直接取某个key的value
//			rs.getValue("f1".getBytes(), "name".getBytes());
			
			// 不清楚数据schema或每行的schema不一致的情况下，从result中遍历出每一个key-value
			while(rs.advance()) {
				Cell cell = rs.current();
				printCellUtil(cell);
			}
		}
		
        rsScanner.close();
        t1.close();
        conn.close();
	}
	
	// cell数据遍历的工具写法
	public static void printCellUtil(Cell cell) {
		
		byte[] cloneRow = CellUtil.cloneRow(cell);
		byte[] cloneFamily = CellUtil.cloneFamily(cell);
		byte[] cloneQualifier = CellUtil.cloneQualifier(cell);
		byte[] cloneValue = CellUtil.cloneValue(cell);
		
		String r = new String(cloneRow);
		String f = new String(cloneFamily);
		String q = new String(cloneQualifier);
		String v = new String(cloneValue);
		
		System.out.println(r + " -> " + f + " -> " + q + " -> " + v);
	}
	
	// cell数据遍历的底层写法
	public static void printCell(Cell cell) {
		
		byte[] rowArray = cell.getRowArray();
		int rowOffset = cell.getRowOffset();
		short rowLength = cell.getRowLength();
		
		byte[] familyArray = cell.getFamilyArray();
		int familyOffset = cell.getFamilyOffset();
		byte familyLength = cell.getFamilyLength();
		
		byte[] qualifierArray = cell.getQualifierArray();
		int qualifierOffset = cell.getQualifierOffset();
		int qualifierLength = cell.getQualifierLength();
		
		byte[] valueArray = cell.getValueArray();
		int valueOffset = cell.getValueOffset();
		int valueLength = cell.getValueLength();
		
		String r = new String(rowArray, rowOffset, rowLength);
		String f = new String(familyArray, familyOffset, familyLength);
		String q = new String(qualifierArray, qualifierOffset, qualifierLength);
		String v = new String(valueArray, valueOffset, valueLength);
		
		System.out.println(r + " -> " + f + " -> " + q + " -> " + v);
	}
}
```

