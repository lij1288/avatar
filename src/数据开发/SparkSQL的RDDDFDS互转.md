## SparkSQL的RDD/DF/DS互转

### DataFrame/DataSet转RDD

```scala
val rdd1:RDD[Row]=testDF.rdd
val rdd2:RDD[T]=testDS.rdd
```

### RDD转DataFrame

- 用元组把一行的数据写在一起，在toDF中指定字段名

```scala
import spark.implicits._
val testDF = rdd.map {line=>
      (line._1,line._2)
    }.toDF("col1","col2")
```

### RDD转DataSet

```scala
// case class类型的RDD转dataset
import spark.implicits._
val ds: Dataset[Avatar] = spark.createDataset(rdd)
val ds2: Dataset[Avatar] = rdd.toDS()
```

### DataSet转DataFrame

```scala
import spark.implicits._
val testDF:Dataset[Row] = testDS.toDF
```

### DataFrame转DataSet

```scala
import spark.implicits._
// df转成dataset[case class]
val ds: Dataset[Stu] = df.as[Stu]
```


