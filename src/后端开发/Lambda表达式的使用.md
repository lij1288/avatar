## **Lambda表达式使用**

### 函数式接口

- 一个有且仅有一个抽象方法，但是可以有多个非抽象方法的接口，函数式接口可以被隐式转换为lambda表达式

### Lambda格式

- lambda表达式实际上是代码块的传递的实现 

```java
(parameters) -> expression

(parameters) -> {statements;}
```

### 注意事项

1. 括号里的参数可以省略其类型，编译器会根据上下文来推导参数的类型，也可以显示地指定参数类型，如果没有参数，括号内可以为空
2. 方法体如果只有一行可以省略大括号和分号
3. 可以替代匿名内部类
4. 函数式接口，加@FunctionalInterface注解不报错

### 方法引用

- 方法引用是lambda表达式的一种简写形式，如果lambda表达式只是调用一个特定的已经存在的方法，则可以使用方法引用

- 使用 :: 操作符将方法名和对象或类的名字分隔开，使用情况：
  1. 对象::实例方法
  2. 类::静态方法
  3. 类::实例方法
  4. 类::new

```java
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LambdaDemo {
	public static void main(String[] args) {
		// 1.
//		new Thread(new Runnable() {
//			@Override
//			public void run() {
//				System.out.println("匿名内部类");
//			}
//		}).start();

		new Thread(() -> System.out.println("Lambda表达式")).start();

		// 2.
		List<Integer> list = Arrays.asList(3, 5, 1, 6, 9, 8);

//		Collections.sort(list, new Comparator<Integer>() {
//			@Override
//			public int compare(Integer o1, Integer o2) {
//				return o2 - o1;
//			}
//		});

		Collections.sort(list, (o1, o2) -> o2 - o1);
		System.out.println(list);

		// 3.
		list.forEach(s -> System.out.println(s));
		list.forEach(System.out::println);
		
		Map<Integer, String> map = new HashMap<>();
		map.put(1, "a");
		map.put(2, "b");
		map.put(3, "c");
		map.forEach((k,v) -> System.out.println(k + ":" + v));
	}
}
```
