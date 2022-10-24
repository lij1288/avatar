## Java的面向对象

### 1. 面向对象

#### 1.1 面向对象的定义

- 把现实中的事物抽象成由一系列属性和行为组成的结构体，每个结构体都有属于自己的功能，在软件开发的过程中，通过对不同功能的结构体进行组合，完成整个软件功能，且结构体可复用


#### 1.2 面向对象的特征

- 封装
- 继承
- 多态

***

### 2. 类和对象

#### 2.1 类和对象的关系

- 类：一种自定义类型，是一组相关的属性和行为的集合
- 对象：符合类的特征的具体事物
- 类是抽象的，对象是具体的，类是一种引用数据类型，对象是符合该类型的一个值

#### 2.2 类和对象的内存分析

- 栈（stack）

  - 局部变量，方法的执行，变量没有初始值

- 堆（heap）

  - new 出来的东西，有初始值，基本数据类型的初始值就是默认值，引用数据类型为null，当堆中没有栈内存中的变量指向时，就会成为垃圾，等待jvm自动回收

- 元空间（metaspace）

  - class区：存储所有的字节码文件

  - 静态区：用static修饰的东西，有初始值

#### 2.3 静态变量和静态方法

- 2.3.1 static概述
  - 用来修饰变量和方法，被它修饰的变量就变成了静态变量和静态方法
  - 随着类的加载而加载，先于对象的存在，被所有的对象所共享，可以使用类名调用（本类中可以省略类名）
  - 静态的方法中只能调用外部用static修饰的变量和方法，如果非要调用非静态的，只能创建对象
  - 成员变量/方法，使用对象调用；静态变量/方法，使用类名或对象调用
- 2.3.2 静态方法的使用
  - 一个方法不需要访问对象状态，其所需参数都是通过显示参数提供
  - 一个方法只需要访问类的静态变量
- 2.3.3 static注意事项
  - main方法是一个静态方法，每一个类可以有一个main方法，这是一个常用于对类进行单元测试的技巧

#### 2.4 构造方法

- 2.4.1 构造方法概述

  - constructor格式：修饰符 类名 (参数列表) { ... }
  - 1.方法名和类名相同；2.没有返回值，没有void；3.可以重载
  - 使用new关键字创建对象时，调用构造方法
  - 如果类中没有定义构造方法，系统会默认提供一个无参数的构造方法，如果类中已经定义了构造方法，系统则不再提供

- 2.4.2 构造方法注意事项

  - 当一个类的所有构造器都希望把相同的值赋予某个实例域时，可以在执行构造器前，先执行赋值操作，初始值不一定是常量值

  ```java
  class Employee {
      private static int nextId;
      private int id = assignId();
      ...
  	private static int assignId(){
          int r = nextId;
          return r;
      }
  }
  ```

  - 构造器可以在第一个语句使用this(...)调用同一个类的另一个构造器，这样对公共的构造器代码部分只编写一次即可

  ```java
  public Employee(double s) {
      //call Employee(String ,double)
      this("Employee " + nextId, s);
      nextId++;
  }
  ```

  - 三种初始化数据域的方式
    1. 在构造器中设置值
    2. 在声明中赋值
    3. 使用初始化块（initialization block），只要构造类的对象，初始化块就会被执行
  
  - 调用构造器的具体处理步骤
    1. 所有数据域被初始化为默认值
    2. 按照在类声明中出现的次序，依次执行所有域初始化语句和初始化块
    3. 如果构造器第一行调用了第二个构造器，则执行第二个构造器
    4. 执行这个构造器的主体
  
  - 在类第一次加载的时候，将会进行静态域的初始化，可以通过提供初始化值或使用静态初始化块来对静态域进行初始化

  - 参数命名

  ```java
  public Employee(String s, double s) {
      name = n;
      salary = s;
  }
  
  public Employee(String aName, double aSalary) {
      name = aName;
      salary = aSalary;
  }
  
  public Employee(String name, double salary) {
      this.name = name;
      this.salary = salary;
  }
  ```

#### 2.5 代码块

- 静态代码块：随着类的加载而执行一次

  ```java
  static{
      //代码
  }
  ```

- 构造代码块：每创建一个对象就会被执行一次

  ```java
  {
      //代码
  }
  ```

- 局部代码块：定义在方法中的一对大括号，局部代码块执行完毕后，内存会被立马释放

- 执行顺序：静态代码块 -> 构造代码块 -> 构造方法

#### 2.6 成员变量和局部变量

- 2.6.1 成员变量
- 定义在类中，方法外，没有static修饰，存放在堆内存中，有初始值，随着对象的创建而产生，随着对象的消失而消失
- 2.6.2 局部变量
  - 定义在方法中或方法的参数列表上的变量，存放在栈内存中，没有初始值，随着方法的调用而产生，随着方法的结束而消失
- 2.6.3 成员变量和局部变量重名

```java
public class Person {
	//成员变量
	int age = 1;
	
	public void print() {
		System.out.println(age);
	}
	public void print(int age) {//就近原则
		System.out.println(age);
	}
	public void print1(int age) {
		System.out.println(this.age);
	}
	public static void main(String[] args) {
		Person p = new Person();
		System.out.println(p.age);//1
		
		p.age = 2;
		p.print();//2
		p.print(3);//3,就近原则
		p.print1(4);//2
	}
}
```

#### 2.7 方法

- 2.7.1 定义
  - 用来解决一类问题的代码的有序组合，是一个功能模块
- 2.7.2 成员方法
  - 必须创建实例才能调用，方法是共享的，方法保存在方法区中，每个实例保存方法的地址
- 2.7.3 静态方法
  - 使用类名调用，不需要创建实例

#### 2.8 参数

- 2.8.1 隐式参数和显式参数

  - 隐式（implicit）参数：方法名前的类对象，this和super是隐式参数

  - 显示（explicit）参数：方法名后面括号中的数值

- 2.8.2 形参和实参

  - 形参：定义方法时，参数列表上的变量

  - 实参：调用方法时，传进去的值

  - 基本数据类型作为参数，形参的改变不影响实参的值

    引用数据类型作为参数，形参的改变影响实参的值（String和包装类除外）

    包装类：Character、Boolean、Byte、Short、Integer、Long、Float、Double

- 2.8.3 可变参数

- 格式

  ```java
  修饰符 返回值类型 方法名(数据类型...变量名){}
  ```

- 注意事项

  1. 可变参数变量其实是一个数组
  2. 一个方法只能有一个可变参数
  3. 如果一个方法有可变参数，并且有多个参数，可变参数必须是最后一个

```java
public class Varargus {
	public static void main(String[] args) {
		System.out.println(getSum(1, 2, 3, 4, 5));//15
	}
	
	public static int getSum(int...a) {
		int sum = 0;
		for (int i : a) {
			sum += i;
		}
		return sum;
	}
}
```

#### 2.9 匿名对象

- 没有名字的对象
- 使用情况：方法只调用一次、作为参数传递

***

### 3. 封装

#### 3.1 封装概述

- 隐藏对象的属性和实现细节，仅对外提供公共访问方式

- 成员变量私有化（private）

  private：用来修饰变量和方法，被private修饰的变量和方法只能在本类中访问

- 提供可以访问的方式（public）

  get方法：获取属性值；set方法：修改属性值

- this：局部变量和成员变量重名的时候，用this的是成员变量

  ```java
  public void setName(String name) {
      this.name = name;
  }
  ```

#### 3.2 JavaBean

- 用来描述事物的类，java中定义类的一种规范

- pojo (Plain Ordinary Java Object)、vo (Value Object)、dto (Data Transfer Object)、entity、model

- 1. 成员变量私有化
  2. 提供getters，setters
  3. 提供无参构造方法
  4. 提供有参构造方法

#### 3.3 单例设计模式

- 一个类只产生一个实例对象

- 1. 构造方法私有化

  2. 创建一个本类中唯一的对象，设置成静态的  

  3. 提供一个公共的静态的访问方法，返回该对象

- 3.3.1 饿汉式

```java
public class Singleton {
	private static Singleton s = new Singleton();
	private Singleton() {
	}    
	public static Singleton getInstance() {
		return s;
	}
} 
```

- 3.3.2 懒汉式

```java
public class Singleton {
	private static Singleton s; 
	private Singleton() {
	}
	public static synchronized Singleton getInstance() {
		if(s == null) {
			s = new Singleton();
		}
		return s;
	} 
}
```

反射产生第二个实例对象

```java
public class SingletonTest {
	public static void main(String[] args) {

		try {
			Singleton s = Singleton.getInstance();
			// 反射获取私有构造方法
			Constructor c = Singleton.class.getDeclaredConstructor();
			c.setAccessible(true);
			Singleton s1 = (Singleton) c.newInstance();
			System.out.println(s == s1); // false

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

class Singleton {
	private static Singleton s;

	private Singleton() {
	}

	public static synchronized Singleton getInstance() {
		if (s == null) {
			s = new Singleton();
		}
		return s;
	}
}
```

 序列化产生第二个实例对象

```java
public class SingletonTest{
	public static void main(String[] args) {
		try {
            // 对象流写入数据
			ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("d:/singleton"));
			Singleton s = Singleton.getInstance();
			oos.writeObject(s);
			
            // 对象流读取数据
			ObjectInputStream ois = new ObjectInputStream(new FileInputStream("d:/singleton"));
			Singleton s1 = (Singleton)ois.readObject();
			System.out.println(s==s1);// false
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
class Singleton implements Serializable{
	private static Singleton s; 
	private Singleton() {
	}
	public static synchronized Singleton getInstance() {
		if(s == null) {
			s = new Singleton();
		}
		return s;
	} 
}
```

- 3.3.3 枚举单例模式
- 每一个枚举类型和定义的枚举变量在JVM中是唯一的

```java
public enum Singleton {
	INSTANCE;
}
```

枚举类型的序列化，仅仅是将枚举对象的名字输出到结果中

枚举类型的反序列化，通过java.lang.Enum的valueOf方法来根据名字查找枚举对象

```java
public class SingletonEnumTest{
	public static void main(String[] args) {	
		try {
            // 对象流写入数据
			ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("d:/singleton2"));
			Singleton s = Singleton.INSTANCE;
			oos.writeObject(s);
			
            // 对象流读取数据
			ObjectInputStream ois = new ObjectInputStream(new FileInputStream("d:/singleton2"));
			Singleton s1 = (Singleton) ois.readObject();
			System.out.println(s==s1);// true
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
```

***

### 4. 继承

#### 4.1 继承概述

- java中的继承只支持单继承，不支持多继承，可以多层继承

  如果一个类没有继承任何类，那么他默认继承自Object

  用private修饰的变量和方法无法被继承

- 一个文件中定义多个类，只能有一个使用public修饰的，用public修饰的类必须和文件名相同，main方法也只能放在这个类中

#### 4.4 继承中的静态方法

- 父类的静态方法，子类的同名方法也必须是静态的（不叫方法的重写）

- 与实例方法一样，静态方法也能被继承，但静态方法不能被重写

- 如果父类中定义的静态方法在子类中被重新定义，那么定义在父类中的静态方法将被隐藏

  可以使用语法：父类名.静态方法名调用隐藏的静态方法

- 静态方法的绑定时期为代码的编译器期，非静态方法的绑定时期为程序的运行期

#### 4.3 继承中的成员变量

- super：用于子类中的成员变量和父类中的成员变量重名的时候，不重名时用this和super都可以调用父类的成员变量，this只能在本类中用，super只能在子类中用
- **与this不同，super不是一个对象的引用，不能将super赋给另一个对象变量，它只是一个指示编译器调用超类方法的特殊关键字**
- 静态方法中不能使用super和this（super和this代表对象）
- 继承中的成员变量的关系：先在子类中找，子类中如果没有就去父类中找，父类中如果没有就报错

```java
public class ExtendsDemo {
	public static void main(String[] args) {
		Demo d = new Demo();
		System.out.println(d.name);//ABC
		//System.out.println(d.age);//父类对象无法调用子类中成员
		
		LittleDemo ld = new LittleDemo();
		System.out.println(ld.age);//10
		System.out.println(ld.name);//abc（若子类没有String name则打印ABC）
		ld.show("qwe");
	}
}

class Demo {
	String name = "ABC";
}

class LittleDemo extends Demo {
	String name = "abc";
	int age = 10;
    
	public void show(String name) {
		System.out.println(name);//qwe，就近原则
		System.out.println(this.name);//abc（若子类没有String name则打印ABC）
		System.out.println(super.name);//ABC，当前类的父类中去找
	}
}
```

#### 4.4 继承中的构造方法

- 继承中构造方法的关系：

  子类中的构造方法默认会调用父类中无参数的构造方法，super()

  如果父类中没有无参数的构造方法，子类的构造方法必须要直接或者间接的调用到父类中的其他构造方法，即子类中的构造方法必须要调用到父类中的构造方法

- 子类构造方法调用父类构造方法的目的，就是为了完成父类中数据的初始化

- 调用本类中的构造方法：this (参数值) ; 

  调用父类中的构造方法：super (参数值)
  
  this()和super()必须放在第一行

```java
public class ExtendsConstructorDemo {

	public static void main(String[] args) {
//		FatherClass f = new FatherClass();
		SonClass s = new SonClass();
		
	}
}
class FatherClass {
	public FatherClass(String str) {
		System.out.println("父类的构造方法");
	}
}
class SonClass extends FatherClass {
//   public SonClass() {
//		super("abc");//子类构造方法直接调用父类有参构造方法
//		System.out.println("子类的构造方法");
//	}
    
	public SonClass() {
		this("abc");//调用本类中的构造方法，间接调用父类有参构造方法
		System.out.println("子类的构造方法");
//      this("abc");//错误，必须放在第一行
	}
	
	public SonClass(String str) {
		super(str);//父类中的构造方法
	}
}
```

#### 4.5 继承中的成员方法

- 继承中成员方法的关系：先在子类中找，子类中如果没有就去父类中找，父类中如果没有就报错

- 方法的重写和重载

  方法的重写（override）：子类中出现了和父类中一模一样的方法（返回值、名字、参数）

  方法的重载（overload）: 一个类中可以存在多个名字相同的方法，但是必须保证参数不同，与返回值无关

- 注意事项

  1. 子类重写父类方法时，访问权限不能更低（public protected default private）

  2. 父类中私有方法不能被重写，但是可以在子类中定义相同的方法（不叫方法的重写）

#### 4.6 final

- final可以用来修饰类、方法、变量 

- final类中的所有方法自动地成为final方法，而不包括变量

- final修饰的类不能被继承，final修饰的方法不能被重写，final修饰的变量值不能改变

- final修饰基本数据类型的变量的时候，值不能改变

  final修饰引用数据类型的时候，地址值不能改变，可以改变属性值

  final修饰的成员变量必须在对象创建成功之前完成赋值：

  1. 直接赋值

  2. 在构造方法中赋值

  3. 在构造代码块中赋值

***

### 5. 多态

#### 5.1 多态概述

- 一个对象变量可以指示多种实际类型的现象被称为多态

- 前提：

  有继承关系

  方法的重写

  父类（类, 抽象类, 接口）的引用指向子类的对象

- 调用关系

  调用同名的成员变量 -> 父类的

  调用同名的静态方法 -> 父类的

  调用同名的成员方法 -> 子类的

  调用同名的静态变量 -> 父类的

  不能调用子类独有的方法和变量

- 向上向下转型

  ```java
  Person p = new Student();//向上转型
  Student s = (Student)p;//向下转型
  ```

  在将超类转换成子类之前, 应该使用instanceof进行检查（ClassCastException）

  ```java
  if(p instenceof Student) {
      Student s = (Student)p;
      ...
  }
  ```

- 好处：提高了程序的维护性，提高了程序的扩展性

  弊端：不能访问子类的特有功能

#### 5.2 抽象类

- 5.2.1 抽象类概述

  - 抽象方法

    abstract 修饰符 返回值类型 方法名 (参数列表)

    abstract在修饰方法的时候，和大括号不共存

  - 抽象类
  
    用abstract修饰的类
  
    abstract class 类名 {}

- 5.2.2 抽象类的特点

  1. 有抽象方法的类，一定是抽象类，抽象类中可以没有抽象方法

     抽象方法：限定子类必须完成某些动作

     非抽象方法：提高代码的复用性

  2. 抽象类无法创建对象，只能通过子类向上转型的方式创建对象

  3. 抽象类的子类，要么实现（重写）抽象类中所有的抽象方法，要么自己本身是一个抽象类

  4. 抽象类不能用final修饰

  5. 抽象类中既可以定义变量也可以定义常量

  6. 抽象类有构造方法，为了让子类能够调用，完成数据的初始化

  7. 修饰外部类的修饰符：public、default、final、abstract

#### 5.3 接口

- 5.3.1 接口概述

  引用数据类型：类、数组、接口

  定义格式:

  ```java
  interface 接口名{}
  ```

- 5.3.2 接口的特点

  1. （jdk1.8之前）接口中只能定义抽象方法，默认都是由public abstract修饰的

  2. 接口中只能定义常量，默认都是由public static final修饰的

  3. 接口本身不能创建对象，只能通过子类向上转型的方式创建对象 

     接口的子类（实现了接口的类，一个类可以实现多个接口）

  ```java
  class 类名 implements 接口名1,接口2... {}
  ```

  4. 接口的子类：必须实现接口中所有的抽象方法，或者自己是一个抽象类
  5. 接口没有构造方法
  6. 接口不能实现接口，只能继承接口，并且可以多继承
  7. jdk1.8之后，接口中可以定义非抽象的方法，但是必须使用static或default修饰
  
  ```java
  interface InterfaceA {
      default public void Xxx() {//提供接口的默认实现
          ...
      }
      
  //  static public void Xxx(){//使用接口名调用
  //      ...
  //  }
  }
  ```

  8. 一个类可以同时继承一个类，实现多个接口（先继承,再实现）

- 5.3.3 抽象类和接口的区别

  1. 一个类只能继承一个抽象类，却可以实现多个接口
  2. 抽象类中可以有非抽象的方法，接口中所有的方法都是抽象方法（1.8之前），并且接口中的方法都是public
  3. 抽象类中既可以定义常量，也可以定义变量，接口中只能定义常量
  4. 抽象类中有构造方法，接口没有构造方法
  5. 接口只能继承接口，不能实现接口，并且可以多继承

***

### 6. 内部类

#### 6.1 内部类的分类

- 定义在类内部的类

- 1. 成员内部类

  2. 静态内部类

  3. 局部内部类

  4. 匿名内部类

#### 6.2 内部类的作用

1. 内部类可以很好的实现隐藏，因为内部类可以使用private和protected修饰

   ```java
   public class InnerclassTest {
   	public static void main(String[] args) {
   		Outerclass oc = new Outerclass();
   		Interface1 oc1 = oc.getInnerclass();
   		oc1.method();
   	}
   }
   
   interface Interface1 {
   	void method();
   }
   
   class Outerclass {
   	private class Innerclass implements Interface1 {
   		public void method() {
   			System.out.println("private内部类实现接口方法");
   		}
   	}
   
   	public Interface1 getInnerclass() {
   		return new Innerclass();
   	}
   }
   ```

2. 内部类有外部类的所有元素的访问权限

3. 可以实现多重继承

   ```java
   public class InnerclassTest {
   	public static void main(String[] args) {
   		Outerclass oc = new Outerclass();
   		oc.new Innerclass1().method1();
   		oc.new Innerclass2().method2();
   	}
   }
   
   class Superclass1 {
   	public void method1() {
   		System.out.println("超类1");
   	}
   }
   
   class Superclass2 {
   	public void method2() {
   		System.out.println("超类2");
   	}
   }
   
   class Outerclass {
   	class Innerclass1 extends Superclass1 {
   		public void method1() {
   			System.out.println("内部类1继承超类1");
   		}
   	}
   
   	class Innerclass2 extends Superclass2 {
   		public void method2() {
   			System.out.println("内部类2继承超类2");
   		}
   	}
   }
   ```

4. 可以避免修改接口而实现同一个类中两种同名方法的调用

   ```java
   public class InnerclassTest {
   	public static void main(String[] args) {
   		Outerclass oc = new Outerclass();
   		
   		oc.method();
   		oc.new Innerclass().method();
   	}
   }
   
   interface Interface1 {
   	void method();// 同名方法
   }
   
   class Superclass {
   	public void method() {// 同名方法
   		System.out.println("超类中与接口方法同名的方法");
   	}
   }
   
   public class Outerclass extends Superclass {
   	
   	public void method() {
   		System.out.println("外部类重写父类方法");
   	}
   	
   	class Innerclass implements Interface1{
   		public void method() {
   			System.out.println("内部类重写接口方法");
   		}
   	}
   }
   ```

#### 6.3 成员内部类和局部内部类

```java
public class InnerClassDemo {
	public static void main(String[] args) {
		OuterClass outer = new OuterClass();
		outer.ocMethod();

		OuterClass.InnerClass inner1 = new OuterClass().new InnerClass();
		inner1.test();
		
		new OuterClass().ocMethod2();
	}
}

class OuterClass {
	private int ocfield1 = 10;
	static int ocfield2 = 20;
	String name = "外部类";

	public void ocMethod() {
		InnerClass inner = new InnerClass();
		System.out.println(inner.icfield1);// 调用内部类成员
		System.out.println(inner.name);// 调用内部类私有成员

	}
	
//	成员内部类:
//	1. 可以无限制的访问外部类的成员，包括静态成员和私有成员
//	2. 成员内部类中无法定义静态成员（成员内部类和成员变量一样在创建外部类对象时才加载）
//	3. 外部类访问内部类的成员（包括私有）：创建内部类的对象
//	4. 其他类中访问内部类的成员： 
//		创建内部类的对象：外部类名.内部类名 对象名 = new 外部类名().new 内部类名();
//	5. 在内部类中调用外部类中的同名成员：外部类名.this.成员
	class InnerClass {
		int icfield1 = 1;
		private String name = "内部类";

		public void test() {
			String name = "就近原则";
			System.out.println(name);// 就近原则
			System.out.println(this.name);// 调用内部类成员变量（若内部类方法中没有同名成员变量，不需要this）
			System.out.println(OuterClass.this.name);// 调用外部类同名成员变量
			System.out.println(ocfield1);// 调用外部类私有成员
			System.out.println(ocfield2);// 调用外部类静态成员
		}
	}
	
//	局部内部类：定义在方法或代码块中的内部类
//	1. 不能用public、protected、private修饰（相当于局部变量）
//	2. jdk1.7之前局部内部类中定义的变量必须使用final修饰，1.8之后可以不加final
	public void ocMethod2() {
		int mtfield = 30;
		
		class InnerClass2{
			int icfield2 = 3;
			public void icMethod() {
				System.out.println("局部内部类中的方法 ");
			}
		}
		new InnerClass2().icMethod();
	}
}
```

#### 6.3 静态内部类

```java
public class InnerClassDemo {
	public static void main(String[] args) {
		System.out.println(OuterClass.InnerClass.sicfield);
		System.out.println(new OuterClass.InnerClass().icfield);
	}
}

class OuterClass {
//	静态内部类
//	1. 静态内部类中既可以定义静态的成员，也可以定义非静态的成员
//	2. 如果内部类中有静态成员，则一定时静态内部类
//	3. 调用静态成员：外部类名.内部类名.静态成员
//	   调用非静态成员：new 外部类名.内部类名().非静态成员
	static class InnerClass {
		static int sicfield = 1;
		int icfield = 2;
	}
}
```

#### 6.4 匿名内部类

```java
//	匿名内部类：
//	本质是实现了接口/或继承了类的子类对象
//	格式：new 接口名/类名(){
//			实现的方法
//		}
public class AnonymousInnerClassDemo {
	public static void main(String[] args) {
		
		new A(){
			public void methodA() {
				System.out.println("直接调用接口的方法");
			}
		}.methodA();
		
		A a = new A() {
			public void methodA() {
				System.out.println("获取对象调用接口的方法");
			}
		};
		a.methodA();
		
		method(new A() {
			public void methodA() {
				System.out.println("匿名内部类作参数");
			}
		});
	}
	
	public static void method(A a) {
		a.methodA();
	}
}

interface A{
	public void methodA();
}
abstract class B{
	abstract public void methodB1();
	public void methodB2() {
		System.out.println();
	}
}
class C{
	public void methodC() {
		System.out.println();
	}
} 
```

***

### 7. 权限修饰符

- |                        | public | protected | default | private |
  | :--------------------- | :----: | :-------: | :-----: | :-----: |
  | 同一类中               |   √    |     √     |    √    |    √    |
  | 同一包中 (子类/其他类) |   √    |     √     |    √    |         |
  | 不同包子类             |   √    |     √     |         |         |
  | 不同包其他类           |   √    |           |         |         |

- protected：可以在不同包的子类中访问: 

  1.在子类中直接使用super关键字调用

  2.在子类中，创建子类的对象也可以访问，但是创建父类的对象是无法访问的

  ```java
  package com.phoenixera.test;
  
  import com.phoenixera.test2.SuperClass;
  
  public class SubClass extends SuperClass {
  	
  	public void show() {
  		System.out.println(field);
  		System.out.println(super.field);
  	}
  	
  	public static void main(String[] args) {
  		SuperClass spc = new SuperClass();
  //		System.out.println(spc.field);//在子类中创建父类的对象无法访问
  
  		SuperClass spc1 = new SubClass();
  		SubClass spc2 = (SubClass)spc1;
  		System.out.println(spc2.field);
          
  		SubClass sbc = new SubClass();
  		sbc.show();
  		System.out.println(sbc.field);   
  	}
  }
  ------------------------------------------------------------------
  package com.phoenixera.test2;
  
  public class SuperClass {
  	protected String field = "abc";
  }
  ```

