## **Java的反射使用**

### 1. 反射

在运行状态中，对于任意一个类，都能知道这个类的所有属性和方法，对于任意一个对象，都能调用这个对象的所有属性和方法，这种动态获取信息以及动态调用对象的方法的功能称为Java语言的反射机制

### 2. 获取Class对象

```java
public class Demo {
	
	private int field1;
	protected boolean field2;
	char field3;
	public String field4;
	
	static int field5;
	
	private Demo(int filed1) {
		this.field1 = filed1;
	}
	protected Demo(boolean field2) {
		this.field2 = field2;
	}
	Demo(char field3, String field4) {
		this.field3 = field3;
		this.field4 = field4;
	}
	public Demo() {
		
	}
	
	@Override
	public String toString() {
		return "Demo [field1=" + field1 + ", field2=" + field2 + ", field3=" + field3 
				+ ", field4=" + field4 + ", field5=" + field5 + "]";
	}
	private void method1(int a) {
		System.out.println("method1");
	}
	protected void method2() {
		System.out.println("method2");
	}
	int method3(int a, int b) {
		System.out.println("method3");
		return a + b;
	}
	public void method4() {
		System.out.println("method4");
	}
}

interface InterfaceA{
	
}
```

```java
public class ReflectClassDemo {
	public static void main(String[] args) throws Exception {
		
		// 1. 对象名.getClass()
		Demo d = new Demo();
		Class clazz1 = d.getClass();
		
		// 2. 类名.class
		Class clazz2 = Demo.class;
		
		// 3. Class.forName(全类名)
		Class clazz3 = Class.forName("com.phoenixera.reflect.Demo");
		
		System.out.println(clazz1.getName());//com.phoenixera.reflect.Demo
		System.out.println(clazz1.getSimpleName());//Demo
		System.out.println(clazz1.getPackage());//package com.phoenixera.reflect
		System.out.println(clazz1.getSuperclass());//class java.lang.Object
		Class[] interfaces = clazz1.getInterfaces();
		
		// 创建对象
		Object o = clazz1.newInstance();
		System.out.println(o instanceof Demo);//true
	}
}
```

### 3. 获取构造方法

```java
import java.lang.reflect.Constructor;

public class ReflectConstructorDemo {
	public static void main(String[] args) {

		try {

			// 1. 得到Class对象
			Class clazz = Class.forName("com.phoenixera.reflect.Demo");

			// 2. 获取构造方法
			// 获取用public修饰的构造方法
			Constructor[] cs = clazz.getConstructors();
			for (Constructor c : cs) {
				System.out.println(c);
			}
			
			// 获取所有构造方法
			Constructor[] dcs = clazz.getDeclaredConstructors();
			for (Constructor c : dcs) {
				System.out.println(c);
			}
			System.out.println("-------------------------------------");
			// 获取单个构造方法
			// 获取单个用public修饰的构造方法
			Constructor c1 = clazz.getConstructor();
//			Constructor c1 = clazz.getConstructor(null);//或
			System.out.println(c1);
			// 获取单个非public修饰的构造方法
//			Constructor c2 = clazz.getConstructor(char.class, String.class);
            //java.lang.NoSuchMethodException
			Constructor c2 = clazz.getDeclaredConstructor(char.class, String.class);
			Constructor c3 = clazz.getDeclaredConstructor(int.class);//私有构造方法
			
			System.out.println("-------------------------------------");
			// 构造方法创建对象
			Object o1 = c1.newInstance();
			System.out.println(o1);
			Object o2 = c2.newInstance('a', "b");
			System.out.println(o2);
			
			// 默认无法访问私有构造方法
//			Object o3 = c3.newInstance(135);//java.lang.IllegalAccessException
//			System.out.println(o3);
			//取消默认Java语言访问控制检查
			c3.setAccessible(true);
			Object o3 = c3.newInstance(135);
			System.out.println(o3);
            
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
```

### 4. 获取成员变量

```java
import java.lang.reflect.Field;

public class ReflectFieldDemo {
	public static void main(String[] args) {
		
		try {
			// 1. 得到Class对象
			Class clazz = Class.forName("com.phoenixera.reflect.Demo");
			
			// 2. 获取变量
			// 获取用public修饰的变量，包括父类的
			Field[] fs = clazz.getFields();
			for (Field f : fs) {
				System.out.println(f);
			}
			
			// 获取所有变量
			Field[] dfs = clazz.getDeclaredFields();
			for (Field f : dfs) {
				System.out.println(f);
			}
			System.out.println("-------------------------------------");
			
			// 获取单个变量
			// 获取单个用public修饰的变量
			Field f1 = clazz.getField("field4");
			System.out.println(f1);
			// 获取单个非public修饰的变量
//			Field f2 = clazz.getField("field1");//java.lang.NoSuchFieldException
			Field f2 = clazz.getDeclaredField("field1");
			System.out.println(f2);
			System.out.println("-------------------------------------");
			
			// 给对象中的变量赋值
			// 创建对象
			Object o = clazz.newInstance();//调用无参构造，保证类中有无参构造
			f1.set(o, "a");
			
//			f2.set(o, 135);//java.lang.IllegalAccessException
			f2.setAccessible(true);
			f2.set(o, 135);
			System.out.println(o);
            
			// 给静态变量赋值
			Field f3 = clazz.getDeclaredField("field5");
			f3.set(null, 135);
//			f3.set(o, 135);//或
			System.out.println(o);
            
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
```

### 5. 获取成员方法

```java
import java.lang.reflect.Method;

public class ReflectMethodDemo {
	public static void main(String[] args) {
		
		try {
			// 1. 得到Class对象
			Class clazz = Class.forName("com.phoenixera.reflect.Demo");
			
			// 2. 获取方法
			// 获取用public修饰的方法，包括父类的
			Method[] ms = clazz.getMethods();
			for (Method m : ms) {
				System.out.println(m);
			}
			
			// 获取所有方法，不包括父类的
			Method[] dms = clazz.getDeclaredMethods();
			for (Method m : dms) {
				System.out.println(m);
			}
			System.out.println("-------------------------------------");
			
			// 获取单个方法
			// 获取单个用public修饰的方法
			Method m1 = clazz.getMethod("method4");
//			Method m1 = clazz.getMethod("method4", null);//或
			System.out.println(m1);
			// 获取单个非public修饰的方法
//			Method m2 = clazz.getMethod("method1", int.class);//java.lang.NoSuchMethodException
			Method m2 = clazz.getDeclaredMethod("method1", int.class);
			System.out.println(m2);
			Method m3 = clazz.getDeclaredMethod("method3", int.class, int.class);
			System.out.println(m3);
			System.out.println("-------------------------------------");
			
			// 调用方法
			// 创建对象
			Object o = clazz.newInstance();
			m1.invoke(o);
//			m1.invoke(o, null);//或
			
//			m2.invoke(o, 135);//java.lang.IllegalAccessException
			m2.setAccessible(true);
			m2.invoke(o, 135);
			
			// 调用有返回值的方法
			Object sum = m3.invoke(o, 1, 2);
			System.out.println(sum);//3
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
```

### 6. 反射解耦合

- 在不修改程序的基础上，动态地把new的Demo替换掉:

  再写一个类SuperDemo，通过修改配置文件完成Demo和SuperDemo的动态切换

```java
public interface InterfaceA {
	public void method();
}
```

```java
public class Demo implements InterfaceA {
	@Override
	public void method() {
		System.out.println("Demo方法");
	}
}
```

```java
public class SuperDemo implements InterfaceA {
	@Override
	public void method() {
		System.out.println("SuperDemo方法");
	}
}
```

```java
/**
 * 	config.properties内容:
 *	class.name = com.phoenixera.reflect.SuperDemo
 */
import java.util.Properties;

public class DemoTest {
	public static void main(String[] args) {
        
//		Demo d = new Demo();
//      d.method();
        
		try {
			
			Properties p = new Properties();
			p.load(DemoTest.class.getClassLoader().getResourceAsStream("config.properties"));
			String value = p.getProperty("class.name");
			Class clazz = Class.forName(value);
			Object o = clazz.newInstance();
			
			InterfaceA d = (InterfaceA)o;
			d.method();
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
```

### 7. 动态代理

#### 7.1 静态代理

- 通过proxy持有realObject的引用，并进行一层封装
- **接口**

```java
public interface InterfaceA {
	public void test();
}
```

- **目标类**

```java
public class Target implements InterfaceA {
	@Override
	public void test() {
		System.out.println("TargetMethod");
	}
}
```

- **代理类**

```java
public class Proxy implements InterfaceA {
	
	Target t = new Target();//目标对象, 被代理对象
	
	@Override
	public void test() {
		System.out.println("方法开始前要执行的内容");//增强
		t.test();
		System.out.println("方法结束后要执行的内容");
	}
}
```

- **测试类**

```java
public class ProxyTest {
	public static void main(String[] args) {
		InterfaceA a = new Proxy();
		a.test();
	}
}
```

#### 7.2 动态代理

- 在程序运行过程中通过反射来生成代理对象
- 使用Proxy调用newProxyInstance方法

```java
public static Object newProxyInstance(ClassLoader loader,Class<?>[] interfaces,
	InvocationHandler h)
//返回一个指定接口的代理类实例，该接口可以将方法调用指派到指定的调用处理程序
/**
1. ClassLoader loader：定义代理类的类加载器
	定义了由哪个ClassLoader对象来对生成的代理对象进行加载, 类加载器可以把class文件加载到jvm里，动态代理是在程序运行过程中产生的，没有经过编译的过程，最开始生成时，jvm里时没有的

2. Class<?>[] interfaces：代理类要实现的接口列表
	一组接口的对象的数组，代表给接口中所有的方法都实现代理
	t.getClass().getInterfaces()获取所有接口

3. InvocationHandler h：指派方法调用的调用处理程序
	表示这个动态代理对象在调用方法的时候，会关联到哪一个InvocationHandler对象上
*/

Object invoke(Object proxy,Method method,Object[] args)
//在代理实例上处理方法调用并返回结果，在与方法关联的代理实例上调用方法时，将在调用处理程序上调用此方法
/**
1. Object proxy：在其上调用方法的代理实例
	真正的代理对象，不要使用

2. Method method：对应于在代理实例上调用的接口方法的Method实例
	用代理对象调用哪个方法，method就指代哪个方法

3. Object[] args：包含传入代理实例上方法调用的参数值的对象数组，如果接口方法不使用参数，则为null
	调用方法时传进去的参数

4. Object：从代理实例的方法调用返回的值
*/
```

- **接口**

```java
public interface InterfaceA {
	public void test1();
	public void test2();
}
```

- **目标对象**

```java
public class Target implements InterfaceA {

	@Override
	public void test1() {
		System.out.println("TargetMethod1");
	}

	@Override
	public void test2() {
		System.out.println("TargetMethod2");
	}
}
```

- **生成代理对象**

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class ProxyTest {
	public static void main(String[] args) {
		// 先创建一个目标对象
		Target t = new Target();

		// 创建代理对象
//		Object proxyObject = Proxy.newProxyInstance(ProxyTest.class.getClassLoader(), 		  new Class[] { InterfaceA.class }, new InvocationHandler() {
		Object proxyObject = Proxy.newProxyInstance(ProxyTest.class.getClassLoader(), 		  t.getClass().getInterfaces(), new InvocationHandler() {
			@Override
			public Object invoke(Object proxy, Method method, Object[] args) throws 			Throwable {
	
				System.out.println("增强开始");
				Object o = method.invoke(t, args);// 用目标对象来调用方法
				System.out.println("增强结束");
				return o;// o是调用方法的返回值
			}
		});

		InterfaceA proxy = (InterfaceA) proxyObject;
		proxy.test1();
	}
}
```
