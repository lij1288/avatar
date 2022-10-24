## **Scala的基础语法**

### 1. 变量定义

```scala
object VariableDemo {

  def main(args: Array[String]): Unit = {

    // 使用val定义的变量是不可变的，相当于java中用final修饰的变量
    val i = 1

    // 使用var定义的变量是可变的，在scala中建议使用val
    var j = 1.0

    // scala编译器会自动推断变量的类型，必要时可以指定类型
    // 变量名在前，类型在后
    var s:String = "string"
  }
}
```

### 2. 数据类型

- 无包装类型
- 数值类型：Byte、Short、Int、Long、Float、Double、Char
- Boolean类型

### 3. 条件表达式

```scala
object ConditionDemo {

  def main(args: Array[String]): Unit = {

    val x = 1

    val y = if(x > 0) 1 else -1
    println(y)

    // 支持混合类型表达式
    val z = if(x > 0) 1 else "less than zero"
    println(z)

    // 若缺失else，相当于if(x > 0) 1 else ()
    val m = if(x > 0) 1
    println(m)

    // scala中的Unit类，写作()，相当于java中的void
    val n = if(x > 0) 1 else ()
    println(n)

    // else if
    val i = if(x < 0) -1
    else if(x > 0) 1
    else 0
    println(i)
  }
}
```

### 4. 块表达式

```scala
object BlockDemo {

  def main(args: Array[String]): Unit = {

    val i = 0;

    // 块表达式
    val j = {
      if(i < 0){
        -1
      }else if(i > 0){
        1
      }else{
        "zero"
      }
    }
    println(j)// zero
  }
}
```

### 5. 循环

```scala
  def main(args: Array[String]): Unit = {

    for(i <- 1 to 5){
      println(i)
    }

    for(i <- 1 until 5){
      println(i)
    }

    val str = "ABCD"
    for(s <- str){
      println(s)
    }

    val arr = Array(1, 2, 3, 4, 5)
    for(i <- arr){
      println(i)
    }

    var flag = true
    var i = 0
    while(flag){
      val r = arr(i)
      println(r)
      i += 1
      if(i == arr.length){
        flag = false
      }
    }

    // 双重for循环
    for(i <- 1 to 3; j <- 1 to 3 if i != j){
      print((10 * i + j) + " ")
    }
    println()

    // for推导式：如果for循环的循环体以yield开始，则会构建一个新集合
    val result = for(i <- arr) yield i * 10
    println(result.toBuffer)
  }
}
```

### 6. 方法

- a 方法 b 等价于 a.方法(b)

```scala
object MethodDemo {

  def add(x:Int, y:Double): Double = {
    x + y
  }

  // 返回值类型可以不写
  def add2(x:Int, y:Double)={
    x + y
  }

  def add3(x:Int, y:Int*): Int = {
    x + y.sum
  }

  def add4(x:Int*): Int = {
    x.sum
  }
  def main(args: Array[String]): Unit = {

    val i = add(5, 2.5)
    println(i)

    val j = add3(1, 2, 3)
    println(j)

    val k = add4(1, 2, 3)
    println(k)
  }
}
```

```scala
object MethodDemo2 {

  def show1(): Unit = {
    println("show1")
  }

  def show2: Unit ={
    println("show2")
  }

  def main(args: Array[String]): Unit = {

    MethodDemo2.show1()
    MethodDemo2.show1
    show1()
    show1

    MethodDemo2.show2
    show2
  }
}
```

### 7. 函数

- Scala中的函数本质是引用类型，可以作为参数传递到方法中，也可以作为返回值类型

```java
object FunctionDemo1 {

  def main(args: Array[String]): Unit = {

    val f1: (Int, Double) => (Double, Int) = (x: Int, y: Double) => (y, x)
    val f2: (Int, Double) => (Double, Int) = (x, y) => (y, x)
    val f3 = (x: Int, y: Double) => (y, x)

    val f = (x: Int) => x * x
    val arr = Array(1, 2, 3)
    // 将函数作为参数传入方法中
    val a1 = arr.map(f)

    // 匿名函数
    val a2 = arr.map((x: Int) => x * x)
    // scala可以自动推断数组中的类型
    val a3 = arr.map((x) => x * x)
    // 一个参数时可以省略括号
    val a4 = arr.map(x => x * x)

    // 下划线相当于每一次循环取出一个局部变量
    val a5 = arr.filter(_ % 2 == 0).map(Math.pow(_, 2))

    // 函数和方法最大的区别是函数可以作为参数传入方法中，函数本质是一个引用类型
    // 将方法名传入到map方法中
    val a6 = arr.map(m)
  }

  def m(x: Int): Int = {
    x * x
  }
}
```

```java
object FunctionDemo2 {

  def m(x: Int): Int = {
    println("m")
    x * x
  }


  def main(args: Array[String]): Unit = {

    val arr = Array(1, 2, 3)

    val f = m _
//    arr.map(f)
//    arr.map(m _)

    // 方法转换后生成一个新的函数，函数中调用了该方法
    val r = f(5)
    println(r)
  }
}
```

```java
object FunctionDemo3 {

  // 方法接收函数
  def m1(f: Int => String, x: Int) : Unit = {
    val res = f(x)
    println(res)
  }

  def m2(f: (Int, Double) => Double, x: Int, y:Double): Unit = {
    val res = f(x, y)
    println(res)
  }

  def main(args: Array[String]): Unit = {

    m1(x => x.toString + "mohan", 135)

    m2((x, y) => x * y, 3, 2.5)
  }
}
```

```scala
object FunctionDemo {

  // 函数是一个引用类型，是一个接口的实例，函数中有apply方法
  val f1: Function2[Int, Double, (Double, Int)] = new Function2[Int, Double, (Double, Int)] {
    override def apply(v1: Int, v2: Double): (Double, Int) = {
      (v2, v1)
    }
  }
  
  val f2: (Int, Double) => (Double, Int) = (x: Int, y: Double) => (y, x)
  
  val f = (x: Int , y: Double) => (y, x)

  def main(args: Array[String]): Unit = {
    
    f.apply(1, 1.0)
    f(1, 1.0)
  }
}
```
