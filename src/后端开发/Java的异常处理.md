## **Java的异常处理**

### 1. 异常的分类

- Throwable

  - Error：错误，不能使用程序处理，内存溢出，断网等

  - Exception：异常
    - 运行时异常：RuntimeException及其子类，编译时期可以通过，一般是由于书写错误导致的
    - 编译时异常：除运行时异常以外的所有异常，若不处理的话编译不能通过，不能执行，一般是由于无法预估的用户操作导致的

- JVM处理异常的默认方式：终止程序，打印异常信息

- 处理异常的目的：为了让程序能够继续运行下去

### 2. 异常的两种处理方式

#### 2.1 捕获

- 格式

  ```java
  try{
      //可能出现异常的代码
  }catch(异常类名 对象名){
      //对异常的处理
  }finally{
      //一定会执行的代码
  }
  ```

- 注意事项

  1. catch块可以存在多个，若存在子父的关系，子类异常要再父类异常之上
  2. jdk7新增，一个catch块中可以处理多个异常，多个异常使用|隔开，共享一个变量，不能存在子父类的关系
  3. try块、catch块和finally块中的局部变量不能共享使用
  4. 存在多个catch块时，异常匹配时按照catch块的顺序从上往下寻找的，只有第一个匹配的catch块会得到执行
  5. 当一个函数的某条语句发生异常时，这条语句后的语句不会再执行，执行流跳转到最近的匹配的异常处理catch块去执行
  6. finally块不管异常是否发生，只要对应的try块执行了，就一定也执行，只有System.exit()能让finally块不执行，finally块通常用来做资源释放操作：关闭文件，关闭数据库连接等

#### 2.2 抛出

- 格式

  ```java
  修饰符 返回值类型 方法名(参数) throws 异常类名1, 异常类名2,...{
      ...
  }
  ```

- 抛给了方法的调用者，main方法的调用者是JVM

### 3. 异常的常用方法

```java
public class ExceptionDemo {
	public static void main(String[] args) {
		try {
			new SimpleDateFormat().parse("...");
		} catch (ParseException e) {
            // 1. Unparseable date: "..."
			System.out.println(e.getMessage());
            
            // 2. java.text.ParseException: Unparseable date: "..."
			System.out.println(e.toString());
            
            // 3.
			e.printStackTrace();
			
			try {
                // 4.
				e.printStackTrace(new PrintStream("d:/iotest/error.txt"));// 确保文件夹存在
			} catch (FileNotFoundException e1) {
				e1.printStackTrace();
			}
		}
	}
}
```

### 4. throw用法

- throw不是用来处理异常的，相反是产生一个异常，throw的异常对象只能有一个，throw的异常一定会发生
- 格式：在方法体中

```java
public class ExceptionDemo {
	public static void main(String[] args) {
		test();
	}
	
	public static void test() {
		throw new RuntimeException("产生异常");
	}
}
```

### 5. 自定义异常

- 定义编译时异常：继承Exception
- 定义运行时异常：继承RuntimeException

```java
public class StudentDemo {
	public static void main(String[] args) {
		Student s = new Student();
		try {
			s.setGrade(0);
		} catch (MyException e) {
			e.printStackTrace();
		}
	}
}

class Student {
	private int grade;

	public void setGrade(int grade) throws MyException {
		if (grade >= 1 && grade <= 3) {
			this.grade = grade;
		} else {
			throw new MyException("错误的年级");
		}
	}
}

class MyException extends Exception {
	public MyException() {

	}

	public MyException(String desc) {
		super(desc);
	}
}
```



```java
public class StudentDemo {
	public static void main(String[] args) {
		
//		Student s = new Student(0);
		
		try {
			Student s = new Student(0);
		} catch (MyException e) {
			e.printStackTrace();
		}
	}
}

class Student {
	private int grade;
	
//	public Student(int grade) {
//		if (grade >= 1 && grade <= 3) {
//			this.grade = grade;
//		} else {
//			try {
//				throw new MyException("错误的年级");
//			}catch(Exception e){
//				e.printStackTrace();
//			}
//		}
//	}
	
	public Student(int grade) throws MyException {
		if (grade >= 1 && grade <= 3) {
			this.grade = grade;
		} else {
			throw new MyException("错误的年级");
		}
	}
}

class MyException extends Exception {
	public MyException() {

	}

	public MyException(String desc) {
		super(desc);
	}
}
```

### 6. 异常注意事项

- 以下异常指编译时异常
- 子类重写父类方法时，子类的方法必须抛出相同的异常或父类异常的子类
- 如果父类抛出了多个异常，子类重写父类时，只能抛出相同的异常或父类异常的子集
- 如果被重写的方法没有异常抛出，子类方法也不可以抛出异常，如果子类方法内有异常产生，只能try，不能throws
