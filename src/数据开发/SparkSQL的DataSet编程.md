## **SparkSQL的DataSet编程**

- type DataFrame = Dataset[Row]
- DataFrame是一个具备schema信息和sql解析功能（编解码器Encoder）的RDD[Row]
- DataSet是一个具备schema信息和sql解析功能（编解码器Encoder）的RDD[T]
- T可以为任意类型，但需要有对应编解码器Encoder的支持，框架对基本数据类型、case class类型、product类型提供了预定义好的Encoder

### 创建DataSet

#### 从RDD创建

##### 1> RDD[case class]

```scala
    // 创建case class的RDD
    val rdd = spark.sparkContext.parallelize(Seq(
      Avatar(1, "Aang"),
      Avatar(2, "Katara")
    ))
    // case class类型的RDD转dataset
    import spark.implicits._
    val ds: Dataset[Avatar] = spark.createDataset(rdd)
    val ds2: Dataset[Avatar] = rdd.toDS()
    ds.printSchema()
    ds.show()
//    root
//    |-- id: integer (nullable = false)
//    |-- name: string (nullable = true)
//
//    +---+------+
//    | id|  name|
//    +---+------+
//    |  1|  Aang|
//    |  2|Katara|
//    +---+------+
```

##### 2> RDD[JavaBean]

```scala
    val spark = SparkSession
      .builder()
      // 启用kryo作为spark的序列化框架（默认使用的是java的serializable）
      .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
      .appName(this.getClass.getSimpleName)
      .master("local[*]")
      .getOrCreate()

// 创建javabean的rdd
    // 隐式转换中没有支持对javabean的encoder机制
    // 需要自己传入一个encoder
    // 可以构造一个简单的encoder，具备序列化功能，但是不具备字段解构功能
    // 后续可以通过RDD的map算子将数据从对象中提取出来，组装为元组，然后toDF使用sql操作
    val rdd2 = spark.sparkContext.parallelize(Seq(
      new JavaAvatar(1, "Aang"),
      new JavaAvatar(2, "Katara")
    ))
    val encoder: Encoder[JavaAvatar] = Encoders.kryo(classOf[JavaAvatar])
    val ds3: Dataset[JavaAvatar] = spark.createDataset(rdd2)(encoder)

    val df3 = ds3.map(a => (a.getId, a.getName)).toDF("id", "name")
    ds3.printSchema()
    ds3.show()
    df3.printSchema()
    df3.show()
//    root
//    |-- value: binary (nullable = true)
//
//    +--------------------+
//    |               value|
//    +--------------------+
//    |[01 00 63 6F 6D 2...|
//    |[01 00 63 6F 6D 2...|
//    +--------------------+
//
//    root
//    |-- id: integer (nullable = false)
//    |-- name: string (nullable = true)
//
//    +---+------+
//    | id|  name|
//    +---+------+
//    |  1|  Aang|
//    |  2|Katara|
//    +---+------+
```

##### 3> RDD[其他类]

```scala
    // 将RDD[Map]转为Dataset[Map]
    val rdd3: RDD[Map[String, String]] = spark.sparkContext.parallelize(Seq(
      Map("id" -> "1", "name" -> "Aang"),
      Map("id" -> "2", "name" -> "Katara")
    ))
    val ds4: Dataset[Map[String, String]] = rdd3.toDS()
    ds4.printSchema()
    ds4.show()
//    root
//    |-- value: map (nullable = true)
//    |    |-- key: string
//    |    |-- value: string (valueContainsNull = true)
//
//    +--------------------+
//    |               value|
//    +--------------------+
//    |[id -> 1, name ->...|
//    |[id -> 2, name ->...|
//    +--------------------+
```

#### 将DataFrame转为DataSet

- DataFrame中装的是统一的类型：Row
- DataSet中装的是自定义的类型
- DF转DS需要将数据从Row中抽取出来，放入自定义的类型中

```scala
    val df: DataFrame = spark.read.option("inferSchema", true).option("header", true).csv("data/stu.csv")

    import spark.implicits._
    // df转成dataset[case class]
    val ds: Dataset[Stu] = df.as[Stu]
    ds.printSchema()
    ds.show()

    // df转成dataset[tuple]
    val ds2: Dataset[(Int, String, Int, String, String, Int)] = df.as[(Int, String, Int, String, String, Int)]
    ds2.printSchema()
    ds2.show()
```

### DataSet和DataFrame的区别

- DataSet中装的是自定义的类型，抽取数据时比较方便（bean.id）且会得到编译时检查
- DataFrame中装的时Row（框架内置的一个通用类型），抽取数据时需要通过脚标或字段名，还需要强转
- DataSet一旦经过运算操作，返回值只能回到DataFrame

```scala
    // dataset存在的意义
    // ds的特点是，可以存储各种自定义类型，字段有类型约束
    // df只能存储row类型，row类型中的字段没有类型约束
    // 差别体现在ds/df退化为RDD进行操作时
//    ds.map(bean => {
//      // 提取数据时不会产生类型匹配错误，编译时就会检查
////      val id: String = bean.id
//    })
//
//    df.map(row => {
//      // 类型不匹配，编译时无法检查，运行时抛异常
////      val name: Int = row.getInt(1)
//    })
```

### DataSet数据运算操作

- 与DataFrame一样

```scala
    // ds的sql操作和df的是一样的
    // ds经过sql操作后，返回的都是dataframe
    val df1: DataFrame = ds2.select("id", "name")
    val df2: DataFrame = ds2.selectExpr("id+10", "upper(name)")
    val df3: DataFrame = ds2.join(ds2, Seq("id"), "inner")

    // 可以将ds注册为view
    ds2.createTempView("ds2")
    spark.sql("select * from ds2 where id>3")
```

