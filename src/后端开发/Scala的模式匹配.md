## **Scala的模式匹配**

匹配基本类型内容，示例字符串

```scala
object CaseDemo1 extends App {
  val str = "scala"
  str match {
    case "hadoop" => println("HADOOP")
    case "scala" => println("SCALA")
    case "java" => println("JAVA")
  }
}
```

匹配类型

```scala
object CaseDemo2 extends App {
  val arr = Array(1, "abc", CaseDemo2)
  val test = arr(1)
  test match {
    case x: Int => println("Int " + x)
    case y: String => println("String " + y)
    case CaseDemo2 => println("case demo 2")
    case _ => println("default")
  }
}
```

匹配数组、集合、元组

```scala
object CaseDemo3 extends App {
  // 匹配数组
  val arr = Array(1, 2, 8, 8)
  arr match {
    case Array(1, 3, x, y) => println(s"x:$x, y:$y")
    case Array(1, _, _, x) => println(s"x:$x")
    case Array(1, _*) => println("1 ...")
    case _ => println("default")
  }

  // 匹配List
  val lst = List(1, 3, 5)
  println(lst.head)// 1
  println(lst.tail)// List(3, 5)
  lst match {
    case 0::Nil => println("0 ...")
    case x::y => println(s"x:$x, y:$y")
    case 1::a => println(s"1 ...$a")
  }

  // 匹配元组
  val tp =(3, 8, 9)
  tp match {
    case (1, x, y) => println(s"match $x, $y")
    case (_, 8, x) => println(x)
    case _ => println("default")
  }
}
```

Scala中列表要么为空（Nil表示空列表）要么为head加tail

1::LIst(3, 5) --- ::操作符使用给定的head和tail创建一个新列表

### 样例类

case class主要用于模式匹配，可以不用new，已经实现了序列化接口，多实例，有状态的，可以用于封装数据

case object主要用于模式匹配，已经实现了序列化接口，单例的，没状态的

case class和case object是编译器本身优化的，比if判断效率更高

```scala
case class SubmitTask(id: String, name: String)

case class HeartBeat()

case object CheckTimeOutTask

object CaseDemo4 extends App {
  val arr = Array(new SubmitTask("001", "Aang"), SubmitTask("002", "Katara"), HeartBeat(), CheckTimeOutTask)

  val a = arr(1)

  a match {
    case SubmitTask(i, n) => println(i)
    case HeartBeat() => println("heartbeat")
    case CheckTimeOutTask => println("checktimeouttask")
  }
}
```

### Option

Option类型样例类用来表示可能存在或也可能不存在的值（Option的子类有Some和None）

Some包装了某个值，None表示没有值

Some是一个case class，None是一个case object

> sealed abstract class Option\[+A]() extends scala.AnyRef with scala.Product with scala.Serializable

sealed密封类提供了一种约束：不能在类定义的文件之外定义任何新的子类，子类都明确的情况下，防止继承滥用

```scala
object OptionDemo extends App {
  val m = Map("a" -> 1, "b" -> 2)

  val o: Option[Int] = m.get("c")

  val r1: Any = o match {
    // 没有取到对应的value
    case None => {
      null
    }
    // 取到了对应的value
    case Some(i) => {
      i
    }
  }
  println(r1)

  val r2: Any = m.getOrElse("c", null)
  println(r2)
}
```

### 偏函数

被包在花括号内没有match的一组case语句是一个偏函数，是PartialFunction[A, B]的一个实例，A代表参数类型，B代表返回类型，常用作输入模式匹配

```scala
object PartialFuncDemo {

  def pf: PartialFunction[String, Int] = {
    case "A" => {
      println("A")
      1
    }
    case "B" => {
      2
    }
    case _ => {
      -1
    }
  }

  def pf2: PartialFunction[String, Unit] = {
    case "A" => println("A")
    case "B" => println("B")
    case _ => println("000")
  }
	
  // 实现类似偏函数功能  
  def func(num: String): Int = num match {
    case "A" => 1
    case "B" => 2
    case _ => -1
  }

  def main(args: Array[String]): Unit = {
    println(pf("A"))
    println(func("A"))
  }
}
```
