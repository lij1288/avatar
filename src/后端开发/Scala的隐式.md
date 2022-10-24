## **Scala的隐式**

### 隐式参数

```scala
object ImplicitValueDemo extends App{

  implicit val a: Int = 9

  def m1(x: Int = 5): Int = x * x
  println(m1(3))// 9
  println(m1())// 25

  // 普通方法不能查找执行环境的implicit的值
  def m2(implicit x: Int = 5): Int = x * x
  println(m2(3))// 9
  println(m2())// 25

  // 柯里化方法，参数有默认值
  def kl1(x: Int)(y: Int = 5): Int = x + y
  println(kl1(1)(2))// 3
  println(kl1(1)())// 6
//  println(kl1(1))// 报错，柯里化方法中普通的默认值不能使用

  // 柯里化结合隐式值
  def kl2(x: Int)(implicit y: Int = 5): Int = x + y
  println(kl2(1)(2))// 3
  println(kl2(1)())// 6
  println(kl2(1))// 10. 若没有a，则为6

  // scala的柯里化结合隐式参数，程序中有用implicit修饰的参数
  // 程序执行时，会到程序的执行环境(context)中找用implicit修饰的且参数类型一致的参数传递过来使用，不需要变量名一致
  // 若传递参数，优先使用传递的参数，否则，若有implicit修饰的类型一致的参数，使用该隐式值，若还没有，则使用默认值
  // 程序中有多个用implicit修饰的类型一致的隐式值会报错

  // 隐式参数只能出现在最后一个参数列表
//  def kl3(implicit x: Int)(y: Int): Int = x + y

  def kl3(x: Int)(implicit y: Int, z: Int): Int = x + y + z
  println(kl3(1))// 19

  // 导入隐式参数
//  import MyContext.b
//  import MyContext._
//  def kl4(x: Int)(implicit y: Double = 5.0): Double = x + y
//  println(kl4(1))// 101.0

  // 如果是类，要先new实例，再导入隐式值
  val mc = new MyClass
  import mc._
  def kl5(x: Int)(implicit y: Double = 5.0): Double = x + y
  println(kl5(1))// 11.0
}
```

```scala
object MyContext {
  implicit val b: Double = 100.0
}
```

```scala
class MyClass {
  implicit val c: Double = 10.0
}
```

### 隐式转换

```scala
import scala.runtime.RichInt

object RichIntTest extends App{
  // Int没有to方法，实际调用的是RichInt的方法
  println(1 to 10)// Range(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

  val r: Range.Inclusive = new RichInt(1).to(10)
  println(r)// Range(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
  // implicit def intWrapper(x: Int) = new runtime.RichInt(x)
  // 该隐式方法定义在Predef对象中，会被编译器默认引入
  // 在scala交互式命令行中，可使用 :implicits -v 来查看默认导入的隐式转换
}
```

```scala
import java.io.File

import scala.io.Source

class RichFile(val file: File) {

  def read(): String = {
    Source.fromFile(file).mkString
  }
}
object RichFile {

  def main(args: Array[String]): Unit = {

    // 读取文件的内容，返回一个字符串
    val file = new File("d:/iotest/demo.txt")

    // 显示进行包装
    val richFile = new RichFile(file)
    val content = richFile.read()

    // 不用RichFile包装，直接调用read方法
    import MyContext._
    val str = file.read()
    // 隐式转换的本质，是对类和方法的增强和扩展，是装饰模式的特殊表现形式
    // 程序在编译时，发现调用了file的read方法，但file没有read方法，scala会在程序的context进行查找
    // 查找是否有一个方法或函数，可以将将自身转成另外一种类型，这个另外类型定义了read方法，参数和返回值一致
    // 隐式转换优先使用函数
    println(str)
  }
}
```

```scala
import java.io.File

object MyContext {

  // 定义一个方法，将File转成RichFile
  implicit def file2RichFile(file: File): RichFile = {
    println("method invoked")
    new RichFile(file)
  }

  // 优先使用隐式转换函数，没有找到对应的函数，再找方法
  implicit val fileToRichFile = (file: File) => {
    println("function invoked")
    new RichFile(file)
  }
}
```
