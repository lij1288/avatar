## Scala的面向对象

### 1. 类和对象

#### 1.1 类与伴生对象

```scala
class Person1 {

  // val修饰的变量有getter没有setter
  val id: String = "001"
  // var修饰的变量有getter和setter
  var name: String = "mohan"
  // 类私有字段，只能在类中和伴生对象中使用
  private var age: Int = 25
  // 对象私有字段，只能在类中使用
  private[this] var addr: String = "beijing"

  def show(): Unit ={
    println(this.age)
    println(this.addr)
  }

  // 类和伴生对象可以相互访问private修饰的变量和方法
  // private[this]如果在class中定义，则只能在class中使用
  // private[this]如果在object中定义，则只能在object中使用
}

object Person1 {// 与类名相同的对象叫做伴生对象

  def main(args: Array[String]): Unit = {
    val p = new Person1

    println(p.age)
    p.show()
  }
}
```

#### 1.2 构造器

```scala
//class Person2 private (val name:String, var age:Int) {
class Person2(val name:String, var age:Int) {

  // 主构造器会执行类定义中的所有语句
  println("执行主构造器")

  private var grade: String = _

  // 辅助构造器
  def this(name: String, age: Int, grade: String){
    this(name, age)// 辅助构造器必须以主构造器或其他辅助构造器的调用开始
    println("执行辅助构造器")
    this.grade = grade
  }
}

object Person2 {

  def main(args: Array[String]): Unit = {

    val p = new Person2("mohan",25, "16")
  }
}
```

#### 1.3 单例对象

```scala
import scala.collection.mutable.ArrayBuffer

object SingletonDemo {

  def main(args: Array[String]): Unit = {
    
    val session = SessionFactory.getSession()
    println(session)
  }
}

object SessionFactory{

  var count = 5;
  val sessions = new ArrayBuffer[Session]()
  while (count > 0) {
    sessions += new Session()
    count -= 1
  }

  def getSession: Session = {
    sessions.remove(0)
  }
}
class Session{

}
```

#### 1.4 apply方法

```scala
object ApplyDemo {

  def apply(): Unit ={
    println("apply")
  }

  def apply(x: Int): Unit ={
    println("apply" + x)
  }

  def main(args: Array[String]): Unit = {

    // 静态对象名+()，调用对应的apply方法
    ApplyDemo.apply()
    apply()
    ApplyDemo.apply(135)
    apply(389)
    
    val arr = Array(1, 2, 3)
  }
}
```

#### 1.5 应用程序对象

```scala
object AppObjectDemo extends App {

  println("App")
}
```

### 2. 继承

```scala
object Demo {

  def main(args: Array[String]): Unit = {

    val subDemo = new SubDemo()
    subDemo.supMethod1()
    subDemo.supMethod2()
    subDemo.infMethod1()
    subDemo.infMethod2()
  }
}

class SubDemo extends SupDemo with InterfaceDemo {

  // 重写抽象方法override修饰符可不加
  // 重写非抽象方法必须加override修饰符
  def supMethod1(): Unit = {
    println("重写父类抽象方法")
  }
  override def supMethod2(): Unit = {
    println("重写父类非抽象方法")
  }
  def infMethod1(): Unit = {
    println("重写接口抽象方法")
  }
  override def infMethod2(): Unit = {
    println("重写接口非抽象方法")
  }
}
// 实现第一个接口使用extends
class SubDemo2 extends InterfaceDemo with InterfaceDemo2 {
  override def infMethod1(): Unit = {
    println("...")
  }
  override def infMethod3(): Unit = {
    println("...")
  }
}
// 实现多个接口
class SubDemo3 extends SupDemo with InterfaceDemo with InterfaceDemo2 {
  override def supMethod1(): Unit = {
    println("...")
  }
  override def infMethod1(): Unit = {
    println("...")
  }
  override def infMethod3(): Unit = {
    println("...")
  }
}
abstract class SupDemo {
  def supMethod1(): Unit
  def supMethod2(): Unit = {
    println("SupMethod2")
  }
}

trait InterfaceDemo {
  def infMethod1(): Unit
  def infMethod2(): Unit = {
    println("InterfaceMethod2")
  }
}
trait InterfaceDemo2 {
  def infMethod3(): Unit
}
```

```scala
object Demo {

  def main(args: Array[String]): Unit = {

    val subDemo = new SubDemo with InterfaceDemo {
      override def infMethod(): Unit = {
        println("动态实现接口")
      }
    }

    subDemo.infMethod()
  }
}

class SubDemo{

}

trait InterfaceDemo {
  def infMethod(): Unit
}
```
