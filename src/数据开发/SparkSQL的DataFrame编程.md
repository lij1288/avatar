## **SparkSQL的DataFrame编程**

### SparkSession

- 编程入口，是SparkContext和SQLContext的组合

- SparkContext产生RDD，SQLContext产生DataFrame
- SparkSession.builder用于创建一个SparkSession
- import spark.implicits._的引入是用于将DataFrames隐式转换成RDD，使df能够使用RDD中的方法

### 创建DataFrame

- SparkSession是创建DataFrame和执行SQL的入口
- 创建DataFrame有三种方式:
  - 从一个已存在的RDD转换
  - 从JSON、Parquet、CSV、ORC、JDBC等结构化数据源直接创建
  - 从HiveTable进行查询返回
- 创建DataFrame，需要创建”RDD + schema“
  - RDD来自于数据
  - schema可以由开发人员定义或由框架从数据中推断

#### 从RDD创建

##### 1> RDD[case class]

- 框架可推断出数据的字段类型和字段名称

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{DataFrame, SparkSession}

/**
 * 通过RDD[case class类型]创建dataframe
 */
case class Stu(id:Int, name:String, age:Int, city:String)

object CreateDF_CaseClass {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark: SparkSession = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    // 加载不含schema信息的数据为一个RDD
    val rdd: RDD[String] = spark.sparkContext.textFile("data/stu.txt")
//    1,Aang,12,air
//    2,Katara,14,water
//    3,Sokka,15,water

    // 将RDD[String]转为RDD[Stu]
    val rddStu: RDD[Stu] = rdd
      .map(line => line.split(","))
      .map(arr => Stu(arr(0).toInt, arr(1), arr(2).toInt, arr(3)))

    // 将RDD[Stu]直接转为dataframe
    val df: DataFrame = spark.createDataFrame(rddStu)
    df.printSchema()
    df.show()

    // 简洁方式，导入隐式转换
    import spark.implicits._

    val df2: DataFrame = rddStu.toDF()
    df2.show()

    spark.close()

//    root
//    |-- id: integer (nullable = false)
//    |-- name: string (nullable = true)
//    |-- age: integer (nullable = false)
//    |-- city: string (nullable = true)
//
//    +---+------+---+-----+
//    | id|  name|age| city|
//    +---+------+---+-----+
//    |  1|  Aang| 12|  air|
//    |  2|Katara| 14|water|
//    |  3| Sokka| 15|water|
//    +---+------+---+-----+
  }
}
```

##### 2> RDD[Tuple]

- 框架可推断出数据类型和字段在元组中的索引

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{DataFrame, SparkSession}

/**
 * 通过RDD[tuple]创建dataframe
 */
object CreateDF_Tuple {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark: SparkSession = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    // 加载不含schema信息的数据为一个RDD
    val rdd: RDD[String] = spark.sparkContext.textFile("data/stu.txt")

    // 将RDD[String]转为RDD[(f1,f2,f3,...)]
    val rddTuple: RDD[(Int, String, Int, String)] = rdd
      .map(_.split(","))
      .map(arr => (arr(0).toInt, arr(1), arr(2).toInt, arr(3)))

    val df: DataFrame = spark.createDataFrame(rddTuple)
    df.printSchema()
    df.show()
//    root
//    |-- _1: integer (nullable = false)
//    |-- _2: string (nullable = true)
//    |-- _3: integer (nullable = false)
//    |-- _4: string (nullable = true)
//
//    +---+------+---+-----+
//    | _1|    _2| _3|   _4|
//    +---+------+---+-----+
//    |  1|  Aang| 12|  air|
//    |  2|Katara| 14|water|
//    |  3| Sokka| 15|water|
//    +---+------+---+-----+
      
    import spark.implicits._
    val df2: DataFrame = rddTuple.toDF("id", "name", "age", "city")

    df2.printSchema()
    df2.show()
//    root
//    |-- id: integer (nullable = false)
//    |-- name: string (nullable = true)
//    |-- age: integer (nullable = false)
//    |-- city: string (nullable = true)
//
//    +---+------+---+-----+
//    | id|  name|age| city|
//    +---+------+---+-----+
//    |  1|  Aang| 12|  air|
//    |  2|Katara| 14|water|
//    |  3| Sokka| 15|water|
//    +---+------+---+-----+

    spark.close()
  }
}
```

##### 3> RDD[JavaBean]

- 在spark.implicits._中没有toDF支持

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{DataFrame, SparkSession}

/**
 * 通过RDD[JavaBean]创建dataframe
 */
object CreateDF_JavaBean  {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark: SparkSession = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()
    spark.sparkContext
    // 加载不含schema信息的数据为一个RDD
    val rdd: RDD[String] = spark.sparkContext.textFile("data/stu.txt")

    // 将RDD[String]转为RDD[JavaStu]
    val rddJavaStu: RDD[JavaStu] = rdd.map(line => {
      val arr = line.split(",")
      new JavaStu(arr(0).toInt, arr(1), arr(2).toInt, arr(3))
    })

    // 将RDD[JavaStu]转为dataframe
    val df: DataFrame = spark.createDataFrame(rddJavaStu, classOf[JavaStu])

    df.printSchema()
    df.show()

    spark.close()
  }
}
```

```scala
public class JavaStu {
    int id;
    String name;
    int age;
    String city;

    public JavaStu(int id, String name, int age, String city) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.city = city;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
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

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    @Override
    public String toString() {
        return "JavaStu{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", city='" + city + '\'' +
                '}';
    }
}
```

##### 4> RDD[ScalaBean]

- 框架在底层将其视为java定义的标准bean类型来处理
- scala中定义的普通bean类，不具备字段的java标准getters和setters，可以@BeanProperty

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{DataFrame, SparkSession}

/**
 * 通过RDD[scala bean]创建dataframe
 */
object CreateDF_ScalaBean {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark: SparkSession = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    // 加载不含schema信息的数据为一个RDD
    val rdd: RDD[String] = spark.sparkContext.textFile("data/stu.txt")

    // 将RDD[String]转为RDD[ScalaStu]
    val rdd2: RDD[ScalaStu] = rdd.map(line => {
      val arr = line.split(",")
      val bean: ScalaStu = ScalaStu(arr(0).toInt, arr(1), arr(2).toInt, arr(3))
      bean
    })

    // 用RDD[ScalaStu]创建dataframe
    val df: DataFrame = spark.createDataFrame(rdd2, classOf[ScalaStu])
    df.printSchema()
    df.show()

    spark.close()
  }
}
```

```scala
import scala.beans.BeanProperty

class ScalaStu (
               @BeanProperty
               val id:Int,
               @BeanProperty
               val name:String,
               @BeanProperty
               val age:Int,
               @BeanProperty
               val city:String
               )

object ScalaStu{
  def apply(id: Int, name: String, age: Int, city: String): ScalaStu = new ScalaStu(id, name, age, city)
}
```

##### 5> RDD[Row]

- Row是SparkSQL中对数据的统一封装形式（内置定义好的一个数据封装类）
- 任何数据要变成dataframe，都要先把数据变成Row

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.types.{DataTypes, StructField, StructType}
import org.apache.spark.sql.{DataFrame, Row, SparkSession}

/**
 * 通过RDD[Row]创建dataframe
 */
object CreateDF_Row {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark: SparkSession = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    // 加载不含schema信息的数据为一个RDD
    val rdd: RDD[String] = spark.sparkContext.textFile("data/stu.txt")

    // 将RDD[String]转为RDD[Row]
    val rdd2: RDD[Row] = rdd.map(line => {
      val arr = line.split(",")
      Row(arr(0).toInt, arr(1), arr(2).toInt, arr(3))
    })

    // 构造一个数据描述，表定义
    val schema: StructType = new StructType(Array(
      StructField("id", DataTypes.IntegerType),
      StructField("name", DataTypes.StringType),
      StructField("age", DataTypes.IntegerType),
      StructField("city", DataTypes.StringType)
    ))

    // 使用RDD[Row]和数据描述创建dataframe
    val df: DataFrame = spark.createDataFrame(rdd2, schema)

    df.printSchema()
    df.show()

    spark.close()
  }
}
```

##### 6> RDD[Set/Seq/Map]

- Set/Seq解构出的字段类型为Array，Map解构出的字段类型为Map

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{DataFrame, SparkSession}

object CreateDF_SeqSetMap {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // 通过RDD[Seq]创建dataframe
    val seq1 = Seq(1, 2, 3, 4)
    val seq2 = Seq(11, 22, 33, 44)
    val rddSeq: RDD[Seq[Int]] = spark.sparkContext.parallelize(List(seq1, seq2))
    val df1: DataFrame = rddSeq.toDF()
    df1.printSchema()
    df1.show()
//    root
//    |-- value: array (nullable = true)
//    |    |-- element: integer (containsNull = false)
//
//    +----------------+
//    |           value|
//    +----------------+
//    |    [1, 2, 3, 4]|
//    |[11, 22, 33, 44]|
//    +----------------+

    df1.selectExpr("value[0]", "size(value)").show()
//    +--------+-----------+
//    |value[0]|size(value)|
//    +--------+-----------+
//    |       1|          4|
//    |      11|          4|
//    +--------+-----------+

    val set1 = Set("a", "b", "c")
    val set2 = Set("A", "B", "C", "D")
    val rddSet: RDD[Set[String]] = spark.sparkContext.parallelize(List(set1, set2))
    val df2: DataFrame = rddSet.toDF("letters")
    df2.printSchema()
    df2.show()
//    root
//    |-- letters: array (nullable = true)
//    |    |-- element: string (containsNull = true)
//
//    +------------+
//    |     letters|
//    +------------+
//    |   [a, b, c]|
//    |[A, B, C, D]|
//    +------------+

    val map1 = Map("math"->145, "english"->135)
    val map2 = Map("math"->125, "chemistry"->90, "physics"->120)
    val rddMap: RDD[Map[String, Int]] = spark.sparkContext.parallelize(List(map1, map2))
    val df3: DataFrame = rddMap.toDF("score")
    df3.printSchema()
    df3.show(false)
//    root
//    |-- score: map (nullable = true)
//    |    |-- key: string
//    |    |-- value: integer (valueContainsNull = false)
//
//    +----------------------------------------------+
//    |score                                         |
//    +----------------------------------------------+
//    |[math -> 145, english -> 135]                 |
//    |[math -> 125, chemistry -> 90, physics -> 120]|
//    +----------------------------------------------+

    df3.selectExpr("score['math']", "size(score)", "map_keys(score)", "map_values(score)").show()
//    +-----------+-----------+--------------------+-----------------+
//    |score[math]|size(score)|     map_keys(score)|map_values(score)|
//    +-----------+-----------+--------------------+-----------------+
//    |        145|          2|     [math, english]|       [145, 135]|
//    |        125|          3|[math, chemistry,...|   [125, 90, 120]|
//    +-----------+-----------+--------------------+-----------------+

    spark.close()
  }
}
```

#### 从结构化文件创建

##### 1> JSON文件

```scala
val df: DataFrame = spark.read.json("data/avatar.json")
```

##### 2> CSV文件（无header）

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.sql.types.{DataTypes, StructField, StructType}
import org.apache.spark.sql.{DataFrame, SparkSession}

object CreateDF_CSV_NoHeader {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    val df1: DataFrame = spark.read.csv("data/user_noheader.csv")
    df1.printSchema()
    df1.show()
//    root
//    |-- _c0: string (nullable = true)
//    |-- _c1: string (nullable = true)
//    |-- _c2: string (nullable = true)
//    |-- _c3: string (nullable = true)
//    |-- _c4: string (nullable = true)
//
//    +---+------+---+-------+---+
//    |_c0|   _c1|_c2|    _c3|_c4|
//    +---+------+---+-------+---+
//    |  1|  Aang| 24|Baoding|4.5|
//    |  2|Katara| 25|Beijing|8.5|
//    |  3| Sokka| 27|Chengdu|6.6|
//    +---+------+---+-------+---+

    // 让框架推断字段类型（不建议，会对整个数据进行一次全局扫描）
    val dfInfer: DataFrame = spark.read.option("inferSchema", "true").csv("data/user_noheader.csv")
    // 重设字段名
    val df2 = dfInfer.toDF("id", "name", "age", "city", "money")
    df2.printSchema()
    df2.show()
//    root
//    |-- id: integer (nullable = true)
//    |-- name: string (nullable = true)
//    |-- age: integer (nullable = true)
//    |-- city: string (nullable = true)
//    |-- money: double (nullable = true)
//
//    +---+------+---+-------+-----+
//    | id|  name|age|   city|money|
//    +---+------+---+-------+-----+
//    |  1|  Aang| 24|Baoding|  4.5|
//    |  2|Katara| 25|Beijing|  8.5|
//    |  3| Sokka| 27|Chengdu|  6.6|
//    +---+------+---+-------+-----+

    // 自定义schema（指定字段类型，重设字段名）
    val schema = new StructType(Array(
      StructField("id", DataTypes.IntegerType),
      StructField("name", DataTypes.StringType),
      StructField("age", DataTypes.IntegerType),
      StructField("city", DataTypes.StringType),
      StructField("money", DataTypes.DoubleType)
    ))

    val df3: DataFrame = spark.read.schema(schema).csv("data/user_noheader.csv")
    df3.printSchema()
    df3.show()
//    root
//    |-- id: integer (nullable = true)
//    |-- name: string (nullable = true)
//    |-- age: integer (nullable = true)
//    |-- city: string (nullable = true)
//    |-- money: double (nullable = true)
//
//    +---+------+---+-------+-----+
//    | id|  name|age|   city|money|
//    +---+------+---+-------+-----+
//    |  1|  Aang| 24|Baoding|  4.5|
//    |  2|Katara| 25|Beijing|  8.5|
//    |  3| Sokka| 27|Chengdu|  6.6|
//    +---+------+---+-------+-----+

    spark.close()
  }
}
```

##### 3> CSV文件（有header）

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.sql.{DataFrame, SparkSession}

object CreateDF_Csv_Header {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    val df: DataFrame = spark.read.option("inferSchema", true).option("header", true).csv("data/user.csv")
    df.printSchema()
    df.show()
//    root
//    |-- id: integer (nullable = true)
//    |-- name: string (nullable = true)
//    |-- age: integer (nullable = true)
//    |-- city: string (nullable = true)
//    |-- money: double (nullable = true)
//
//    +---+------+---+-------+-----+
//    | id|  name|age|   city|money|
//    +---+------+---+-------+-----+
//    |  1|  Aang| 24|Baoding|  4.5|
//    |  2|Katara| 25|Beijing|  8.5|
//    |  3| Sokka| 27|Chengdu|  6.6|
//    +---+------+---+-------+-----+

    spark.close()
  }
}
```

##### 4> Parquet文件

- Parquet是一种列式存储文件格式，文件自带schema描述信息

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.sql.{DataFrame, SparkSession}

object CreateDF_Parquet {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

//    val df: DataFrame = spark.read.option("inferSchema", true).option("header", true).csv("data/user.csv")
//    df.write.parquet("data/parquet")

    val df: DataFrame = spark.read.parquet("data/parquet")
//    val df: DataFrame = spark.read.parquet("data/parquet/part-00000-bda2be3e-6ac3-4dc8-887e-a94932cf9936-c000.snappy.parquet")
    df.printSchema()
    df.show()
//    root
//    |-- id: integer (nullable = true)
//    |-- name: string (nullable = true)
//    |-- age: integer (nullable = true)
//    |-- city: string (nullable = true)
//    |-- money: double (nullable = true)
//
//    +---+------+---+-------+-----+
//    | id|  name|age|   city|money|
//    +---+------+---+-------+-----+
//    |  1|  Aang| 24|Baoding|  4.5|
//    |  2|Katara| 25|Beijing|  8.5|
//    |  3| Sokka| 27|Chengdu|  6.6|
//    +---+------+---+-------+-----+

    spark.close()
  }
}
```

#### 从外部服务器读取数据创建

##### 1> JDBC

- 使用jdbc连接读取数据库中的数据，需要引入jdbc的驱动jar包依赖

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.48</version>
</dependency>
```

```scala
import java.util.Properties

import org.apache.log4j.{Level, Logger}
import org.apache.spark.sql.{DataFrame, SparkSession}

object CreateDF_JDBC {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    val props = new Properties()
    props.setProperty("user", "root")
    props.setProperty("password", "root")

    // 需要依赖mysql-connector-java
    val df: DataFrame = spark.read.jdbc("jdbc:mysql://localhost:3306/bigdata", "user", props)
    df.printSchema()
    df.show()
//    root
//    |-- id: integer (nullable = true)
//    |-- name: string (nullable = true)
//    |-- age: integer (nullable = true)
//    |-- city: string (nullable = true)
//    |-- money: double (nullable = true)
//
//    +---+------+---+-------+-----+
//    | id|  name|age|   city|money|
//    +---+------+---+-------+-----+
//    |  1|  Aang| 24|Baoding|  4.5|
//    |  2|Katara| 25|Beijing|  8.5|
//    |  3| Sokka| 27|Chengdu|  6.6|
//    +---+------+---+-------+-----+

    df.where("money > 5.0").show()

    spark.close()
  }
}
```

##### 2> Hive

- 表数据在hdfs中，表定义信息在mysql中，不需要启动hive，SparkSQL内置hive功能
- 需要spark-hive的依赖jar和mysql连接驱动依赖jar
- 如果使用dataframe注册了与hive表同名的视图，这个视图名回替换掉hive的表

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.48</version>
</dependency>

<dependency>
    <groupId>org.apache.spark</groupId>
    <artifactId>spark-hive_2.11</artifactId>
    <version>2.4.4</version>
</dependency>
```

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{DataFrame, SparkSession}

/**
 * 1,Aang,m:145|e:135|p:115
 * 2,Katart,m:125|e:150|j:75
 *
 * hive> create table score(id int,name string,scores map<string,int>)
 * > row format delimited fields terminated by ','
 * > collection items terminated by '|'
 * > map keys terminated by ':';
 *
 * load data local inpath '/tmp/phoenixera/score.dat' into table score;
 *
 */
object CreateDF_Hive {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      // 启用hive支持，需要调用enableHiveSupport，还需要依赖spark-hive
      // 默认sparksql内置了hive
      // 若能从classpath中加载到hive-site，则访问的hive元数据库由本地内置改为配置中指定的元数据库
      // 若能从classpath中加载到core-site，则访问的文件系统由本地文件系统改为配置中指定的hdfs文件系统
      // （源码目录都是classpath）
      .enableHiveSupport()
      .getOrCreate()

    val df: DataFrame = spark.sql("select * from score")
    df.printSchema()
    df.show(false)
//    root
//    |-- id: integer (nullable = true)
//    |-- name: string (nullable = true)
//    |-- scores: map (nullable = true)
//    |    |-- key: string
//    |    |-- value: integer (valueContainsNull = true)
//
//    +---+------+------------------------------+
//    |id |name  |scores                        |
//    +---+------+------------------------------+
//    |1  |Aang  |[m -> 145, e -> 135, p -> 115]|
//    |2  |Katart|[m -> 125, e -> 150, j -> 75] |
//    +---+------+------------------------------+

    val t1 = (1, "Aang", Map("m"->100, "e"->100))
    val t2 = (2, "Katara", Map("m"->95, "e"->100))
    val rdd: RDD[(Int, String, Map[String, Int])] = spark.sparkContext.parallelize(Seq(t1, t2))
    import spark.implicits._
    val df2: DataFrame = rdd.toDF("id", "name", "socres")
    df2.printSchema()
    df2.show()

    df2.createTempView("score")
    spark.sql("select * from score").show(false)
//    +---+------+--------------------+
//    |id |name  |socres              |
//    +---+------+--------------------+
//    |1  |Aang  |[m -> 100, e -> 100]|
//    |2  |Katara|[m -> 95, e -> 100] |
//    +---+------+--------------------+

    spark.close()
  }
}
```

##### 3> HBase

##### 4> Elastic Search

### DataFrame数据运算操作

#### SQL

- 将DataFrame注册为临时视图view，然后对view执行sql
- 临时视图分为session级别视图和global级别视图，session级别视图在session范围内有效，global级别视图在application级别有效

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.sql.{DataFrame, SparkSession}

object DML_SQL {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    val df: DataFrame = spark.read.option("header", true).csv("data/user.csv")
    // 将dataframe注册为临时视图
    df.createTempView("view1")

    import spark.sql

    sql("select * from view1").show()
    sql("select id, name from view1").show()
    sql("select * from view1 order by money desc limit 2").show()

    // 将dataframe注册为全局临时视图，会被绑定到global_temp库中
    df.createGlobalTempView("view2")
    sql("select * from global_temp.view2").show()

    // 全局视图是跨session的
    val spark2 = SparkSession.builder().appName("mytest").master("local[*]").getOrCreate()
//    spark2.sql("select * from global_temp.view1").show()
    spark2.sql("select * from global_temp.view2").show()

    spark2.close()
    spark.close()
  }
}
```

#### DSL

- DSL（domain-specific language 特定领域语言）

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.sql.expressions.Window
import org.apache.spark.sql.{DataFrame, SparkSession}

object DML_SQLapi {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    val df = spark.read.option("inferSchema", true).option("header", true).csv("data/stu.csv")
    val df2 = spark.read.option("header", true).csv("data/stu2.csv")

    df.printSchema()
//    selectOp(spark, df)
//    whereOp(spark, df)
//    groupbyOp(spark, df)
//    joinOp(spark, df, df2)
    windowOp(spark, df)

    spark.close()
  }

  def selectOp(spark:SparkSession,df:DataFrame): Unit = {

    // select方法，可以传入字符串形式的列名来指定要查询的列
    // 字符串形式只能写字段名，不能传表达式
    df.select("id", "name").show()

    // selectExpr方法中可以传入字符串形式表达式
    df.selectExpr("id", "upper(name)", "age + 1").show()

    // select方法，可以传入Column对象来指定要查询的列
    // $符号生生column
    import spark.implicits._
    df.select($"id", $"name").show()
    // 单边单引号生成column
    df.select('id, 'name).show()
    // dataframe的apply方法生成column
    df.select(df("id"), df("name")).show()
    // col函数生成column
    import org.apache.spark.sql.functions._
    df.select(col("id"), col("name")).show()
  }

  def whereOp(spark:SparkSession,df:DataFrame): Unit = {

    // 传入条件表达式
    df.where("id > 3").show()
    df.where("id > 3 and score > 90").show()
    df.where("id > 3 or score > 90").show()
    df.where("id > 3")
      .selectExpr("id", "name", "score + 10 as score")
      .where("score > 80")
      .show()

    // DSL风格的api方法
    import spark.implicits._
    df.where(('id > 3).and(('score > 90))).show()
    df.where('id > 3 and 'score > 90).show()
  }

  def groupbyOp(spark:SparkSession,df:DataFrame): Unit = {

    import spark.implicits._
    // 求每个城市的学生的平均成绩
    df
      .selectExpr("cast(id as int) as id", "name", "cast(age as int) as age", "gender", "city", "cast(score as int) as score")
      .groupBy("city")
      .avg("score")
      .select($"city", $"avg(score)" as "avg_score")
      .show()

    // 求每个城市的每种性别的学生的平均成绩
    df
      .selectExpr("cast(id as int) as id", "name", "cast(age as int) as age", "gender", "city", "cast(score as int) as score")
      .groupBy("city", "gender")
      .avg("score")
      .select($"city", $"gender", $"avg(score)" as "avg_score")
      .show()

    // 求每个城市的学生的总成绩、平均成绩、最高分、最低分
    df.createTempView("stu")
    val sql =
      """
        |select
        |city,sum(score) as sum_score,avg(score) as avg_score,max(score) as max_score,min(score) as min_score
        |from stu
        |group by city
        |""".stripMargin
    spark.sql(sql).show()

    df
      .selectExpr("cast(id as int) as id", "name", "cast(age as int) as age", "gender", "city", "cast(score as int) as score")
      .groupBy("city")
//      .agg("score"->"sum","score"->"avg","score"->"max","score"->"min")
      .agg(("score","sum"),("score","avg"),("score","max"),("score","min"))
      .select($"city",$"sum(score)" as  "sum_score",$"avg(score)" as "avg_score",$"max(score)" as "max_score",$"min(score)" as "min_score")
      .show()
  }

  def joinOp(spark:SparkSession, df1:DataFrame, df2:DataFrame): Unit = {

    // join方式：joinType: String
    // join条件：join列名: usingColumn:String/usingColumns:Seq(String) 有表的join数据不会出现在结果中
    //           join自定义表达式: Column.+(1) === Column df1("id)+1 ===df2("id")

    // 笛卡尔积
    df1.crossJoin(df2).show()

    // join传入一个连接条件（join条件字段在两表中都有且同名）
    df1.join(df2, "id").show()

    // join传入多个连接条件（join条件字段在两表中都有且同名）
    df1.join(df2, Seq("id", "gender")).show()

    // 传入一个自定义的连接条件表达式
    df1.join(df2, df1("id") + 1 === df2("id")).show()

    // 传入join方式类型：inner（默认）、left、right、full、left_semi、left_anti
    df1.join(df2, Seq("id"), "right").show()
    df1.join(df2, df1("id") + 1 === df2("id"), "right").show()
  }

  def windowOp(spark:SparkSession, df:DataFrame): Unit = {

    import spark.implicits._
    val window = Window.partitionBy('city).orderBy('score.desc)

    import org.apache.spark.sql.functions._
    df.select('id, 'name, 'age, 'gender, 'city, 'score, row_number().over(window) as "rn")
      .where('rn <= 2)
      .drop("rn")// 最后结果中不需要rn列，可以drop掉或者用select指定需要的列
//      .select('id, 'name, 'age, 'gender, 'city, 'score)
      .show()

  }
}
```

#### RDD

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{DataFrame, Dataset, Row, SparkSession}

/**
 * df转RDD (比如逻辑不便于用sql实现)
 */
object DML_RDD {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    val df: DataFrame = spark.read.option("inferSchema", true).option("header", true).csv("data/stu.csv")

    // 直接在dataframe上用map等rdd算子
    // 框架会把算子返回的结果rdd转回dataframe(dataset)，需要能对RDD[T]进行解析的Encoder
    // 大部分T类型有隐式的Encoder来支持
    import spark.implicits._
    val ds: Dataset[(Int, String)] = df.map(row => {
      val id = row.getAs[Int]("id")
      val name = row.getAs[String](1)
      (id, name)
    })
    ds.show()

    // dataframe中取出rdd---RDD[Row]
    val rdd: RDD[Row] = df.rdd

    // 从Row中取出数据
    val rdd2: RDD[(Int, String, Int, String, String, Int)] = rdd.map(row => {

      // dataframe是一种弱类型结构，数据被装在Array[Any]中
      // 如果类型取错，编译时是无法检查的，运行时才会报错
//      val name = row.getInt(1)

      // 根据字段脚标取值
      val id: Int = row.getInt(0)
      val name: String = row.getString(1)
      val age = row.getAs[Int](2)

      // 根据字段名取值
      val gender: String = row.getAs[String]("gender")
      val city: String = row.getAs[String]("city")
      val score: Int = row.getAs[Int]("score")

      (id, name, age, gender, city, score)
    })
    rdd2.foreach(println)

    // 从Row中取出数据，使用模式匹配
    val rdd3: RDD[(Int, String, Int, String, String, Int)] = rdd.map({
      case Row(id: Int, name: String, age: Int, gender: String, city: String, score: Int) => {
        (id, name, age, gender, city, score)
      }
    }
    )
    rdd3.foreach(println)

    val res: RDD[(String, Int)] = rdd3.groupBy(_._4).mapValues(iter => {
      iter.map(_._6).sum
    })
    res.foreach(println)

  }
}
```

### 输出存储DataFrame

#### 输出在控制台

```scala
df.show()
```

#### 保存为文件

```scala
    val df: DataFrame = spark.read.option("inferSchema", true).option("header", true).csv("/data/stu.csv")
    val res: DataFrame = df.where("id > 3").select("id", "name")

    // 保存结果为文件：parquet、json、csv、orc、textfile
    res.write.parquet("data/output/parquetfile")
    res.write.csv("data/output/csvfile")
    res.write.orc("data/output/orcfile")
    res.write.json("data/output/jsonfile")

    // 文本文件为自由格式，框架无法判断输出形式
//    res.write.text("data/output/textfile")
    // 要将df输出为文本文件，需要将df变为一个列
    res.selectExpr("concat_ws(',', id, name)")
      .write.text("data/output/textfile")
```

#### 保存到外部存储系统

##### 1> mysql

```scala
    // 将dataframe通过jdbc写入mysql
    val props = new Properties()
    props.setProperty("user", "root")
    props.setProperty("password", "root")
    // 可以通过saveMode来控制写入模式：SaveMode.Append/Ignore/Overwrite/ErrorIfExists（默认）
    // 不需创建表
    res.write.mode(SaveMode.Append).jdbc("jdbc:mysql://localhost:3306/demo?characterEncoding=utf8", "res", props)

```

##### 2> Hive

```scala
    val spark = SparkSession
      .builder()
      .enableHiveSupport()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    // 将dataframe写入hive，保存为hive的表
    // spark要开启hiveSupport支持，spark-hive依赖，hive的配置文件
    res.write.saveAsTable("res")

    // sparksql对分区机制的支持
    // 将dataframe存储为分区结构
    val dfp: DataFrame = spark.read.option("header", true).csv("/data/stu.csv")
    dfp.write.partitionBy("gender").csv("/data/csvfile")
    // 存储结构为：/csvfile/gender=F /csvfile/gender=M
    // 存储文件数据中不再有gender

    // 识别已存在的分区结构
    // 会将所有子目录都理解为数据内容，会将子目录中的gender理解为一个字段
    spark.read.csv("/data/csvfile")
      .toDF("id", "name", "age", "city", "score", "gender")
      .show()

    // 将数据分区写入hive
    // 写入hive的默认文件格式时parquet
    val dfp2: DataFrame = spark.read.option("header", true).csv("/data/stu.csv")
    dfp2.write.partitionBy("gender").saveAsTable("res2")
```

##### 3> NoSql

