## **Spark安装部署记录**

### StandAlone

#### 集群安装

##### 1) 解压安装包

```shell
tar -zxvf spark-2.3.3-bin-hadoop2.7.tgz
```

##### 2) 修改配置文件

- spark-env.sh

```shell
export JAVA_HOME=/opt/app/jdk1.8.0_202
export SPARK_MASTER_HOST=linux01
```

- salves

```
linux02
linux03
```

##### 3) 分发安装包

```shell
scp -r spark-2.3.3-bin-hadoop2.7 linux02:$PWD
scp -r spark-2.3.3-bin-hadoop2.7 linux03:$PWD
```

#### 启停操作

##### 1) 一键启停

```shell
sbin/start-all.sh
sbin/stop-all.sh
```

##### 2) 单独启停

- 启停Master

```shell
sbin/start-master.sh
sbin/stop-master.sh
```

- 启停Worker

```shell
sbin/start-slave.sh spark://linux01:7077
sbin/stop-slave.sh
```

#### Web界面

> linux01:8080

#### 提交任务

##### 1> spark shell

###### (1) 启动

- 本地模式

```shell
bin/spark-shell
```

- 集群模式

```shell
bin/spark-shell --master spark://linux01:7077
```

###### (2) wordcount

Spark Shell中已经默认将SparkContext创建好 --- sc

> Spark context available as 'sc' (master = spark://linux01:7077, app id = app-20211028153341-0000).

```
scala> val lines = sc.textFile("hdfs://linux01:9000/test/sparktest/input/")
lines: org.apache.spark.rdd.RDD[String] = hdfs://linux01:9000/test/sparktest/input/ MapPartitionsRDD[1] at textFile at <console>:24

scala> val result = lines.flatMap(\_.split(" ")).map((\_, 1)).reduceByKey(\_+\_).sortBy(\_.\_2, false)
result: org.apache.spark.rdd.RDD[(String, Int)] = MapPartitionsRDD[9] at sortBy at <console>:25

scala> result.collect
res0: Array[(String, Int)] = Array((c,25), (a,23), (b,22), (e,21), (d,17))

scala> result.saveAsTextFile("hdfs://linux01:9000/test/sparktest/output/")
```

##### 2> IDEA

###### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>sparkdemo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!-- 定义了一些常量 -->
    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <scala.version>2.11.8</scala.version>
        <spark.version>2.3.3</spark.version>
        <hadoop.version>2.7.7</hadoop.version>
        <encoding>UTF-8</encoding>
    </properties>

    <dependencies>
        <!-- 导入scala的依赖 -->
        <dependency>
            <groupId>org.scala-lang</groupId>
            <artifactId>scala-library</artifactId>
            <version>${scala.version}</version>
        </dependency>

        <!-- 导入spark的依赖，core指的是RDD编程API -->
        <dependency>
            <groupId>org.apache.spark</groupId>
            <artifactId>spark-core_2.11</artifactId>
            <version>${spark.version}</version>
        </dependency>

        <!-- 读写HDFS中的数据 -->
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-client</artifactId>
            <version>2.7.7</version>
        </dependency>

    </dependencies>

    <build>
        <pluginManagement>
            <plugins>
                <!-- 编译scala的插件 -->
                <plugin>
                    <groupId>net.alchim31.maven</groupId>
                    <artifactId>scala-maven-plugin</artifactId>
                    <version>3.2.2</version>
                </plugin>
                <!-- 编译java的插件 -->
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.5.1</version>
                </plugin>
            </plugins>
        </pluginManagement>
        <plugins>
            <plugin>
                <groupId>net.alchim31.maven</groupId>
                <artifactId>scala-maven-plugin</artifactId>
                <executions>
                    <execution>
                        <id>scala-compile-first</id>
                        <phase>process-resources</phase>
                        <goals>
                            <goal>add-source</goal>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>scala-test-compile</id>
                        <phase>process-test-resources</phase>
                        <goals>
                            <goal>testCompile</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <executions>
                    <execution>
                        <phase>compile</phase>
                        <goals>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>


            <!-- 打jar插件 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>2.4.3</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <filters>
                                <filter>
                                    <artifact>*:*</artifact>
                                    <excludes>
                                        <exclude>META-INF/*.SF</exclude>
                                        <exclude>META-INF/*.DSA</exclude>
                                        <exclude>META-INF/*.RSA</exclude>
                                    </excludes>
                                </filter>
                            </filters>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```



###### (1) scala

```scala
import org.apache.spark.rdd.RDD
import org.apache.spark.{SparkConf, SparkContext}

object WordCount {

  def main(args: Array[String]): Unit = {


    val conf: SparkConf = new SparkConf().setSparkHome("WordCount")

    // 创建SparkContext，是Spark程序的执行入口，用于申请资源，创建RDD
    val sc: SparkContext = new SparkContext(conf)

    // 创建RDD，指定读取数据位置
    val lines: RDD[String] = sc.textFile(args(0))

    // 切分压平
    val words: RDD[String] = lines.flatMap(_.split(" "))

    // 将单词和1组合
    val wordAndOne: RDD[(String, Int)] = words.map((_, 1))

    // 分组聚合
    val reduced: RDD[(String, Int)] = wordAndOne.reduceByKey(_+_)

    // 排序
    val sorted: RDD[(String, Int)] = reduced.sortBy(_._2, false)

    // 保存结果
    sorted.saveAsTextFile(args(1))

    // 释放资源
    sc.stop()
  }
}
```

###### (2) java

```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.FlatMapFunction;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.api.java.function.PairFunction;
import scala.Tuple2;

import java.util.Arrays;
import java.util.Iterator;

public class JavaWordCount {

    public static void main(String[] args) {

        //Spark任务本地调试
        System.setProperty("HADOOP_USER_NAME", "root");
        SparkConf conf = new SparkConf().setAppName("JavaWordCount").setMaster("local[*]");

//        SparkConf conf = new SparkConf().setAppName("JavaWordCount");

        // 创建一个Java的SparkContext
        JavaSparkContext jsc = new JavaSparkContext(conf);

        // 创建RDD，指定读取数据位置
        JavaRDD<String> lines = jsc.textFile(args[0]);

        // 切分压平
        JavaRDD<String> words = lines.flatMap(new FlatMapFunction<String, String>() {
            @Override
            public Iterator<String> call(String line) throws Exception {
                return Arrays.asList(line.split(" ")).iterator();
            }
        });

        // 将单词和1组合
        JavaPairRDD<String, Integer> wordAndOne = words.mapToPair(new PairFunction<String, String, Integer>() {
            @Override
            public Tuple2<String, Integer> call(String word) throws Exception {
                return Tuple2.apply(word, 1);
            }
        });

        // 分组聚合
        JavaPairRDD<String, Integer> reduced = wordAndOne.reduceByKey(new Function2<Integer, Integer, Integer>() {
            @Override
            public Integer call(Integer v1, Integer v2) throws Exception {
                return v1 + v2;
            }
        });

        // 交互kv顺序
        JavaPairRDD<Integer, String> swaped = reduced.mapToPair(new PairFunction<Tuple2<String, Integer>, Integer, String>() {
            @Override
            public Tuple2<Integer, String> call(Tuple2<String, Integer> tp) throws Exception {
                return tp.swap();
            }
        });

        // 排序
        JavaPairRDD<Integer, String> sorted = swaped.sortByKey(false);

        // 交互kv顺序
        JavaPairRDD<String, Integer> result = sorted.mapToPair(new PairFunction<Tuple2<Integer, String>, String, Integer>() {
            @Override
            public Tuple2<String, Integer> call(Tuple2<Integer, String> tp) throws Exception {
                return tp.swap();
            }
        });

        // 保存结果
        result.saveAsTextFile(args[1]);

        // 释放资源
        jsc.stop();
    }
}
```

```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;

import java.util.Arrays;

public class JavaLambdaWordCount {

    public static void main(String[] args) {

        System.setProperty("HADOOP_USER_NAME", "root");
        SparkConf conf = new SparkConf().setAppName("JavaLambdaWordCount").setMaster("local[*]");
        
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<String> lines = jsc.textFile(args[0]);

        JavaRDD<String> words = lines.flatMap(line -> Arrays.stream(line.split(" ")).iterator());

        JavaPairRDD<String, Integer> wordAndOne = words.mapToPair(w -> Tuple2.apply(w, 1));
		
        // reduceByKey(Integer::sum)
        JavaPairRDD<String, Integer> reduced = wordAndOne.reduceByKey((v1, v2) -> v1 + v2);
		
        // mapToPair(Tuple2::swap)
        JavaPairRDD<Integer, String> swaped = reduced.mapToPair(tp -> tp.swap());

        JavaPairRDD<Integer, String> sorted = swaped.sortByKey(false);

        JavaPairRDD<String, Integer> result = sorted.mapToPair(tp -> tp.swap());

        result.saveAsTextFile(args[1]);

        jsc.stop();
    }
}
```

###### (3) 提交任务

```shell
bin/spark-submit --master spark://linux01:7077 --executor-memory 512m --total-executor-cores 2 --class com.phoenixera.wc.WordCount /tmp/phoenixera/wordcount.jar hdfs://linux01:9000/wordcount/input hdfs://linux01:9000/wordcount/output
```

> --executor-memory MEM       Memory per executor (e.g. 1000M, 2G) (Default: 1G).
>
> Spark standalone and Mesos only:
> --total-executor-cores NUM  Total cores for all executors.
>
> Spark standalone and YARN only:
> --executor-cores NUM        Number of cores per executor. (Default: 1 in YARN mode, or all available cores on the worker in standalone mode)

###### (4) 本地测试

```scala
System.setProperty("HADOOP_USER_NAME", "root")

val conf: SparkConf = new SparkConf().setSparkHome("WordCount").setMaster("local[*]")
```

#### 高可用配置

- vi spark-env.sh

```shell
#export SPARK_MASTER_HOST=linux01
export SPARK_DAEMON_JAVA_OPTS="-Dspark.deploy.recoveryMode=ZOOKEEPER -Dspark.deploy.zookeeper.url=linux01:2181,linux02:2181,linux03:2181 -Dspark.deploy.zookeeper.dir=/spark"
```

> scp spark-env.sh linux02:$PWD
>
> scp spark-env.sh linux03:$PWD

> [root@linux01 spark-2.3.3-bin-hadoop2.7]# sbin/start-all.sh
>
> [root@linux02 spark-2.3.3-bin-hadoop2.7]# sbin/start-master.sh

> [root@linux01 spark-2.3.3-bin-hadoop2.7]# zkCli.sh
>
> [zk: localhost:2181(CONNECTED) 0] ls /
> [servers, zookeeper, demo, spark, hbase]
>
> [zk: localhost:2181(CONNECTED) 1] ls /spark
> [leader_election, master_status]
>
> [zk: localhost:2181(CONNECTED) 11] ls /spark/leader_election
> [_c_7deb1545-9144-4ca4-85b6-58dc58d2e090-latch-0000000003, _c_df6bfaf9-423b-4dc9-a6bc-bd6886a407ab-latch-0000000004]

#### 执行模式

##### 1> client模式

- SparkStandAlone提交到集群中，默认模式为client模式，默认参数为 --deploy-mode client

- Driver是在SparkSubmit进程中

```shell
bin/spark-submit --master spark://linux01:7077,linux02:7077 --class com.unicloud.JavaWordCount --deploy-mode client /tmp/test/sparktest/sparkdemo-1.0-SNAPSHOT.jar hdfs://linux01:9000/test/sparktest/input/ hdfs://linux01:9000/test/sparktest/output/
```

##### 2> cluster模式

- 可以使用cluster模式，参数为 --deploy-mode cluster
- Driver运行在集群中，不在SparkSubmit进程中，需要将jar包上传到hdfs

```shell
bin/spark-submit --master spark://linux01:6066,linux02:6066 --class com.unicloud.JavaWordCount --deploy-mode cluster hdfs://linux01:9000/test/sparktest/sparkdemo-1.0-SNAPSHOT.jar hdfs://linux01:9000/test/sparktest/input/ hdfs://linux01:9000/test/sparktest/output/
```

- 使用REST方式提交

```
curl -X POST http://linux01:6066/v1/submissions/create --header "Content-Type:application/json;charset=UTF-8" --data '{
"action": "CreateSubmissionRequest",
"clientSparkVersion": "2.3.3",
"appArgs": ["hdfs://linux01:9000/test/sparktest/input/", "hdfs://linux01:9000/test/sparktest/output/"],
"appResource": "hdfs://linux01:9000/test/sparktest/sparkdemo-1.0-SNAPSHOT.jar",
"environmentVariables": {
"SPARK_ENV_LOADED": "1"
},
"mainClass": "com.unicloud.JavaWordCount",
"sparkProperties": {
"spark.jars": "hdfs://linux01:9000/test/sparktest/sparkdemo-1.0-SNAPSHOT.jar",
"spark.driver.supervise": "false",
"spark.app.name": "WordCount",
"spark.eventLog.enabled": "false",
"spark.submit.deployMode": "cluster",
"spark.master": "spark://linux01:6066"
}
}'
```

```
{
"action" : "CreateSubmissionResponse",
"message" : "Driver successfully submitted as driver-20211028172907-0004",
"serverSparkVersion" : "2.3.3",
"submissionId" : "driver-20211028172907-0004",
"success" : true
}[root@linux01 spark-2.3.3-bin-hadoop2.7]# 
```

### SparkOnYARN

#### 环境搭建

##### 1) 配置hadoop的配置文件目录

为了让spark找到core-site.xml、hdfs-site.xml和yarn-site.xml（NameNode、ResourceManager）

可在spark-env.sh或etc/profile配置

- vi spark-env.sh

```shell
#export SPARK_MASTER_HOST=linux01
#export SPARK_DAEMON_JAVA_OPTS="-Dspark.deploy.recoveryMode=ZOOKEEPER -Dspark.deploy.zookeeper.url=linux01:2181,linux02:2181,linux03:2181 -Dspark.deploy.zookeeper.dir=/spark"
export HADOOP_CONF_DIR=/opt/app/hadoop-2.8.5/etc/hadoop/
```

- 拷贝到其他节点 

```shell
scp spark-env.sh linux02:$PWD
scp spark-env.sh linux03:$PWD
```

不需要spark-env.sh中的SPARK_MASTER_HOST和SPARK_DAEMON_JAVA_OPTS

##### 2) 测试环境关闭内存资源检测 

> Exception in thread "main" org.apache.spark.SparkException: Yarn application has already ended! It might have been killed or unable to launch application master.

- vi yarn-site.xml

```xml
<!--是否启动一个线程检查每个任务正使用的物理内存量，如果任务超出分配值，则直接将其杀掉，默认为true-->
<property>
<name>yarn.nodemanager.pmem-check-enabled</name>
<value>false</value>
</property>

<!--是否启动一个线程检查每个任务正使用的虚拟内存量，如果任务超出分配值，则直接将其杀掉，默认为true-->
<property>
  <name>yarn.nodemanager.vmem-check-enabled</name>
  <value>false</value>
</property>
```

##### 3) 配置container可使用多个vcores

- yarn默认根据内存调度资源，即使--executor-cores指定核数，也还是1

- vi capacity-scheduler.xml

```xml
<property>
   <name>yarn.scheduler.capacity.resource-calculator</name>
   <!--
   <value>org.apache.hadoop.yarn.util.resource.DefaultResourceCalculator</value>
   -->
   <value>org.apache.hadoop.yarn.util.resource.DominantResourceCalculator</value>
</property>
```

- 拷贝到其他节点 

```shell
scp yarn-site.xml capacity-scheduler.xml linux02:$PWD
scp yarn-site.xml capacity-scheduler.xml linux03:$PWD
```

#### 资源分配

- Yarn中可以虚拟cpu核数，部署在物理机上，建议配置YARN的VCORES的使用等于物理机的逻辑核数

- Yarn中的资源分配，针对的是容器，容器默认的最少资源为1024m，容器接受的资源，必须是最小资源的整数倍

- spark中分配的资源由两部分组成：参数决定 + overhead

  overhead为max（分配资源 * 0.1，384）

  若--executor-memory或--driver-memory为1g，则占用资源为1g + 384m向上取整为2g



#### 提交任务

##### 1> client模式

- Driver运行在客户端，客户端一旦退出，程序终止
- spark-shell、spark-sql交互式命令行必须用client模式

```shell
bin/spark-submit \
--master yarn \
--deploy-mode client \
--class org.apache.spark.examples.SparkPi \
/opt/app/spark-2.3.3-bin-hadoop2.7/examples/jars/spark-examples_2.11-2.3.3.jar \
1000
```

- Container Running = 3：1个ExecutorLauncher，2个CoarseGrainedExecutorBackend (Executor)

  VCores Used = 3

  Memory Used = 5G

  linux01进程：SparkSubmit

  linux02进程：CoarseGrainedExecutorBackend

  linux03进程：CoarseGrainedExecutorBackend

  ExecutorLauncher进程会在其中一台

  spark.yarn.am.memory：client模式下master使用的内存，默认512m

  spark.yarn.am.cores：client模式下master使用的核数，默认1

##### 2> cluster模式

- Driver运行在集群，客户端提交任务后就可以退出，Driver挂掉后还可以重启

###### (1) 默认参数

```shell
bin/spark-submit \
--master yarn \
--deploy-mode cluster \
--class org.apache.spark.examples.SparkPi \
/opt/app/spark-2.3.3-bin-hadoop2.7/examples/jars/spark-examples_2.11-2.3.3.jar \
1000
```

- 默认参数（spark-submit查看）

  - --driver-memory 1024M/1G
  - --driver-cores 1 
  - --executor-memory 1024M/1G
  - --executor-cores 1
  - --num-executors 2

- Container Running = 3：1个ApplicationMaster（Driver），2个CoarseGrainedExecutorBackend（Executor）

  VCores Used = 3

  Memory Used = 6G

  linux01进程：SparkSubmit, ApplicationMaster           

  linux02进程：CoarseGrainedExecutorBackend

  linux03进程：CoarseGrainedExecutorBackend

###### (2) 指定参数

```shell
bin/spark-submit \
--master yarn \
--deploy-mode cluster \
--driver-memory 2g \
--driver-cores 2 \
--executor-memory 2g \
--executor-cores 2 \
--num-executors 2 \
--class org.apache.spark.examples.SparkPi \
/opt/app/spark-2.3.3-bin-hadoop2.7/examples/jars/spark-examples_2.11-2.3.3.jar \
1000
```

- VCores Used = 6

  Memory Used = 9G