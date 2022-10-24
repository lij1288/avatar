## **Java的集合**

### 1. 集合

- Collection

  - List有序的，有索引，元素可以重复

    - ArrayList底层使用数组实现，增删慢（需要移动元素），查询快（有索引值）

    - LinkedList底层使用链表实现，增删快，（随机）查询慢

  - Set无序的，没有索引，元素不可以重复

    - HashSet无法保证存入和取出的顺序，不可重复性由hashCode和equals保证
      - LinkedHashSet可以保证存入和取出的顺序（链表实现）

    - TreeSet可以对集合中的元素实现自然排序，要求Set中的元素所在的类必须实现Comparable接口，否则会出现转型异常cannot be cast to java.lang.Comparable，TreeSet中的元素不可重复，依赖于compareTo/compare，如果compareTo/compare方法返回0，TreeSet就认为是相同元素，只保存一个，在使用时尽量不要只比较一个属性，TreeSet中的元素不能为null，因为需要使用元素调用compareTo/compare做比较

  - Map Key不可重复

    - HashMap哈希表实现（数组 + 链表）

    - TreeMap可对Key做自然排序，Key不可重复，依赖于compareTo/compare，Key不能为null

### 2. 泛型

#### 2.1 泛型概述

泛型即类型参数化，可以像参数一样控制某种数据类型

泛型只在编译时期有效，正确检验泛型结果后，会将泛型的相关信息擦出，成功编译过后的class文件中是不包含任何泛型信息的，泛型信息不会进入到运行时阶段

#### 2.2 自定义泛型类

- 格式：class 类名<泛型符号>{}，符号为任意字母，常用T, E, K V

```java
public class GenericDemo {
	public static void main(String[] args) {
		
		Box<String> box = new Box<>("astring");
	}
}

class Box<T>{
	T data;	
	
	public Box(T t) {
		this.data =t;
	}
	
	public T getData() {
		return data;
	}
}
```

#### 2.3 自定义泛型接口

- 泛型接口与泛型类的定义和使用基本相同 
- 实现泛型接口的类未传入泛型实参时，与泛型类的定义相同，在声明类的时候需要将泛型的声明也一起加到类中
- 现泛型接口的类传入泛型实参时，所有使用泛型的地方都要替换为传入的实参类型

```java
interface InterA<B>{
	public void show(B b);
}

//实现泛型接口的类未传入泛型实参时，与泛型类的定义相同，在声明类的时候需要将泛型的声明也一起加到类中
class Test<B> implements InterA<B>{

	@Override
	public void show(B b) {
		System.out.println("...");
	}
}

//实现泛型接口的类传入泛型实参时，所有使用泛型的地方都要替换为传入的实参类型
class Test2 implements InterA<String>{

	@Override
	public void show(String b) {
		System.out.println("...");
	}
}
```

#### 2.4 泛型方法

- 格式：修饰符 \<T> 返回值类型 方法名(T t)
- public与返回值中间的\<T>非常重要，可以理解为声明此方法为泛型方法
- 只有声明了\<T>的方法才是泛型方法，泛型类中的使用了泛型的成员方法并不是泛型方法
- \<T>表面该方法将使用泛型类型T，此时才可以在方法中使用泛型类型T

```java
public class GenericDemo {
	public static void main(String[] args) {
		
		show("astring");
	}
	
	public static <T> void show(T t) {
		System.out.println(t.getClass().getName());
	}
}
```

#### 2.5 泛型通配符

- \<?> ----- 任意类型，如果没有明确，就是Object以及任意的Java类
- \<? extends E> ----- 向下限定，E及其子类
- \<? super E> ----- 向上限定，E及其超类
- 泛型通配符只能用在等号的左边或参数列表上

```java
public class GenericDemo {
	public static void main(String[] args) {
		
		Collection<?> c1 = new ArrayList<Object>();
		Collection<?> c2 = new ArrayList<Animal>();
		Collection<?> c3 = new ArrayList<Cat>();
		
		Collection<? extends Animal> c4 = new ArrayList<Cat>();
		Collection<? extends Animal> c5 = new ArrayList<Animal>();
		
		Collection<? super Animal> c6 = new ArrayList<Object>();
		Collection<? super Animal> c7 = new ArrayList<Animal>();
	}
}

class Animal{}

class Cat extends Animal{}
```

### 3. 比较器

#### Comparable

```java
public class ComparableDemo {
	public static void main(String[] args) {
		
		List<Student> list = new ArrayList<>();
		list.add(new Student("Tom", 75));
		list.add(new Student("Jerry", 95));
		list.add(new Student("Speike", 85));
		
		Collections.sort(list);
		System.out.println(list);
	}
}

class Student implements Comparable<Student>{
	
	String name;
	int score;
	
	public Student(String name, int score) {
		this.name = name;
		this.score = score;
	}
	
	@Override
	public String toString() {
		return "Student [name=" + name + ", score=" + score + "]";
	}

	@Override
	public int compareTo(Student o) {
		return this.score - o.score;//升序
	}
}
```

- compareTo

比较此对象与指定对象的顺序，如果该对象小于，等于或大于指定对象，分别返回负整数、零或正整数

```java
int compareTo(T o)
```


#### Comparator

```java
public class ComparatorDemo {
	public static void main(String[] args) {
		
		List<Student> list = new ArrayList<>();
		list.add(new Student("Tom", 75));
		list.add(new Student("Jerry", 95));
		list.add(new Student("Speike", 85));
		
		Collections.sort(list, new Comparator<Student>() {

			@Override
			public int compare(Student o1, Student o2) {//降序
				return o2.score - o1.score;
			}

		});
		
		System.out.println(list);
	}
}

class Student implements Comparable<Student>{
	
	String name;
	int score;
	
	public Student(String name, int score) {
		this.name = name;
		this.score = score;
	}
	
	@Override
	public String toString() {
		return "Student [name=" + name + ", score=" + score + "]";
	}

	@Override
	public int compareTo(Student o) {
		return this.score - o.score;
	}
}
```

- compare

比较用来排序的两个参数，根据第一个参数小于，等于或大于第二个参数分别返回负整数、零或正整数

```java
int compare(T o1,T o2)
```

- equals

指示某个其他对象是否等于此Comparator

```java
boolean equals(Object obj)
```

### 4. Collections

#### binarySearch

使用二分搜索法搜索指定列表, 以获得指定对象

```java
public static <T> int binarySearch(List<? extends Comparable<? super T>> list,T key)
//调用前必须根据列表元素的自然顺序对列表进行升序排序

public static <T> int binarySearch(List<? extends T> list,T key,Comparator<? super T> c)
//调用前必须根据指定的比较器对列表进行升序排序
```

#### max

获取最大值

```java
public static <T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll)

public static <T> T max(Collection<? extends T> coll,Comparator<? super T> comp)
```

#### min

获取最小值

```java
public static <T extends Object & Comparable<? super T>> T min(Collection<? extends T> coll)

public static <T> T min(Collection<? extends T> coll,Comparator<? super T> comp)
```

#### reverse

反转

```java
public static void reverse(List<?> list)
```

#### reverseOrder

返回一个比较器，它强行逆转顺序

```java
public static <T> Comparator<T> reverseOrder()
//强行逆转实现了Comparable接口的对象collection的自然顺序

public static <T> Comparator<T> reverseOrder(Comparator<T> cmp)
//强行逆转指定比较器的顺序
```

#### shuffle

随机打乱

```java
public static void shuffle(List<?> list)
//使用默认随机源对指定列表进行置换

public static void shuffle(List<?> list,Random rnd)
//使用指定的随机源对指定列表进行置换
```

#### sort

排序

```java
public static <T extends Comparable<? super T>> void sort(List<T> list)

public static <T> void sort(List<T> list,Comparator<? super T> c)
```

### 5. Colection

#### Colection

- add

添加元素，如果此collection由于调用而发生更改，则返回true（如果此collection不允许有重复元素，并且已经包含了指定的元素，则返回false）

```java
boolean add(E e)
```

- addAll

将指定collection中的所有元素都添加到此collection中，如果此collection由于调用而发生更改，则返回 true 

```java
boolean addAll(Collection<? extends E> c)
```

- clear

清空collection中的所有元素

```java
void clear()
```

- contains

如果此collection包含指定的元素，则返回true

（当且仅当此collection至少包含一个满足 (o\==null ? e==null : o.equals(e)) 的元素e时，返回 true）

```java
boolean contains(Object o)
```

- containsAll

如果此collection包含指定collection中的所有元素，则返回true

```java
boolean containsAll(Collection<?> c)
```

- isEmpty

如果此collection不包含元素，则返回 true

```java
boolean isEmpty()
```

- iterator

返回在此collection的元素上进行迭代的迭代器

```java
Iterator<E> iterator()
```

- remove

从此collection中移除指定元素的单个实例（移除一个），如果此collection由于调用而发生更改，返回 true

```java
boolean remove(Object o)
```

- removeAll

移除此collection中那些也包含在指定collection中的所有元素，如果此collection由于调用而发生更改，返回 true

```java
boolean removeAll(Collection<?> c)
```

- retainAll

仅保留此collection中那些也包含在指定collection的元素（取交集）

```java
boolean retainAll(Collection<?> c)
```

- size

返回此collection中的元素数

```java
int size()
```

- toArray

返回包含此collection中所有元素的数组

```java
Object[] toArray()

<T> T[] toArray(T[] a)
//返回数组的运行时类型与指定数组的运行时类型相同
//如果指定的数组能容纳该collection，则返回包含此collection元素的数组（若数组还有剩余空间，尾部元素会被设置为null）
//否则，将分配一个具有指定数组的运行时类型和此collection大小的新数组
//toArray(new Object[0])等效于toArray()
```

#### Iterator

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class IteratorDemo {
	public static void main(String[] args) {
		List<Integer> list = new ArrayList<>();
		list.add(9);
		list.add(5);
		list.add(3);
		list.add(7);
		list.add(6);
		list.add(1);
		
		//大于5的
		List<Integer> result = new ArrayList<>();
		Iterator<Integer> it = list.iterator();
//		while(it.hasNext()) {//[5, 6]，在循环语句中连续多次使用next方法
//			if(it.next() > 5) {
//				result.add(it.next());
//			}
//		}
		
		while(it.hasNext()) {
			int num = it.next();
			if(num > 5) {
				result.add(num);
			}
		}
		System.out.println(result);//[9, 7, 6]
	}
}
```

- hasNext

如果仍有元素可以迭代，返回true

```java
boolean hasNext()
```

- next

返回迭代的下一个元素

```java
E next()
```

- remove

从迭代器指向的collection中移除迭代器返回的最后一个元素，每次调用next只能调用一次此方法

```java
void remove()
```

### 6. List

#### List

- add

在列表的指定位置插入指定元素，该位置元素及后续元素右移

```java
void add(int index,E element)
```

- get

返回列表中指定位置的元素

```java
E get(int index)
```

- set

用指定元素替换列表中指定位置的元素，返回被替换的元素

```java
E set(int index,E element)
```

- listIterator

返回列表中元素的列表迭代器

```java
ListIterator<E> listIterator()

ListIterator<E> listIterator(int index)
//返回列表中元素的列表迭代器，从列表的指定位置开始，指定的索引表示next的初始调用所返回的第一个元素，previous方法的初始调用将返回索引比指定索引少1的元素
```

- remove

移除列表中指定位置的元素，后续元素左移，返回被移除元素

```java
E remove(int index)
```

#### ListIterator

- add

将指定的元素插入列表，该元素直接插入到next返回的下一个元素之前，或previous返回的下一个元素之后

如果列表没有元素，那么新元素就成为列表中的唯一元素

新元素被插入到隐式光标前（不影响对next的后续调用，对 previous的后续调用会返回此新元素，此调用把调用nextIndex或previousIndex所返回的值增加1）

```java
void add(E e)
```

- hasNext

如果正向遍历列表，列表迭代器有多个元素，返回true

```java
boolean hasNext()
```

- next

回列表中的下一个元素

```java
E next()
```

- nextIndex

返回对next的后续调用所返回元素的索引（如果列表迭代器在列表的结尾，则返回列表的大小）

```java
int nextIndex()
```

- hasPrevious

如果逆向遍历列表，列表迭代器有多个元素，返回 true

```java
boolean hasPrevious()
```

- previous

返回列表中的前一个元素

```java
E previous()
```

- previousIndex

返回对previous的后续调用所返回元素的索引（如果列表迭代器在列表的开始，则返回 -1）

```java
int previousIndex()
```

- remove

从列表中移除由next或previous返回的最后一个元素，对于每个next或previous调用，只能执行一次此调用，只有在最后一次调用next或previous之后，尚未调用ListIterator.add时才可以执行该调用

```java
void remove()
```

- set

用指定元素替换next或previous返回的最后一个元素

只有在最后一次调用next或previous后既没有调用 ListIterator.remove也没有调用ListIterator.add时才可以进行该调用

```java
void set(E e)
```

#### LinkedList

- addFirst

将指定元素插入此列表的开头

```java
public void addFirst(E e)
```

- addLast

将指定元素添加到此列表的结尾

```java
public void addLast(E e)
```

- getFirst

返回此列表的第一个元素

```java
public E getFirst()
```

- getLast

返回此列表的最后一个元素

```java
public E getLast()
```

- removeFirst

移除并返回此列表的第一个元素

```java
public E removeFirst()
```

- removeLast

移除并返回此列表的最后一个元素

```java
public E removeLast()
```

### 7. Set

#### spliterator

创建支持高效并行遍历的Spliterator

```java
default Spliterator<E> spliterator()
```

### 8. Map

#### clear

从此映射中移除所有映射关系

```java
void clear()
```

#### containsKey

 是否包含key

```java
boolean containsKey(Object key)
```

#### containValue

 是否包含value

```java
boolean containsValue(Object value)
```

#### entrySet

返回包含键值对的Set集合

```java
Set<Map.Entry<K,V>> entrySet()

//Map.Entry<K,V>接口
K getKey()

V getValue()
```

#### getOrDefault

根据key取value，若有值则返回value，若没有则返回默认值

```java
default V getOrDefault(Object key,V defaultValue)
```

#### keySet

返回包含key的Set集合

```java
Set<K> keySet()
```

#### vlaues

返回包含value的集合

```java
Collection<V> values()
```

#### remove

移除key对应的键值对（如果此映射允许null值，则返回null值并不一定表示该映射不包含该键的映射关系，也可能该映射将该键显示地映射到null）

```java
V remove(Object key)
```

#### put

将指定的值与此映射中的指定键关联，如果此映射以前包含一个该键的映射关系，则用指定值替换旧值

```java
V put(K key,V value)
```

#### size

返回此映射中的键-值映射关系数

```java
int size()
```
