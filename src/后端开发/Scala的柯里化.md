## **Scala的柯里化**

```scala
object CurryingDemo {

  def m(x: Int, y: Int): Int = {
    x + y
  }

  def kl1(x: Int)(y: Int): Int = {
    x + y
  }

  def kl2(x: Int)(y: Int, z: Int): Int = {
    x + y + z
  }

  def kl3(x: Int)(y: Int)(z: Int): Int = {
    x + y + z
  }

  def main(args: Array[String]): Unit = {

    val r1 = m(3, 5)
    println(r1)// 8

    val r2 = kl1(3)(5)
    println(r2)// 8

    val f1 = kl1(3)_
    println(f1)// <function1>
    val r3 = f1(5)
    println(r3)// 8

    val f2 = kl2(3)_
    println(f2)// <function2>
    val r4 = f2(1, 5)
    println(r4)// 9


    val f3 = kl3(1)_
    println(f3)// <function1>

    val f4 = f3(2)
    println(f4)// <function1>
    val r5 = f4(3)
    println(r5)// 6

    val f5 = kl3(1)(2)_
    println(f5)// <function1>
    val r6 = f5(3)
    println(r6)// 6
  }
}
```


