## **HBase的BulkLoadar**

- bulkloader是一个批量快速导入数据到hbase的工具，用于已经存在一批巨量静态数据的情况
- 过程
  1. 从数据源（通常是文本文件或其他的数据库）提取原始数据并上传到HDFS，此过程与HBase无关
  2. 利用MapReduce作业处理事先准备的数据，使用HFileOutputFormat2来生成HBase数据文件
  3. 告知RegionServer数据的位置并导入数据，使用LoadIncrementalHFiles（或completebulkload工具），将文件在HDFS上的位置传递给它，它就会利用RegionServer将数据导入到相应的区域

### ImportTsv工具

- ImportTsv是HBase自带工具，能将csv文件转成HFile文件，并发送给RegionServer
- 本质是一个将csv文件转为HFile文件的mr程序

#### 使用

> r001,Aang,12
> r002,Katara,14
> r003,Sokka,15

##### csv转HFile命令

> hbase org.apache.hadoop.hbase.mapreduce.ImportTsv \
> -Dimporttsv.separator=, \
> -Dimporttsv.columns='HBASE_ROW_KEY,f1:name,f1:age'  \
> -Dimporttsv.bulk.output=/bulk/output \
> avatar \
> /bulk/input

- 相关参数

> -Dimporttsv.skip.bad.lines=false --- 若遇到无效行则失败
> -Dimporttsv.separator=, --- 使用特定分隔符, 默认是tab也就是\t
> -Dimporttsv.timestamp=currentTimeAsLong --- 默认使用导入时的时间戳
> -Dimporttsv.mapper.class=my.Mapper --- 使用用户自定义Mapper类替换TsvImporterMapper, 需要事先打成jar包放在hbase的lib目录中
> -Dmapreduce.job.name=jobName --- 对导入使用特定mapreduce作业名
> -Dcreate.table=no --- 是否避免创建表, 默认为yes, 若设为为no, 目标表必须存在于HBase中
> -Dno.strict=true --- 忽略HBase表列族检查, 默认为false
> -Dimporttsv.bulk.output=/user/yarn/output --- 作业的输出目录

##### HFile导入HBase命令

> hbase org.apache.hadoop.hbase.mapreduce.LoadIncrementalHFiles /bulk/output avatar

#### Demo

##### 需求

- 将一批静态数据使用ImportTsv工具转为HFile并导入HBase表

  1. rating.json用户对电影的评分记录

     > {"movie":"1193","rate":"5","timeStamp":"978300760","uid":"1"}

  2. movies.dat电影信息文件

     > 1::Toy Story (1995)::Animation|Children's|Comedy

  3. users.dat用户信息文件

     > 1::F::18::10::48067

##### 设计

- 使用Map端join实现三类数据关联

- rowkey设计

  - 写多 ---> 避免热点问题（加盐salting：1.随机盐，2.hashcode字串盐）

  - 读多 ---> 连续读（满足某条件的数据连续存放）

    ​		 ---> 跳跃性查询一条数据（数据打散）

  - 设计版本：movieid+时间戳+uid

    - 可高效支持查某电影评分记录，某电影某时间段评分记录
    - 查某人评分记录效率不高

##### 实现

```java
package com.phoenixera.mr;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.HashMap;

import org.apache.commons.lang3.StringUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class Movie2CSV {
	
	public static class MovieMapper extends Mapper<LongWritable, Text, Text, NullWritable> {
		
		HashMap<String, String> movieInfo = new HashMap<>();
		HashMap<String, String> userInfo = new HashMap<>();
		Text k = new Text();
		NullWritable v = NullWritable.get();
		
		@Override
		protected void setup(Mapper<LongWritable, Text, Text, NullWritable>.Context context)
				throws IOException, InterruptedException {
			
			loadDict("movies.dat", movieInfo);
			loadDict("users.dat", userInfo);
		}
		
		private void loadDict(String path, HashMap<String, String> info) throws IOException {
			
			BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(path)));
			String line = null;
			
			// 加载字典
			while((line = br.readLine()) != null) {
				// 1::Toy Story (1995)::Animation|Children's|Comedy
				// 1::F::18::10::48067
				String[] split = line.split("::");
				if(split.length > 2) {
					info.put(split[0], split[1] + "\t" + split[2]);
				}
			}
			br.close();
		}
		
		@Override
		protected void map(LongWritable key, Text value, Mapper<LongWritable, Text, Text, NullWritable>.Context context)
				throws IOException, InterruptedException {
			
			String line = value.toString();
			String[] split = line.split("\"");
			// {"movie":"1193","rate":"5","timeStamp":"978300760","uid":"1"}
			String movieId = split[3];
			String rate = split[7];
			String timestamp = split[11];
			String uid = split[15];
			String mInfo = movieInfo.get(movieId);
			String uInfo = userInfo.get(uid);
			
			// 填充movieId和uid为统一长度
			String padMid = StringUtils.leftPad(movieId, 6, "0");
			String padUid = StringUtils.leftPad(uid, 6, "0");
			
			k.set(padMid + timestamp + padUid + "\t" + mInfo + "\t" + uInfo + "\t" + rate);
			context.write(k, v);
		}
	}
	
	public static void main(String[] args) throws Exception {
		
		Configuration conf = new Configuration();
		Job job = Job.getInstance(conf);
		
		job.setJarByClass(Movie2CSV.class);
		
		job.setMapperClass(MovieMapper.class);
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(NullWritable.class);
		
		job.setNumReduceTasks(0);
		
		job.addCacheFile(new URI("hdfs://linux01:9000/cache/movies.dat"));
		job.addCacheFile(new URI("hdfs://linux01:9000/cache/users.dat"));
		
		FileInputFormat.setInputPaths(job, new Path("/movie/input"));
		FileOutputFormat.setOutputPath(job, new Path("/movie/output"));
		
		boolean b = job.waitForCompletion(true);
		System.exit(b ? 0 : 1);
	}
}
```



> hbase org.apache.hadoop.hbase.mapreduce.ImportTsv \
> -Dimporttsv.columns='HBASE_ROW_KEY,f1:n,f1:s,f1:g,f1:a,f1:r'  \
> -Dimporttsv.bulk.output=/bulk/output \
> movie \
> /movie/output

> hbase org.apache.hadoop.hbase.mapreduce.LoadIncrementalHFiles /bulk/output movie



### 自定义MR生成HFile

#### 流程

##### 1) 设置Mapper的输出kv类型

- k：ImmutableBytesWritable（代表行键）
- v：KeyValue（代表cell）

##### 2) 开发Mapper

- 读取原始数据，按需求处理
- 输出rowkey作为k，输出一些KeyValue作为v

##### 3) 配置job参数

- zookeeper的连接地址
- 配置输出的OutputFormat为HFileOutputFormat2，并为其设置参数

##### 4) 导入HFile到RegionServer

- 使用LoadIncrementalHFiles

#### Demo

##### Json2HFile.java

```java
import java.io.IOException;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.KeyValue;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Admin;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.apache.hadoop.hbase.client.RegionLocator;
import org.apache.hadoop.hbase.client.Table;
import org.apache.hadoop.hbase.io.ImmutableBytesWritable;
import org.apache.hadoop.hbase.mapreduce.CellSortReducer;
import org.apache.hadoop.hbase.mapreduce.HFileOutputFormat2;
import org.apache.hadoop.hbase.tool.LoadIncrementalHFiles;
import org.apache.hadoop.hbase.util.Bytes;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.codehaus.jackson.map.ObjectMapper;

public class Json2HFile {
	
	public static class AvatarMapper extends Mapper<LongWritable, Text, ImmutableBytesWritable, KeyValue> {
		
		@Override
		protected void map(LongWritable key, Text value,
				Mapper<LongWritable, Text, ImmutableBytesWritable, KeyValue>.Context context)
				throws IOException, InterruptedException {
			
			// {"id":"1","name":"Aang","age":"12"}
			String s = value.toString();
			ObjectMapper om = new ObjectMapper();
			Avatar a = om.readValue(s, Avatar.class);
			
			// 构造一个rowkey作为map的输出key，构造一个keyvalue作为map的输出value
			ImmutableBytesWritable rowkey = new ImmutableBytesWritable(a.getId().getBytes());
			KeyValue kv1 = new KeyValue(a.getId().getBytes(), "f".getBytes(), "name".getBytes(), a.getName().getBytes());
			KeyValue kv2 = new KeyValue(a.getId().getBytes(), "f".getBytes(), "age".getBytes(), Bytes.toBytes(a.getAge()));
			
			context.write(rowkey, kv1);
			context.write(rowkey, kv2);
			
		}
	}
	
	public static void main(String[] args) throws Exception {
		
		TableName tableName = TableName.valueOf("avatar");
		
		Configuration conf = HBaseConfiguration.create();
		conf.set("hbase.zookeeper.quorum", "linux01:2181,linux02:2181,linux03:2181");
		
		Job job = Job.getInstance(conf);
		job.setJarByClass(Json2HFile.class);
		job.setMapperClass(AvatarMapper.class);
		job.setReducerClass(CellSortReducer.class);
		
		job.setMapOutputKeyClass(ImmutableBytesWritable.class);
		job.setMapOutputValueClass(KeyValue.class);
		
		FileInputFormat.setInputPaths(job, new Path("hdfs://linux01:9000/json/input"));
		FileOutputFormat.setOutputPath(job, new Path("hdfs://linux01:9000/json/output"));
		
		Connection conn = ConnectionFactory.createConnection(conf);
		
		// 用于获取表的region信息
		RegionLocator regionLocator = conn.getRegionLocator(tableName);
		
		Table table = conn.getTable(tableName);
		
		// 为job配置表的schema信息，region信息
		HFileOutputFormat2.configureIncrementalLoad(job, table, regionLocator);
		
		boolean res = job.waitForCompletion(true);
		
		if(res) {
			
			LoadIncrementalHFiles loadIncrementalHFiles = new LoadIncrementalHFiles(conf);
			
			Admin admin = conn.getAdmin();
			
			loadIncrementalHFiles.doBulkLoad(new Path("hdfs://linux01:9000/json/output"), admin, table, regionLocator);
		}
	}
}
```

##### Avatar.java

```java
public class Avatar {
	
	private String id;
	private String name;
	private int age;
	
	
	public void set(String id, String name, int age) {
		this.id = id;
		this.name = name;
		this.age = age;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	
}
```

##### pom.xml

```xml
	<dependencies>

		<dependency>
			<groupId>org.apache.zookeeper</groupId>
			<artifactId>zookeeper</artifactId>
			<version>3.4.6</version>
		</dependency>
		
		<dependency>
			<groupId>junit</groupId>
			<artifactId>junit</artifactId>
			<version>4.12</version>
			<scope>compile</scope>
		</dependency>

		<dependency>
			<groupId>org.apache.hbase</groupId>
			<artifactId>hbase-client</artifactId>
			<version>2.0.4</version>
		</dependency>

        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-client</artifactId>
            <version>2.8.5</version>
        </dependency>
        
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-common</artifactId>
            <version>2.8.5</version>
        </dependency>
        
        <dependency>
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-server</artifactId>
            <version>2.0.4</version>
        </dependency>

        <dependency>
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-mapreduce</artifactId>
            <version>2.0.4</version>
        </dependency>
        
	</dependencies>
	
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.5.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>


            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <configuration>
                    <!-- get all project dependencies -->
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                    <!-- MainClass in mainfest make a executable jar -->
                    <archive>
                        <manifest>
                            <!--<mainClass>util.Microseer</mainClass>-->
                        </manifest>
                    </archive>

                </configuration>
                <executions>
                    <execution>
                        <id>make-assembly</id>
                        <!-- bind to the packaging phase -->
                        <phase>package</phase>
                        <goals>
                            <goal>single</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

        </plugins>
    </build>
```

### MapReduce数据入库

#### 需求

- 将用户画像标签数据导入HBase，并支持
  1. 根据gid查询画像数据
  2. 根据任意标识查询画像数据

```json
{
    "gid": "g01",
    "ids": {
        "ADR": {
            "A01": 3
        },
        "IME": {
            "I01": 3
        },
        "UID": {
            "u01": 3
        },
        "MAC": {
            "M01": 3
        }
    },
    "populate_tags": {},
    ...
}    
```

#### 设计

- 使用二级索引

- t_userprofile

| rowkey | f:tags |
| ------ | ------ |
| g01    | json   |

- t_index

| rowkey | f:g  |
| ------ | ---- |
| A01    | g01  |
| I01    | g01  |

#### 实现

##### UserProfile2Csv.java

```java
import com.google.gson.Gson;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.output.MultipleOutputs;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class UserProfile2Csv {

    public static class ProfileMapper extends Mapper<LongWritable, Text,Text, NullWritable> {

        Gson gson = new Gson();
        MultipleOutputs<Text, NullWritable> outputs = null;

        @Override
        protected void setup(Context context) throws IOException, InterruptedException {

            outputs = new MultipleOutputs<>(context);
        }

        @Override
        protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {

            String line = value.toString();
            UserTags userTags = gson.fromJson(line, UserTags.class);

            String k = userTags.getGid() + "\t" + line;

            // 使用多路径输出器，输出gid,tags格式数据到目录/profile/userprofile
            outputs.write(new Text(k), NullWritable.get(), "hdfs://linux01:9000/profile/userprofile/");

            HashMap<String, HashMap<String, Double>> ids = userTags.getIds();
            Set<Map.Entry<String, HashMap<String, Double>>> entries = ids.entrySet();

            // 获取json字段ids中多有的id标识
            HashSet<String> idSet = new HashSet<>();
            for(Map.Entry<String, HashMap<String, Double>> entry : entries){
                Set<String> keys = entry.getValue().keySet();
                idSet.addAll(keys);
            }

            // 对idSet中的每一个id标识生成一条数据:id,gid
            for(String s : idSet){
                // 使用多路径输出器，输出gid,tags格式数据到目录/profile/index
                outputs.write(new Text(s + "\t" + userTags.getGid()), NullWritable.get(), "hdfs://linux01:9000/profile/index/");
            }
        }

        @Override
        protected void cleanup(Context context) throws IOException, InterruptedException {

            outputs.close();
        }
    }


    public static void main(String[] args) throws Exception {

        System.setProperty("HADOOP_USER_NAME", "root");

        Configuration conf = new Configuration();

        Job job = Job.getInstance(conf);

        job.setJarByClass(UserProfile2Csv.class);

        job.setMapperClass(ProfileMapper.class);
        job.setNumReduceTasks(0);

        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(NullWritable.class);

        FileInputFormat.setInputPaths(job, new Path("data/input"));
        FileOutputFormat.setOutputPath(job, new Path("data/output"));

        job.waitForCompletion(true);

    }
}
```

##### UserTags.java

```java
import java.util.HashMap;

public class UserTags {

    private String gid;
    private HashMap<String, HashMap<String, Double>> ids;
    private HashMap<String, HashMap<String, Double>> populate_tags;
    private HashMap<String, HashMap<String, Double>> base_tags;
    private HashMap<String, HashMap<String, Double>> device_tags;
    private HashMap<String, HashMap<String, Double>> item_tags;
    private HashMap<String, HashMap<String, Double>> buy_action_tags;
    private HashMap<String, HashMap<String, Double>> acc_action_tags;
    private HashMap<String, HashMap<String, Double>> dsp_ad_tags;
    private HashMap<String, HashMap<String, Double>> app_tags;
    private HashMap<String, HashMap<String, Double>> interest_tags;

    public String getGid() {
        return gid;
    }

    public void setGid(String gid) {
        this.gid = gid;
    }

    public HashMap<String, HashMap<String, Double>> getIds() {
        return ids;
    }

    public void setIds(HashMap<String, HashMap<String, Double>> ids) {
        this.ids = ids;
    }

    public HashMap<String, HashMap<String, Double>> getPopulate_tags() {
        return populate_tags;
    }

    public void setPopulate_tags(HashMap<String, HashMap<String, Double>> populate_tags) {
        this.populate_tags = populate_tags;
    }

    public HashMap<String, HashMap<String, Double>> getBase_tags() {
        return base_tags;
    }

    public void setBase_tags(HashMap<String, HashMap<String, Double>> base_tags) {
        this.base_tags = base_tags;
    }

    public HashMap<String, HashMap<String, Double>> getDevice_tags() {
        return device_tags;
    }

    public void setDevice_tags(HashMap<String, HashMap<String, Double>> device_tags) {
        this.device_tags = device_tags;
    }

    public HashMap<String, HashMap<String, Double>> getItem_tags() {
        return item_tags;
    }

    public void setItem_tags(HashMap<String, HashMap<String, Double>> item_tags) {
        this.item_tags = item_tags;
    }

    public HashMap<String, HashMap<String, Double>> getBuy_action_tags() {
        return buy_action_tags;
    }

    public void setBuy_action_tags(HashMap<String, HashMap<String, Double>> buy_action_tags) {
        this.buy_action_tags = buy_action_tags;
    }

    public HashMap<String, HashMap<String, Double>> getAcc_action_tags() {
        return acc_action_tags;
    }

    public void setAcc_action_tags(HashMap<String, HashMap<String, Double>> acc_action_tags) {
        this.acc_action_tags = acc_action_tags;
    }

    public HashMap<String, HashMap<String, Double>> getDsp_ad_tags() {
        return dsp_ad_tags;
    }

    public void setDsp_ad_tags(HashMap<String, HashMap<String, Double>> dsp_ad_tags) {
        this.dsp_ad_tags = dsp_ad_tags;
    }

    public HashMap<String, HashMap<String, Double>> getApp_tags() {
        return app_tags;
    }

    public void setApp_tags(HashMap<String, HashMap<String, Double>> app_tags) {
        this.app_tags = app_tags;
    }

    public HashMap<String, HashMap<String, Double>> getInterest_tags() {
        return interest_tags;
    }

    public void setInterest_tags(HashMap<String, HashMap<String, Double>> interest_tags) {
        this.interest_tags = interest_tags;
    }
}
```

##### TagsController.java

```java
import com.phoenixera.tags_query.service.UserTagsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TagsController {

    @Autowired
    UserTagsService service;

    @RequestMapping("/tags/bygid/{gid}")
    public String getTagsByGid(@PathVariable String gid) {

        String tags = service.getTagsByGid(gid);

        return tags;
    }

    @RequestMapping("/tags/byid/{id}")
    public String getTagsById(@PathVariable String id) {

        String tags = service.getTagsById(id);

        return tags;
    }
}

```

##### UserTagsService.java

```java
public interface UserTagsService {

    public String getTagsByGid(String gid);
    public String getTagsById(String id);
}

```

##### UserTagsServiceImpl.java

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.springframework.stereotype.Service;

@Service
public class UserTagsServiceImpl implements UserTagsService {

    Table t_userprofile = null;
    Table t_index = null;

    public UserTagsServiceImpl(){

        try {
            Configuration conf = HBaseConfiguration.create();
            conf.set("hbase.zookeeper.quorum", "linux01:2181,linux02:2181,linux03:2181");

            Connection conn = ConnectionFactory.createConnection(conf);

            t_userprofile = conn.getTable(TableName.valueOf("t_userprofile"));
            t_index = conn.getTable(TableName.valueOf("t_index"));

        }catch (Exception e){
            e.printStackTrace();
        }
    }

    /**
     * 根据gid查询画像
     * @param gid
     * @return
     */
    @Override
    public String getTagsByGid(String gid) {
        String tags = "status: -1";

        try {

            Get get = new Get(gid.getBytes());

            Result result = t_userprofile.get(get);
            byte[] value = result.getValue("f".getBytes(), "tags".getBytes());

            tags = new String(value);
        }catch (Exception e){
            e.printStackTrace();
        }

        return tags;
    }

    /**
     * 根据id标识查询画像
     * @param id
     * @return
     */
    @Override
    public String getTagsById(String id) {

        String tags = "status: -1";

        try {

            // 先根据id查询索引表得到gid
            Get get = new Get(id.getBytes());

            Result result = t_index.get(get);
            byte[] value = result.getValue("f".getBytes(), "g".getBytes());

            // 再根据gid查询画像表
            tags = getTagsByGid(new String(value));
        }catch (Exception e){
            e.printStackTrace();
        }

        return tags;
    }
}
```

### Spark数据入库

```scala
package com.lij.profile.tagexport

import org.apache.commons.codec.digest.DigestUtils
import org.apache.hadoop.fs.Path
import org.apache.hadoop.hbase.client.{ConnectionFactory, TableDescriptorBuilder}
import org.apache.hadoop.hbase.{HBaseConfiguration, KeyValue, TableName}
import org.apache.hadoop.hbase.io.ImmutableBytesWritable
import org.apache.hadoop.hbase.mapreduce.{HFileOutputFormat2, TableOutputFormat}
import org.apache.hadoop.hbase.tool.LoadIncrementalHFiles
import org.apache.hadoop.hbase.util.Bytes
import org.apache.hadoop.mapreduce.Job
import org.apache.spark.sql.SparkSession

// create 'profile_tags','f'
object ProfileTags2Hbase {
  def main(args: Array[String]): Unit = {

    val date: String = "2019-11-20"
    System.setProperty("HADOOP_USER_NAME", "root")
    val spark = SparkSession.builder().appName("").master("local")
      .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
      .getOrCreate()

    import spark.implicits._
    val tagsDf = spark.read.parquet("userprofile/data/output/tag_merge/day02")
//    +----+----------+--------+----------+-------+
//    |gid |tag_module|tag_name|tag_value |weight |
//    +----+----------+--------+----------+-------+
//    |1001|M001      |T101    |iphoneX   |5.0    |
//    |1001|M001      |T101    |iphoneX   |5.0    |
//    |1001|M001      |T101    |MI8       |3.6    |
//    |1002|M010      |T103    |88.8      |-9999.9|
//    |1006|M010      |T103    |3889      |-9999.9|
//    +----+----------+--------+----------+-------+

    val conf = HBaseConfiguration.create()
    conf.set("hbase.zookeeper.quorum", "linux01:2181,linux02:2181,linux03:2181")
    conf.set(TableOutputFormat.OUTPUT_TABLE, "profile_tags")
    conf.set("fs.defaultFS", "hadf://linux01:9000/")

    val job = Job.getInstance(conf)
    job.setMapOutputKeyClass(classOf[ImmutableBytesWritable])
    job.setMapOutputValueClass(classOf[KeyValue])

    val tableDesc = TableDescriptorBuilder.newBuilder(TableName.valueOf("profile_tags")).build()
    HFileOutputFormat2.configureIncrementalLoadMap(job, tableDesc)

    // 整理为(k, v)元组
    // k为ImmutableBytesWritable类型（hbase表中的rowkey）
    // v为KeyValue类型（hbase表中的一个qualifier+value=>cell）
    val kvRdd = tagsDf.rdd.map(row => {
      val gid = row.getAs[Long]("gid").toString
      val gidmd5 = DigestUtils.md5Hex(gid).substring(0, 10) + date

      val tag_module = row.getAs[String]("tag_module")
      val tag_name = row.getAs[String]("tag_name")
      val tag_value = row.getAs[String]("tag_value")
      val weight = row.getAs[Double]("weight")
      (gidmd5, tag_module, tag_name, tag_value, weight)
    })
      // 对数据按hbase的要求排序：先按rowkey，再按列族，再按qualifier
      .sortBy(tp => (tp._1, tp._2, tp._3, tp._4))
      .map(tp => {
        val keyvalue = new KeyValue(
          tp._1.getBytes(),
          "f".getBytes(),
          (tp._2 + ":" + tp._3 + ":" + tp._4) getBytes,
          Bytes.toBytes(tp._5))

        val rowkey = new ImmutableBytesWritable(tp._1.getBytes())
        (rowkey, keyvalue)
      })
    kvRdd

    // 将RDD[(K,V)]利用HFileOutputFormat2存储为HFile文件
    kvRdd.saveAsNewAPIHadoopFile(
      "hdfs://linux01:9000/tmp2/taghfile/2019-11-20",
      classOf[ImmutableBytesWritable],
      classOf[KeyValue],
      classOf[HFileOutputFormat2],
      job.getConfiguration)

    spark.close()
    println("HFile文件生成完毕 -------------------------------")

    // 利用hbase提供的LoadIncreamentalHFiles.doBulkload()将HFile导入HBase
    val conn = ConnectionFactory.createConnection(conf)
    val admin = conn.getAdmin
    val table = conn.getTable(TableName.valueOf("profile_tags"))
    val locator = conn.getRegionLocator(TableName.valueOf("profile_tags"))

    val loader = new LoadIncrementalHFiles(conf)
    loader.doBulkLoad(new Path("hdfs://linux01:9000/tmp2/taghfile/2019-11-20"), admin, table, locator)

    println("HFile数据导入完成 -------------------------------")
  }
}
```


