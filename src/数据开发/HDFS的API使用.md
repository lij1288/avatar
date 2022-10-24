## **HDFS的API使用**

### 基本使用

- 导入share/hadoop下相关jar包

- 配置参数的优先级

  - Java对象conf.set > 项目的配置文件 > 安装包中的配置site > 默认的配置default

  - conf/hdfs-site.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
<property>
<name>dfs.blocksize</name>
<value>64M</value>
</property>
</configuration>
```

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;

public class HdfsDemo1 {
    public static void main(String[] args) throws Exception {

        // 构造一个参数对象
        Configuration conf = new Configuration();

        conf.set("fs.defaultFS", "hdfs://linux01:9000");

        conf.set("dfs.replication", "2");// 设置副本为2, 覆盖默认的配置
        conf.set("dfs.blocksize", "64M");// 可见按多大切是客户端的行为

        // 通过设置当前JVM系统环境变量来指明客户身份
        System.setProperty("HADOOP_USER_NAME", "root");

        // 获取文件系统访问对象
        // FileSystem类是一个抽象类, 可以根据fs.defaultFS参数值的不同而获取到访问不同文件系统的对象
        FileSystem fs = FileSystem.get(conf);// // 构造时, 会在jvm环境中取HADOOP_USER_NAME的值作为当前客户端的用户身份

        //import java.net.URI;
//		FileSystem fs = FileSystem.get(new URI("hdfs://linux01:9000"), conf, "root");

        fs.mkdirs(new Path("/a/b"));
        fs.close();
    }
}
```

### 操作方法

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.BlockLocation;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.LocatedFileStatus;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.fs.RemoteIterator;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class HdfsDemo2 {
    FileSystem fs = null;

    @Before
    public void init() throws Exception {
        Configuration conf = new Configuration();
        conf.set("fs.defaultFS", "hdfs://linux01:9000");
        System.setProperty("HADOOP_USER_NAME", "root");
        fs = FileSystem.get(conf);
    }

    // 创建目录
    @Test
    public void testMkdir() throws Exception {

        fs.mkdirs(new Path("/a/b"));
    }

    // 上传文件
    @Test
    public void testPut() throws Exception {

        // 若b不存在，会上传文件并改名为b
        // 命令行方式会报错No such file or directory, hdfs dfs -put ./test.dat /a/b/
        fs.copyFromLocalFile(new Path("d:/Workspace/Test/test.dat"), new Path("/a/b/"));
        // 如果目标路径已存在，默认覆盖

        // copyFromLocalFile(delSrc, src, dst);
        // copyFromLocalFile(delSrc, overwrite, srcs, dst);
//		fs.copyFromLocalFile(false, false, new Path("d:/Workspace/Test/test.dat"), new Path("/a/b/"));
		// 如果目标已存在，会抛异常java.io.IOException：Target /a/b/test.dat already exists
    }

    // 下载文件
    @Test
    public void testGet() throws Exception {

        // java.io.FileNotFoundException: HADOOP_HOME and hadoop.home.dir are unset
        // 调操作系统的本地API来操作本地文件系统，需要在windows系统中放置一个本地库版bin目录，并将它的上级目录配置到windows的环境变量HADOOP_HOME中
        // 会生成crc校验文件
//        fs.copyToLocalFile(new Path("/a/b/test.dat"), new Path("d:/Workspace/Test/"));

        // 不需要配置环境变量，指定使用java原生API去操作本地文件系统，不需要hadoop的windows本地库
        // copyToLocalFile(delSrc, src, dst, useRawLocalFileSystem)
		fs.copyToLocalFile(false, new Path("/a/b/test.dat"), new Path("d:/Workspace/Test/"), true);
    }

    // 移动、重命名
    @Test
    public void testMv() throws Exception {

        // 若存在/c，则移动到/c内；若不存在，则移动到/并改名为c
        // 命令行方式会报错No such file or directory, hdfs dfs -mv /a/b/demo.jar /c/
        fs.rename(new Path("/a/b/test.dat"), new Path("/c/"));

        // 存在/b，/a/b文件夹会移动到/b内：/b/b/...
        // 命令行方式结果相同，hdfs dfs -mv /a/b /b
//		fs.rename(new Path("/a/b"), new Path("/b"));
    }


    // 删除
    @Test
    public void testDelete() throws Exception {

        // 参数二：是否递归删除
        fs.delete(new Path("/a/b"), true);
    }

    // 查看目录中的文件信息（不返回文件夹信息）
    @Test
    public void testLs1() throws Exception {

        // 参数二：是否递归
        RemoteIterator<LocatedFileStatus> iterator = fs.listFiles(new Path("/"), true);

        while(iterator.hasNext()) {
            // 拿到一个文件的元数据
            LocatedFileStatus meta = iterator.next();
            System.out.println("文件路径: " + meta.getPath());
            System.out.println("文件长度: " + meta.getLen());
            System.out.println("文件副本数: " + meta.getReplication());
            System.out.println("文件切块规格: " + meta.getBlockSize());

            System.out.println("块信息--------------------------------------------");
            BlockLocation[] blockLocations = meta.getBlockLocations();
            for (BlockLocation b : blockLocations) {
                System.out.println("块长度: " + b.getLength());
                System.out.println("块偏移量: " + b.getOffset());// 偏移量: 第1块是0, 第2块是128
                System.out.println("所在主机名: " + Arrays.toString(b.getHosts()));// 主机名数组
            }

            System.out.println("--------------------------------------------分割线");
        }
    }

    // 查看目录中的文件及文件夹信息
    @Test
    public void testLs2() throws Exception {

        // FileStatus是LocatedFileStatus的父类
        FileStatus[] listStatus = fs.listStatus(new Path("/"));
        for (FileStatus f : listStatus) {
            System.out.println(f.isDirectory()?"-d-" + f.getPath():"-f-" + f.getPath());
        }
    }

    // 写数据到文件
    @Test
    public void testWriteData() throws Exception {

        // 获取hdfs的输出流
        // 创建文件写入
        FSDataOutputStream out = fs.create(new Path("/a/b/test.dat"));

        // 追加写入
//		FSDataOutputStream out = fs.append(new Path("/a/b/test.dat"));

        out.write("Hello World".getBytes());

        out.close();
    }

    // 读取文件内容
    @Test
    public void testReadDate() throws Exception {

        // 使用fs工具对象获取hdfs文件的输入流
        FSDataInputStream in = fs.open(new Path("/a/b/test.dat"));

		byte[] b = new byte[1024];
		int read =0;
		while((read = in.read(b)) != -1) {
			System.out.println(new String(b, 0, read));
		}

        in.close();
    }

    // 从指定位置读取数据
    @Test
    public void testReadDate2() throws Exception {
        FSDataInputStream in = fs.open(new Path("/a/b/test.dat"));

        // 指定要读取的起始位置
        in.seek(10);
        BufferedReader br = new BufferedReader(new InputStreamReader(in));
        String line = null;
        while((line = br.readLine()) != null) {
            System.out.println(line);
        }
        in.close();
    }

    @Test
    public void testReadDate3() throws Exception {

        // 使用fs工具对象获取hdfs文件的输入流
        FSDataInputStream in = fs.open(new Path("/a/b/test.dat"));

        HashMap<String, Integer> cntMap = new HashMap<>();

        BufferedReader br = new BufferedReader(new InputStreamReader(in));
        String line = null;
        while((line = br.readLine()) != null) {
            String[] words = line.split(" ");
            for (String w : words) {
                cntMap.put(w, cntMap.getOrDefault(w, 0) + 1);
            }
        }

        in.close();

		System.out.println(cntMap);

        // 将统计结果写入hdfs
        Set<Entry<String, Integer>> entrySet = cntMap.entrySet();
        // 获取hdfs的输出流
        FSDataOutputStream out = fs.create(new Path("/result.txt"));
        for (Entry<String, Integer> entry : entrySet) {
            out.write((entry.getKey() + " , " + entry.getValue() + "\n").getBytes());
        }

        out.close();
    }

    @After
    public void end() throws Exception {
        fs.close();
    }
}
```