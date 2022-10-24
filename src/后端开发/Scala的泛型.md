## Scala的泛型

### 逆变、协变

```scala
trait MyFunction[-A, -B, +C] {
  // scala的泛型使用[]
  // 逆变 -A 方法的输入参数类型
  // 协变 +B 方法的返回值类型
  def apply(a: A, b: B): C
}

object TestMyFunction {

  def main(args: Array[String]): Unit = {
    val func = new MyFunction[Int, Double, (Double, Int)] {
      override def apply(a: Int, b: Double): (Double, Int) = (b, a)
    }
    val tp = func.apply(5, 1.3)
    println(tp)
  }
}
```

### 上界、下界

```scala
// [T <: Comparable[T]] 上界
// [T >: Comparable[T]] 下界
class Pair1[T <: Comparable[T]] {

  def greater(first: T, second: T): T = {
    if(first.compareTo(second) > 0) first else second
  }
}

object Pair1 {

  def main(args: Array[String]): Unit = {
    val pair1 = new Pair1[Integer]
    val r1 = pair1.greater(3, 5)
    println(r1)// 5

    val pair2 = new Pair1[String]
    val r2 = pair2.greater("3", "5")
    println(r2)// 5
    // type String = java.lang.String 别名
  }
}
```

### 视图界定

```scala
// 视图界定，可以实现隐式转换
class Pair2[T <% Comparable[T]] {

  def greater(first: T, second: T): T = {
    if(first.compareTo(second) > 0) first else second
  }
}

object Pair2 {

  def main(args: Array[String]): Unit = {

    // 视图界定可以隐式转换，将Int转换为Integer
    val pair = new Pair2[Int]
    val r = pair.greater(3, 5)
    println(r)
  }
}
```

```scala
// 比较规则和类耦合在一起
//class Avatar(val name: String, val age: Int) extends Comparable[Avatar] {
//
//  override def compareTo(o: Avatar): Int = {
//    this.age - o.age
//  }
//  override def toString = s"Avatar($name, $age)"
//}
class Avatar(val name: String, val age: Int) {

  override def toString = s"Avatar($name, $age)"
}
```

```scala
object MyPredef {

  implicit val avatar2OrderedAvatar = (a: Avatar) => new Ordered[Avatar] {
    override def compare(that: Avatar): Int = {
      a.age - that.age
    }
  }
}
```

```scala
// scala中的特质
// Ordered 实现了Comparable接口，对Comparable接口进行了扩展
// Ordering 实现了Comparator接口，对Comparator接口进行了扩展
// 视图界定的目的是为了实现隐式转换，需要传入一个隐式转换的方法或函数
class Pair3[T <% Ordered[T]] {

  def greater(first: T, second: T): T = {

    if(first > second) first else second
  }
}

object Pair3 {

  def main(args: Array[String]): Unit = {

    // Ordering中的隐式转换 Int转成Ordering[Int]
    // Ordered中的隐式转换 Ordering[T]转成Ordered[T]
    val pair1 = new Pair3[Int]
    val r1 = pair1.greater(3, 5)
    println(r1)

    import MyPredef.avatar2OrderedAvatar
    val pair2 = new Pair3[Avatar]
    val r2 = pair2.greater(new Avatar("Aang", 12), new Avatar("Katara", 14))
    println(r2)

  }
}
```

### 上下文界定

```scala
object MyPredef {

  implicit object OrderingAvatar extends Ordering[Avatar] {
    override def compare(x: Avatar, y: Avatar): Int = {
      x.age - y.age
    }
  }
}
```

```scala
// 上下文界定的目的是为了实现隐式转换，需要传入一个隐式的object
class Pair4[T : Ordering] {

  def greater(first: T, second: T): T = {
    // implicitly将Ordering和T关联在一起
    val ord = implicitly[Ordering[T]]
    if(ord.gt(first, second)) first else second
  }
}
object Pair4 {

  def main(args: Array[String]): Unit = {

    import MyPredef.OrderingAvatar// 必须在创建前导入
    val pair1 = new Pair4[Avatar]
    val r1 = pair1.greater(new Avatar("Aang", 12), new Avatar("Katara", 14))
    println(r1)
  }
}
```

### 柯里化结合隐式函数

```scala
object MyPredef {

  implicit val avatar2OrderedAvatar = (a: Avatar) => new Ordered[Avatar] {
    override def compare(that: Avatar): Int = {
      a.age - that.age
    }
  }


  implicit object OrderingAvatar extends Ordering[Avatar] {
    override def compare(x: Avatar, y: Avatar): Int = {
      x.age - y.age
    }
  }
}
```

```scala
// 使用柯里化结合隐式参数，实现隐式转换
class Pair5[T] {

  // 传入一个隐式转换函数
  def greater1(first: T, second: T)(implicit ord: T => Ordered[T]): T = {
    println("function")
    if(first > second) first else second
  }

  // 传入一个隐式object
  def greater2(first: T, second: T)(implicit ord: Ordering[T]): T = {
    println("object")
    if(ord.gt(first, second)) first else second
  }
}
object Pair5 {

  def main(args: Array[String]): Unit = {

    val pair1 = new Pair5[Avatar]
    import MyPredef.avatar2OrderedAvatar// 可以在方法前导入
    val r1 = pair1.greater1(new Avatar("Aang", 12), new Avatar("Katara", 14))
    println(r1)

    import MyPredef.OrderingAvatar
    val r2 = pair1.greater2(new Avatar("Aang", 12), new Avatar("Katara", 14))
    println(r2)
  }
}
```
