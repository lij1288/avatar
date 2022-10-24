## **SparkSQL的自定义函数**

### 用户自定义函数UDF

#### 添加相应后缀

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.sql.{DataFrame, SparkSession}

object MyConcat {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    val df: DataFrame = spark.read.option("inferSchema", true).option("header", true).csv("data/stu.csv")
    df.createTempView("stu")

    // 根据gender对name添加后缀
    // 分析函数本质，输入两个字符串, 返回一个拼接结果
//    val myConcat: (String, String) => String = (name:String, gender:String) => {
//      if(gender == "M"){
//        name + "先生"
//      }else{
//        name + "女士"
//      }
//    }
    val myConcat: (String, String) => String = {
      case(x,"M") => x + "先生"
      case(x,"F") => x + "女士"
    }

    // 将这个scala函数注册到sparksql的sql解析引擎中
    spark.udf.register("myFunc", myConcat)

    spark.sql("select id,myFunc(name,gender) as name from stu").show()

  }
}
```

#### 计算余弦相似度

```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.sql.expressions.UserDefinedFunction
import org.apache.spark.sql.{DataFrame, Dataset, Row, SparkSession}

import scala.collection.mutable

/**
 * 自定义函数实现两个向量间的余弦相似度计算
 */
case class People(id:Int, name:String, features:Array[Double])

object CosineSimilarity {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)
    // 加载用户特征数据
    val spark = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

//    id,name,age,height,weight,yanzhi,score
//    1,a,18,172,120,98,68.8
    val df: DataFrame = spark.read.schema(
      """
        |id int,
        |name string,
        |age double,
        |height double,
        |weight double,
        |yanzhi double,
        |score double
        |""".stripMargin).option("header", true).csv("data/features.csv")

    // 将用户特征数据组成一个向量（数组）
    import spark.implicits._
    // 方式1：元组
    val id_name_features = df.rdd.map({
      case Row(id: Int, name: String, age: Double, height: Double, weight: Double, yanzhi: Double, score: Double) => {
        (id: Int, name: String, Array(age, height, weight, yanzhi, score))
      }
    }).toDF("id", "name", "features")

    val id_name_features1: DataFrame = df.map({
      case Row(id: Int, name: String, age: Double, height: Double, weight: Double, yanzhi: Double, score: Double) =>
        (id: Int, name: String, Array(age, height, weight, yanzhi, score))
    }).toDF("id", "name", "features")

    // 方式2：sql中的array函数
    val id_name_features2: DataFrame = df.selectExpr("id", "name", "array(age,height,weight,yanzhi,score) as features")

    // 方式3：case class
    val id_name_features3: DataFrame = df.rdd.map({
      case Row(id: Int, name: String, age: Double, height: Double, weight: Double, yanzhi: Double, score: Double) =>
        People(id: Int, name: String, Array(age, height, weight, yanzhi, score))
    }).toDF()

    // 方式4：row.get
    val id_name_features4: DataFrame = df.rdd.map(row => {
      val id = row.getAs[Int]("id")
      val name = row.getAs[String](1)
      val age = row.getDouble(2)
      val height = row.getDouble(3)
      val weight = row.getDouble(4)
      val yanzhi = row.getDouble(5)
      val score = row.getDouble(6)
      (id, name, Array(age, height, weight, yanzhi, score))
    }).toDF("id", "name", "features")
    id_name_features4

    // 将表自己和自己join，得到每个人和其他所有人的连接行
    // 方式1
    val joined: DataFrame = id_name_features
      .join(id_name_features.toDF("bid", "bname", "bfeatures"),'id < 'bid)

    // 方式2
    id_name_features.createTempView("id_name_features")
    val tmp = spark.sql(
      """
        |select
        |t1.id as t1_id,
        |t1.features as t1_features,
        |t2.id as t2_id,
        |t2.features as t2_features
        |from
        |id_name_features t1 join id_name_features t2
        |on t1.id < t2.id
        |""".stripMargin)

    tmp.createTempView("tmp")
    // 定义一个计算余弦相似度的函数
    // 方式1
    val consineSim = (f1:mutable.WrappedArray[Double], f2:mutable.WrappedArray[Double]) => {
      val denominator1 = Math.pow(f1.map(Math.pow(_,2)).sum, 0.5)
      val denominator2 = Math.pow(f2.map(Math.pow(_,2)).sum, 0.5)
      val numerator = f1.zip(f2).map(tp => tp._1*tp._2).sum
      numerator/(denominator1*denominator2)
    }
    // 方式2
    val consineSim2 = (f1:Seq[Double], f2:Seq[Double]) => {
      val length = f1.length
      var r1 = 0.0
      var r2 = 0.0
      var r3 = 0.0
      for(i <- 0 until length){
        r1 += f1(i)*f2(i)
        r2 += f1(i)*f1(i)
        r3 += f2(i)*f2(i)
      }
      val d = r1/(Math.pow(r2, 0.5) * Math.pow(r3, 0.5))
      d
    }
    spark.udf.register("cosine_sim",consineSim)

    // 计算两人之间的余弦相似度
    spark.sql(
      """
        |select
        |t1_id as id1,
        |t2_id as id2,
        |cosine_sim(t1_features, t2_features) as cosine_sim
        |from
        |tmp
        |""".stripMargin).show(false)

    // 包装为能生成column结果的dsl风格函数
    import org.apache.spark.sql.functions._
    val cosSim: UserDefinedFunction = udf(consineSim)
    tmp.select('t1_id as 'id1, 't2_id as 'id2, cosSim('t1_features,'t2_features) as "cos_sim").show()

    spark.close()
  }
}
```

### 用户自定义聚合函数UDAF

#### 计算平均值

```scala
import org.apache.spark.sql.Row
import org.apache.spark.sql.expressions.{MutableAggregationBuffer, UserDefinedAggregateFunction}
import org.apache.spark.sql.types.{DataType, DataTypes, StructField, StructType}

/**
 * 自定义UDAF，求薪资平均值
 */
object MyAvgUDAF extends UserDefinedAggregateFunction{

  // 函数输入的字段schema（字段名-字段类型）
  override def inputSchema: StructType = StructType(Seq(StructField("salary", DataTypes.DoubleType)))

  // 聚合过程中，用于存储局部聚合结果的schema（局部数据薪资总和，局部数据人数总和）
  override def bufferSchema: StructType = StructType(Seq(
    StructField("sum", DataTypes.DoubleType),
    StructField("cnts", DataTypes.LongType)
  ))

  // 最终返回结果的数据类型
  override def dataType: DataType = DataTypes.DoubleType

  // 函数是否稳定一致（对一组相同的输入，永远返回相同的结果）
  override def deterministic: Boolean = true

  // 对局部聚合缓存的初始化方法
  // abstract class MutableAggregationBuffer extends Row
  override def initialize(buffer: MutableAggregationBuffer): Unit = {
    buffer.update(0,0.0)
    buffer.update(1,0L)
  }

  // 聚合逻辑所在方法，框架会不断传入一个新的输入Row，来更新聚合缓存数据
  override def update(buffer: MutableAggregationBuffer, input: Row): Unit = {
    // 从输入中获取薪资，加到buffer的第一个字段上
    buffer.update(0, buffer.getDouble(0) + input.getDouble(0))
    // buffer的第一个字段加1
    buffer.update(1, buffer.getLong(1) + 1)
  }

  // 全局聚合，将局部缓存中的数据聚合成一个缓存（薪资累加，人数累加）
  override def merge(buffer1: MutableAggregationBuffer, buffer2: Row): Unit = {
    // 更新薪资，将两个buffer的第一个字段累加，更新回buffer1
    buffer1.update(0, buffer1.getDouble(0) + buffer2.getDouble(0))
    // 更新人数
    buffer1.update(1, buffer1.getLong(1) + buffer2.getLong(1))
  }

  // 最终输出（从全局缓存中取薪资总和/人数总和）
  override def evaluate(buffer: Row): Any = {
    if(buffer.getLong(1) != 0)
      buffer.getDouble(0)/buffer.getLong(1)
    else
      0.0
  }
}
```



```scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.sql.SparkSession

object MyAygUDAF_Test {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.WARN)

    val spark = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    val df = spark.createDataFrame(List(
      (1,"a","F",1000.0),
      (2,"b","M",2000.0),
      (3,"c","F",3000.0),
      (4,"d","M",4000.0),
      (5,"e","F",5000.0),
      (6,"f","M",5000.0),
      (7,"g","F",5000.0)
    )).toDF("id", "name", "gender", "salary")

    df.createTempView("user")

    spark.udf.register("myavg", MyAvgUDAF)

    spark.sql(
      """
        |select
        |gender,
        |myavg(salary) as avg_salary
        |from user
        |group by gender
        |""".stripMargin).show()

    spark.close()
  }
}
```

#### 计算同比增长

```scala
import java.sql.{Date, Timestamp}

import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{DataFrame, Row, SparkSession}
import org.apache.spark.sql.expressions.{MutableAggregationBuffer, UserDefinedAggregateFunction}
import org.apache.spark.sql.types.{DataType, DataTypes, StructField, StructType}

/**
 * 自定义UDAF，求同比增长
 */
class YearOnYearSales(dateRange:DateRange) extends UserDefinedAggregateFunction{

  override def inputSchema: StructType = StructType(Seq(
    StructField("sale_date", DataTypes.DateType),
    StructField("sale_amt", DataTypes.DoubleType)
  ))

  override def bufferSchema: StructType = StructType(Seq(
    StructField("start_amt", DataTypes.DoubleType),
    StructField("end_amt", DataTypes.DoubleType)
  ))

  override def dataType: DataType = DataTypes.DoubleType

  override def deterministic: Boolean = true

  override def initialize(buffer: MutableAggregationBuffer): Unit = {
    buffer.update(0, 0.0)
    buffer.update(1, 0.0)
  }

  override def update(buffer: MutableAggregationBuffer, input: Row): Unit = {
    if(dateRange.contain(input.getDate(0))){
      buffer.update(1, buffer.getDouble(1) + input.getDouble(1))
    }
    val preStart = dateRange.startDate.toLocalDateTime.minusYears(1)
    val preEnd = dateRange.endDate.toLocalDateTime.minusYears(1)
    val preRange = DateRange(Timestamp.valueOf(preStart), Timestamp.valueOf(preEnd))
    if(preRange.contain(input.getDate(0))){
      buffer.update(0, buffer.getDouble(0) + input.getDouble(1))
    }

  }

  override def merge(buffer1: MutableAggregationBuffer, buffer2: Row): Unit = {
    buffer1.update(0, buffer1.getDouble(0) + buffer2.getDouble(0))
    buffer1.update(1, buffer1.getDouble(1) + buffer2.getDouble(1))
  }

  override def evaluate(buffer: Row): Any = {
    if(buffer.getDouble(0) == 0){
      0.0
    }else{
      (buffer.getDouble(1) - buffer.getDouble(0))/buffer.getDouble(0) * 100
    }
  }
}

case class DateRange(startDate: Timestamp, endDate: Timestamp){
  def contain(targetDate: Date): Boolean = {
    targetDate.after(startDate) && targetDate.before(endDate)
  }
}

object YearOnYearTest{
  def main(args: Array[String]): Unit = {

    val spark = SparkSession
      .builder()
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

    val sc = spark.sparkContext

    val sales = Seq(
      (1, 1000.0, "2018-03-18"),
      (2, 1135.0, "2018-05-20"),
      (3, 1200.0, "2018-08-15"),
      (4, 1250.0, "2018-12-25"),
      (5, 1288.0, "2019-02-11"),
      (6, 1372.0, "2019-04-25"),
      (7, 1500.0, "2019-09-27"),
      (8, 1750.0, "2019-10-18")
    )
    val salesRDD: RDD[(Int, Double, String)] = sc.parallelize(sales)
    import spark.implicits._
    val salesDF: DataFrame = salesRDD.toDF("id", "sales", "saleDate")
    salesDF.createTempView("sales")
    val dateRange = DateRange(Timestamp.valueOf("2019-01-01 00:00:00"), Timestamp.valueOf("2019-12-31 23:59:29"))
    val yearOnYearSales = new YearOnYearSales(dateRange)
    spark.udf.register("year_on_year", yearOnYearSales)

    spark.sql(
      """
        |select
        |year_on_year(saleDate,sales)
        |from
        |sales
        |""".stripMargin).show(false)

    spark.close()
  }

}
```


