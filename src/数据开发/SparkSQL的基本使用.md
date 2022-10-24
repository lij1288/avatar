## **SparkSQL的基本使用**

- SparkSQL是Spark用来处理结构化数据的一个模块
- SparkSQL提供了一个编程抽象叫做DataFrame/Dataset，可以理解为一个基于RDD数据模型的更高级数据模型，带有结构化元信息（schema），以及sql解析功能

- SparkSQL可以将针对DataFrame/DataSet的各类SQL运算，翻译成RDD的各类算子执行计划，从而大大简化数据运算编程

- SparkSQL的特性
  - 易整合
    - 可以混搭SQL和算子api编程
  - 统一的数据访问方式
    - 为各类不同数据源提供了统一的访问方式，可以跨数据源join
    - 支持的数据源包括：Hive、Avro、CSV、Parquet、ORC、JSON、JDBC等
  - 兼容Hive
    - SparkSQL支持HiveQL语法及Hive的SerDes、UDFs，并允许访问已经存在的Hive数仓数据
  - 标准的数据连接
    - SparkSQL的server模式可为各类BI工具提供行业标准的JDBC/ODBC连接，从而可以为支持标准JDBC/ODBC连接的各类工具提供无缝对接

### 命令行

> bin/spark-shell

### 编程开发

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.SparkContext
import org.apache.spark.sql.{DataFrame, SQLContext, SparkSession}

object SparkSqlDemo {
  def main(args: Array[String]): Unit = {

    // 屏蔽WARN级别以下的日志
    Logger.getLogger("org").setLevel(Level.WARN)

    // 创建一个sparksql的编程入口（包含sparkcontext和sqlcontext）
    val spark: SparkSession = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

//    val sc: SparkContext = spark.sparkContext
//    val sqlsc: SQLContext = spark.sqlContext

    // 加载json数据文件为dataframe
    val df: DataFrame = spark.read.json("data/avatar.json")
//    {"name":"Aang"}
//    {"name":"Katara", "age":14}
//    {"name":"Sokka", "age":15}
//    {"name":"Toph", "age":12}
//    {"name":"Zuko", "age":16}

    // 打印df中的schema元信息
    df.printSchema()
//    root
//    |-- age: long (nullable = true)
//    |-- name: string (nullable = true)

    // 打印df中的数据
    // 参数1：显示行数，参数2：是否截取
    df.show(50, false)
//    +----+------+
//    |age |name  |
//    +----+------+
//    |null|Aang  |
//    |14  |Katara|
//    |15  |Sokka |
//    |12  |Toph  |
//    |16  |Zuko  |
//    +----+------+

    // 在df上，用调api方法的形式实现sql
    df.where("age < 15").show()
//    +---+------+
//    |age|  name|
//    +---+------+
//    | 14|Katara|
//    | 12|  Toph|
//    +---+------+

    // 将df注册成视图，实现sql
    df.createTempView("avatar")
    val res: DataFrame = spark.sql("select * from avatar where age < 15")
    res.show()
//    +---+------+
//    |age|  name|
//    +---+------+
//    | 14|Katara|
//    | 12|  Toph|
//    +---+------+
    spark.close()
  }
}
```

```xml
<dependency>
    <groupId>org.scala-lang</groupId>
    <artifactId>scala-library</artifactId>
    <version>2.11.12</version>
</dependency>

<dependency>
    <groupId>org.apache.spark</groupId>
    <artifactId>spark-sql_2.11</artifactId>
    <version>2.4.4</version>
</dependency>
```

