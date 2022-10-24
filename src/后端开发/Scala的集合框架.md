## Scala的集合框架

### 1. Array

#### 1.1 Array

```scala
object ArrayDemo {

  def main(args: Array[String]): Unit = {
    
    val arr1 = new Array[Int](3)
    println(arr1.toBuffer)// ArrayBuffer(0, 0, 0)

    val arr2 = Array(1, 3, 5)
    println(arr2.toBuffer)// ArrayBuffer(1, 3, 5)

    val arr3 = Array(1, 2, 3.0)
    println(arr3.toBuffer)// ArrayBuffer(1.0, 2.0, 3.0) --- Double类型

    val arr4 = Array(1, 2, "string")
    println(arr4.toBuffer)// ArrayBuffer(1, 2, string) --- Any类型

    val arr = Array(3, 1, 5, 4, 2)
    val sum = arr.sum
    println(sum)// 15
    val max = arr.max
    println(max)// 5
    val sorted = arr.sorted
    println(sorted.toBuffer)// ArrayBuffer(1, 2, 3, 4, 5)
  }
}
```

#### 1.2 ArrayBuffer

```scala
import scala.collection.mutable.ArrayBuffer

object ArrayBufferDemo {

  def main(args: Array[String]): Unit = {

    val ab = new ArrayBuffer[Int]()
    ab += 1
    ab += (3,5)
    ab ++= Array(3, 8, 9)
    println(ab)// ArrayBuffer(1, 3, 5, 3, 8, 9)

    ab.insert(1,9,6,9)
    println(ab)// ArrayBuffer(1, 9, 6, 9, 3, 5, 3, 8, 9)

    ab(2) = 8
    println(ab)// ArrayBuffer(1, 9, 8, 9, 3, 5, 3, 8, 9)

    ab -= 9
    println(ab)// ArrayBuffer(1, 8, 9, 3, 5, 3, 8, 9)

    ab.remove(1,2)
    println(ab)// ArrayBuffer(1, 3, 5, 3, 8, 9)
  }
}
```

### 2. List

#### 2.1 不可变List

```scala
object ListDemo {

  def main(args: Array[String]): Unit = {

    val lst = List(1, 3, 5, 3, 8, 9)
    println(lst)// List(1, 3, 5, 3, 8, 9)

    val i = lst(5)
    println(i)// 9

    val sorted = lst.sorted
    println(sorted)// List(1, 3, 3, 5, 8, 9)

    val lst2 = lst :+ 10
    println(lst2)// List(1, 3, 5, 3, 8, 9, 10)
    println(lst)// List(1, 3, 5, 3, 8, 9)
  }
}
```

#### 2.2 可变List

```scala
import scala.collection.mutable.ListBuffer

object ListDemo2 {

  def main(args: Array[String]): Unit = {

    val lb = new ListBuffer[Int]
    lb += 1
    lb += (1, 3, 5)
    lb ++= List(3, 8, 9)
    lb -= 1
    println(lb)// ListBuffer(1, 3, 5, 3, 8, 9)

  }
}
```

### 3. Set

#### 3.1 不可变Set

```scala
object SetDemo {

  def main(args: Array[String]): Unit = {

    val s = Set(1, 3, 5, 3, 8, 9)
    println(s)// Set(5, 1, 9, 3, 8)

//    val bool = s.contains(5)
    val bool = s(5)
    println(bool)// true

    for(i <- s){
      println(i)// 5 1 9 3 8
    }
  }
}
```

#### 3.2 可变Set

```scala
import scala.collection.mutable

object SetDemo2 {

  def main(args: Array[String]): Unit = {

    val s = mutable.Set(1, 3, 5, 3, 8, 9)
    println(s)// Set(9, 1, 5, 3, 8)

    s += 6
    println(s)// Set(9, 1, 5, 6, 3, 8)

    s -= 3
    println(s)// Set(9, 1, 5, 6, 8)

//    val bool = s.contains(5)
    val bool = s(5)
    println(bool)// true

    for(i <- s){
      println(i)// 9 1 5 6 8
    }

    val s2 = new mutable.HashSet[Int]
    s2 += 1
    s2 += (3, 5)
    s2 ++= Set(3, 8, 9)
    println(s2)// Set(9, 1, 5, 3, 8)

    val s3 = new mutable.LinkedHashSet[Int]
    s3 += 3
    s3 += (5, 1, 2, 4)
    println(s3)// Set(3, 5, 1, 2, 4)

    val s4 = new mutable.TreeSet[Int]()
    s4 += 3
    s4 += (5, 1, 2, 4)
    println(s4)// TreeSet(1, 2, 3, 4, 5)

    val s5 = new mutable.TreeSet[String]()
    s5 += "100"
    s5 += "20"
    s5 += "15"
    println(s5)// TreeSet(100, 15, 20)
  }
}
```

### 4. Map

#### 4.1 不可变Map

```scala
object MapDemo {

  def main(args: Array[String]): Unit = {

    val m = Map("a" -> 1, "b" -> 2, "c" -> 3)
    println(m)// Map(a -> 1, b -> 2, c -> 3)

    val v1 = m.get("a")
    println(v1)// Some(1)

    val v2 = m.getOrElse("n", -1)
    println(v2)// -1
  }
}
```

#### 4.2 可变Map

```scala
import scala.collection.immutable.TreeMap
import scala.collection.mutable

object MapDemo2 {

  def main(args: Array[String]): Unit = {

    val m = mutable.Map("a" -> 1, "b" -> 2, "c" -> 3)
    println(m)// Map(b -> 2, a -> 1, c -> 3)

    m("a") = 11
    m.put("d", 4)
    m("e") = 5
    m += "c" -> 33
    m += "f" -> 5
    m += (("g", 6), ("h", 7))
    m ++= Map(("i", 8), "j" -> 9)
    println(m)// Map(e -> 5, h -> 7, b -> 2, j -> 9, d -> 4, g -> 6, a -> 11, i -> 8, c -> 33, f -> 5)

    m -= "a"
    m.remove("c")
    println(m)// Map(e -> 5, h -> 7, b -> 2, j -> 9, d -> 4, g -> 6, i -> 8, f -> 5)

    val m2 = new mutable.HashMap[String, Int]()
    m2 += (("c", 3), ("a", 1), ("b", 2))
    println(m2)// Map(b -> 2, a -> 1, c -> 3)

    val m3 = new mutable.LinkedHashMap[String, Int]
    m3 += (("c", 3), ("a", 1), ("b", 2))
    println(m3)// Map(c -> 3, a -> 1, b -> 2)

    val m4 = TreeMap[String, Int]("c" -> 3, "a" -> 1, "b" -> 2)
    println(m4)// Map(a -> 1, b -> 2, c -> 3)
  }
}
```

### 5. 元组

```scala
object TupleDemo {

  def method(x:Int, y:Double)= {
    val x1 = x * 3
    val y1 = y * 5
    val z1 = "string"
    (x1, y1, z1)
  }

  def main(args: Array[String]): Unit = {

    val tp: (Int, Double, String) = method(1, 5)
    println(tp)// (3,25.0,string)
    val v1 = tp._1
    println(v1)// 3
  }
}
```

### 6. 集合常用方法

```scala
object ListDemo1 {

  def main(args: Array[String]): Unit = {

    val lst = List(9, 1, 3, 5, 4, 2, 6 ,8 ,7)

    val lst1 = lst.map(x => x * 10)
    // List(90, 10, 30, 50, 40, 20, 60, 80, 70)

    val lst2 = lst.filter(x => x % 2 == 0)
    // List(4, 2, 6, 8)

    val lst3 = lst.sorted
    // List(1, 2, 3, 4, 5, 6, 7, 8, 9)

    val lst4 = lst.sortBy(x => x)
    // List(1, 2, 3, 4, 5, 6, 7, 8, 9)

    val lst5 = lst.sortWith((x, y) => x < y)
    // List(1, 2, 3, 4, 5, 6, 7, 8, 9)

    val lst6 = lst.reverse
    // List(7, 8, 6, 2, 4, 5, 3, 1, 9)

    val it = lst.grouped(4)
    // non-empty iterator

    val lst7 = it.toList
    // List(List(9, 1, 3, 5), List(4, 2, 6, 8), List(7))

    val lst8 = lst7.flatten
    // List(9, 1, 3, 5, 4, 2, 6, 8, 7)

    val arr = Array("a b c", "d e f", "h i j")
    val arr1 = arr.flatMap(_.split(" "))
    // ArrayBuffer(a, b, c, d, e, f, h, i, j)

    val i1 = lst.reduce(_ + _)
    // 45

    val i2 = lst.fold(100)(_ + _)
    // 145

    val sum = lst.par.sum
    // 45

    val i3 = lst.par.reduce((x, y) => x + y)
    // 45

    val i4 = lst.par.fold(100)((x, y) => x + y)
    // 845/945

    val list = List(List(1, 3, 5), List(3, 8 ,9), List(6))

    val i6 = list.aggregate(10)(_ + _.sum, _ + _)
    // 45

    val l1 = List(1, 3, 5)
    val l2 = List(3, 8, 9)

    val r1 = l1.union(l2)
    // List(1, 3, 5, 3, 8, 9)

    val r2 = l1.intersect(l2)
    // List(3)

    val r3 = l1.diff(l2)
    // List(1, 5)
  }
}
```

```scala
object ListDemo2 {

  def main(args: Array[String]): Unit = {

    val arr = Array(9, 1, 3, 5, 4, 2, 6 ,8 ,7)

    val max = arr.max
    println(max)

    val min = arr.min
    println(min)

    val sum = arr.sum
    println(sum)

    val avg = sum.toDouble/arr.length
    println(avg)


    val r1 = arr.reduce((x, y) => x + y)
    val r2 = arr.reduceLeft((x, y) => x + y)
    val r3 = arr.reduce(_ + _)

    val r4 = arr.fold(100)(_ + _)
    val r5 = arr.foldLeft(100)(_ + _)
    val r6 = arr.foldRight(100)(_ + _)
  }
}
```

### 7. MyList

#### MyFunction.java

```java
public interface MyFunction<T, R> {
    R apply(T t);
}
```

#### MyFunction2.java

```java
public interface MyFunction2<T, W, R> {
    R apply(T t, W w);
}
```

#### MyTraversable.java

```java
import java.util.List;

public interface MyTraversable<T> {

    <R> List<R> map(MyFunction<T, R> func);

    List<T> filter(MyFunction<T, Boolean> func);

    T reduce(MyFunction2<T, T, T> func);
}
```

#### MyList.java

```java
import java.util.ArrayList;

public class MyList<T> extends ArrayList<T> implements MyTraversable<T>{

    @Override
    public <R> MyList<R> map(MyFunction<T, R> func) {
        MyList<R> newLst = new MyList<>();
        for (T t : this) {
            R r = func.apply(t);
            newLst.add(r);
        }
        return newLst;
    }

    @Override
    public MyList<T> filter(MyFunction<T, Boolean> func) {
        MyList<T> newLst = new MyList<>();
        for (T t : this) {
            Boolean flag = func.apply(t);
            if (flag){
                newLst.add(t);
            }
        }
        return newLst;
    }

    @Override
    public T reduce(MyFunction2<T, T, T> func) {
        T sum = null;
        boolean isFirst = true;
        for (T t : this) {
            if(isFirst){
                sum = t;
                isFirst = false;
            }else {
                sum = func.apply(sum, t);
            }
        }
        return sum;
    }
}
```

#### MyListTest.java

```java
public class MyListTest {

    public static void main(String[] args) {

        MyList<Integer> nums = new MyList<>();
        nums.add(1);
        nums.add(2);
        nums.add(3);
        nums.add(4);
        nums.add(5);
        MyList<Double> r1 = nums.map(new MyFunction<Integer, Double>() {
            @Override
            public Double apply(Integer i) {
                return i * 10.0;
            }
        });
        System.out.println(r1);

        MyList<Integer> r2 = nums.filter(new MyFunction<Integer, Boolean>() {
            @Override
            public Boolean apply(Integer i) {
                return i % 2 == 0;
            }
        });
        System.out.println(r2);

        Integer r3 = nums.reduce(new MyFunction2<Integer, Integer, Integer>() {
            @Override
            public Integer apply(Integer i, Integer j) {
                return i + j;
            }
        });
        System.out.println(r3);
    }
}
```

### 8. WordCount

```scala
object WordCount {

  def main(args: Array[String]): Unit = {
    
    val lines = List("x x y", "x y z", "x y z")
    
    val words = lines.flatMap(line => line.split(" "))
    // List(x, x, y, x, y, z, x, y, z)

    val tuples = words.map(w => (w, 1))
    // List((x,1), (x,1), (y,1), (x,1), (y,1), (z,1), (x,1), (y,1), (z,1))

    val grouped = tuples.groupBy(tp => tp._1)
    // Map(z -> List((z,1), (z,1)), y -> List((y,1), (y,1), (y,1)), x -> List((x,1), (x,1), (x,1), (x,1)))

    val wordcounts = grouped.map(tp => (tp._1, tp._2.size))
    // Map(z -> 2, y -> 3, x -> 4)

    val wordcountsLst = wordcounts.toList
    // List((z,2), (y,3), (x,4))

    val result = wordcountsLst.sortBy(tp => -tp._2)
    println(result)//List((x,4), (y,3), (z,2))
  }
}
```

> lines.flatMap(\_.split(" ")).map((\_, 1)).groupBy(\_.\_1).mapValues(\_.size).toList.sortBy(-\_.\_2)

