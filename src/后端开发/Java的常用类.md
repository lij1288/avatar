## Java的常用类

### 1. Object

- 构造方法

```java
public Object()
```

- equals

指示其他某个对象是否与此对象相等，如果两个对象指向同一块存储区域，方法返回true，否则返回false

```java
public boolean equals(Object obj)
```

重写equals方法

- 重写equals方法时，通常有必要重写hashCode方法，以维护hashCode方法的常规协定，该协定声明相等对象必须具有相等的hashcode
- 一般在比较对象是否是同一个对象时，同时使用hashCode和equals，先使用hashCode，若hashcode相等再使用equals
- Java语言规范要求equals方法应具有的特性
  1. 自反性：对于任何非空引用x，x.equals(x) 都应返回true
  2. 对称性：对于任何非空引用x和y，当且仅当y.equals(x)返回true时，x.equals(y)才应返回true
  3. 传递性：对于任何非空引用x, y和z，如果x.equals(y)返回true，并且y.equals(z)返回true，那么x.equals(z)应返回true
  4. 一致性：对于任何非空引用x和y，多次调用x.equals(y)始终返回true或始终返回false，前提是对象上equals比较中所用的信息没有被修改
  5. 对于任何非空引用x，x.equals(null)都应返回false

```java
//1.显示参数命名为othreObject，稍后需将它转换成另一个叫做other的变量
//2.检测this和otherObject是否引用同一个对象
	if(this == otherObject) {
        return true;
    }
//3.检测otherObject是否为null
	if(otherObject == null) {
        return false;
    }
//4.比较this和otherObject是否属于同一个类
//	如果equals的语义在每个子类中有所改变，就使用getClass（严格判断, 不考虑继承）检测
	if(getClass() != otherObject.getClass()) {
        return false;
    }
//  如果所有的子类都拥有统一的语义，就使用instanceof检测
	if(!(otherObject instanceof ClassName)) {
        return false;
    }
//5.将otherObject转换为相应的类类型变量
	ClassName other = (ClassName) otherObject;
//6/对所有需要比较的域进行比较，使用==比较基本类型域，使用equals比较对象域
	return field1 == other.field1
		&& Objects.equals(field2, other.field2)
        && ...;
//如果在子类中重新定义equals，就要在其中包含调用super.equals(other)
```


- getClass

返回此Object的运行时类（Class对象一般被称为字节码对象，该字节码对象中包含了类的所有信息）

```java
public final Class<?> getClass()
```

- hashCode

返回该对象的hashcode值（默认地址值经过运算得到的一个int值）

```java
public int hashCode()

//源码
public native int hashCode();
//native：修饰方法，被native修饰的方法底层一般是使用C语言实现的，效率比较高
```

- toString

返回该对象的字符串表示，该字符串由类名，@和此对象哈希码的无符号十六进制表示组成

```java
public String toString()

//源码
public String toString() {
	return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

### 2. String

- 内存分析

- 通过直接赋值创建的字符串，存储在常量池中，相同内容的字符串在常量池中只存储一份

  使用new创建的字符串，存储在堆空间中

  ```java
  public class StringDemo {
  	public static void main(String[] args) {
  		String s1 = "Hello";
  		String s2 = new String("Hello");
  
  		System.out.println(s1 == s2);// false
  		System.out.println(s1.equals(s2));// true
  		System.out.println(s1.hashCode() == s2.hashCode());// true
  		
  		String s3 = "Hello";
  		String s4 = new String("Hello");
  		
  		System.out.println(s1 == s3);// true
  		System.out.println(s2 == s4);// false
  	}
  }
  ```

- 使用+拼接字符串时，如果拼接的内容中存在变量，存放在堆内存中（底层使用new StringBuilder）

  如果都是常量，存放在常量池中

  ```java
  public class StringDemo {
  	public static void main(String[] args) {
  		String s1 = "Hello";
  		s1 += "World";// s = s + "World"
  		//s = (new StringBuilder(String.valueOf(s))).append("world").toString();堆
  
  		String s2 = "HelloWorld";// 常量池
  		String s3 = "Hello" + "World";// 常量池
  
  		System.out.println(s1 == s2);// false
  		System.out.println(s2 == s3);// true
  	}
  }
  ```

- 构造方法

```java
public String()
//创建一个空串("")

public String(byte[] bytes)
//使用平台的默认字符集解码指定的byte数组，构造一个新的String

public String(byte[] bytes,int offset,int length)
//offset：要解码的第一个byte的索引
//length：要解码的byte数

public String(char[] value)
//分配一个新的String，使其表示字符数组参数中当前包含的字符序列

public String(char[] value,int offset,int count)
//offset：要解码的第一个byte的索引
//count:要解码的byte数

public String(String original)
//初始化一个新创建的String对象，使其表示一个与参数相同的字符序列

public String(StringBuilder builder)

public String(StringBuffer buffer)

public String(int[] codePoints,int offset,int count)
//用数组中从offset开始的count个代码点构造一个字符串
```

- charAt

返回指定索引处的char值（返回指定位置的代码单元（code unit））

```java
public char charAt(int index)
```

- codePointAt

返回指定索引处的字符（Unicode代码点）

```java
public int codePointAt(int index)
```

- codePointCount

返回此字符串的指定文本范围中的Unicode代码点（code point）数

```java
public int codePointCount(int beginIndex,int endIndex)
//从指定的beginIndex处开始，直到索引endIndex-1处的字符
```

- offsetByCodePoints

返回此字符串中从给定的index处偏移codePointOffset个代码点的索引

```java
public int offsetByCodePoints(int index, int codePointOffset)
```

- codePoints

将这个字符串的码点作为一个流返回，可调用toArray将它们放在一个数组中（Interface CharSequence）

```java
default IntStream codePoints()
```

- compareTo

按照字典顺序做比较

```java
public int compareTo(String anotherString)

//源码
//若在某个索引处的字符不同，返回这类索引的最小值k处的两个char值的差，即
//this.charAt(k)-anotherString.charAt(k)
//若没有字符不同的索引位置）则返回两个字符串的长度差，即this.length()-anotherString.length()
public int compareTo(String anotherString) {
	int len1 = value.length;
	int len2 = anotherString.value.length;
	int lim = Math.min(len1, len2);
	char v1[] = value;
	char v2[] = anotherString.value;

	int k = 0;
	while (k < lim) {
		char c1 = v1[k];
		char c2 = v2[k];
		if (c1 != c2) {
			return c1 - c2;
		}
		k++;
	}
	return len1 - len2;
}
```

- compareToIgnoreCase

按字典顺序比较两个字符串，不考虑大小写

```java
public int compareToIgnoreCase(String str)
```

- concat

将指定字符串连接到此字符串的结尾

```java
public String concat(String str)
```

- contains

判断是否包含

```java
public boolean contains(CharSequence s)
```

- equals

比较字符串的内容

```java
public boolean equals(Object anObject)
```

- equalsIgnoreCase

忽略大小写比较字符串的内容

```java
public boolean equalsIgnoreCase(String anotherString)
```

- format

使用指定的格式字符串和参数返回一个格式化字符串

```java
public static String format(String format,Object... args)


public static String format(Locale l,String format,Object... args)
//使用指定的语言环境、格式字符串和参数返回一个格式化字符串
```

- getBytes

把字符串转为byte数组

```java
public byte[] getBytes()
//使用平台的默认字符集将此String编码为byte序列

public byte[] getBytes(Charset charset)
//使用给定的charset将此String编码为byte序列

public byte[] getBytes(String charsetName)throws UnsupportedEncodingException
//使用指定的字符集将此String编码为byte序列
//UnsupportedEncodingException - 如果指定的字符集不受支持
```

- getChars

将字符从此字符串复制到目标字符数组

```java
public void getChars(int srcBegin,int srcEnd,char[] dst,int dstBegin)
//复制srcBegin至sreEnd-1的字符到字符数组dst中，dstBegin为目标数组中的起始偏移量
```

- indexOf

返回指定字符串或字符第一次在字符串中出现的索引，不存在返回 -1

```java
public int indexOf(String str)
    
public int indexOf(String str,int fromIndex)
    
public int indexOf(int ch)
    
public int indexOf(int ch, int fromIndex)
//ch为一个字符（Unicode代码点）
```

- lastIndexOf

返回指定字符串或字符在此字符串中最后一次一次出现处的索引

```java
public int lastIndexOf(String str)

public int lastIndexOf(String str,int fromIndex)
//返回指定子字符串在此字符串中最后一次出现处的索引，从指定的索引开始反向搜索

public int lastIndexOf(int ch)

public int lastIndexOf(int ch,int fromIndex)
```

- isEmpty

是否为空串

```java
public boolean isEmpty()
```

- join

返回一个新字符串，用给定的定界符连接所有元素

```java
public static String join(CharSequence delimiter, CharSequence... elements)
```

- length

获取字符串的长度，长度等于字符串中Unicode代码单元（code unit）数（辅助字符采用一对连续的代码单元）

```java
public int length()
```

- matches

告知此字符串是否匹配给定的正则表达式，str.matches(regex)等效于Pattern.matches(regex, str)

```java
public boolean matches(String regex)
```

- replace

替换，返回新字符串

```java
public String replace(char oldChar,char newChar)

public String replace(CharSequence target,CharSequence replacement)
//该替换从字符串的开头朝末尾执行
System.out.println("aaa".replace("aa", "b"));//ba
```

- replaceAll

使用给定的replacement替换此字符串所有匹配给定的正则表达式的子字符串

```java
public String replaceAll(String regex,String replacement)
```

- replaceFirst

使用给定的replacement替换此字符串匹配给定的正则表达式的第一个子字符串

```java
public String replaceFirst(String regex,String replacement)
```

- split

根据给定正则表达式的匹配拆分此字符串

```java
public String[] split(String regex)
//所得数组中不包括结尾空字符串

public String[] split(String regex,int limit)
//limit参数控制模式应用的次数，因此影响所得数组的长度
//如果该限制n大于0，则模式将被最多应用n - 1次，数组的长度将不会大于n，而且数组的最后一项将包含所有超出最后匹配的定界符的输入
//如果n为非正，那么模式将被应用尽可能多的次数，而且数组可以是任何长度
//如果n为0，那么模式将被应用尽可能多的次数，数组可以是任何长度，并且结尾空字符串将被丢弃
```

- startsWith

是否以 ... 开始

```java
public boolean startsWith(String prefix)
    
public boolean startsWith(String prefix,int toffset)
//测试此字符串从指定索引开始的子字符串是否以指定前缀开始
```

- endsWith

是否以 ... 结束

```java
public boolean endsWith(String suffix)
```

- substring

返回一个新的字符串，它是此字符串的一个子字符串

```java
public String substring(int beginIndex)
    
public String substring(int beginIndex, int endIndex)
//从指定的beginIndex处开始，直到索引endIndex-1处的字符
//该子字符串的长度为endIndex-beginIndex
```

- toCharArray

将此字符串转换为一个新的字符数组

```java
public char[] toCharArray()
```

- toLowerCase

将此String中的所有字符都转换为小写

```java
public String toLowerCase()
//使用默认语言环境的规则将此String中的所有字符都转换为小写，等效于调用toLowerCase(Locale.getDefault())
    
public String toLowerCase(Locale locale)
//使用给定Locale的规则将此String中的所有字符都转换为小写
```

- toUpperCase

将此String中的所有字符都转换为小写

```java
public String toUpperCase()
//使用默认语言环境的规则将此String中的所有字符都转换为大写，等效于调用toUpperCase(Locale.getDefault())。 
    
public String toUpperCase(Locale locale)
//使用给定Locale的规则将此String中的所有字符都转换为大写
```

- trim

返回一个新字符串，删除原字符串头部和尾部的空格

```java
public String trim()
```

- valueOf

返回参数的字符串表示形式

```java
public static String valueOf(int i)
//参数类型：char、boolean、byte、short、int、long、float、double     

public static String valueOf(char[] data)

public static String valueOf(char[] data,int offset,int count)
//offset为子数组的第一个字符的索引（初始偏移量），count为长度

public static String valueOf(Object obj)
```

### 3. StringBuilder/Buffer

- 构造方法

```java
public StringBuilder()
//构造一个不带任何字符的字符串生成器，其初始容量为16个字符

public StringBuilder(int capacity)
//构造一个不带任何字符的字符串生成器，其初始容量由capacity参数指定

public StringBuilder(String str)
//构造一个字符串生成器，并初始化为指定的字符串内容，该字符串生成器的初始容量为16加上字符串参数的长度

public StringBuilder(CharSequence seq)
//构造一个字符串生成器，包含与指定的CharSequence相同的字符，该字符串生成器的初始容量为16加上CharSequence参数的长度
```

- append

将参数的字符串表示形式追加到此字符序列

```java
public StringBuilder append(int i)
//参数形式：char、boolean、int、long、float、double

public StringBuilder append(String str)
   
public StringBuilder append(char[] str)
//将char数组参数的字符串表示形式追加到此序列，等效于先使用String.valueOf(char[])方法将参数转换为字符串，然后将所得字符串的字符追加到此字符序列
   
public StringBuilder append(char[] str, int offset,int len)
//将char数组str中从索引offset开始的字符按顺序追加到此序列，此字符的长度增加len
//offset-要追加的第一个char的索引，len-要追加的char数  

public StringBuilder append(CharSequence s)
//向此Appendable追加指定的字符序列（Appendable）
    
public StringBuilder append(CharSequence s,int start,int end)
//start-要追加的子序列的起始索引，end-要追加的子序列的结束索引, 序列的长度将增加end - start

public StringBuilder append(Object obj)
//追加Object参数的字符串表示形式

public StringBuilder append(StringBuffer sb)
```

- appendCodePoint

将codePoint参数的字符串表示形式追加到此序列（追加一个代码点, 并将其转换为一个或两个代码单元）

```java
public StringBuffer appendCodePoint(int codePoint)
//等效于先使用Character.toChars(int)将char数组转换为字符串，然后将所得字符串的字符追加到此字符序列
```

- delete

移除此序列的子字符串中的字符

```java
public StringBuffer delete(int start,int end)
```

- deleteCharAt

移除此序列指定位置上的字符

(如果给定索引处的字符是增补字符，则此方法将不会移除整个字符，如果需要准确处理增补字符，那么可以通过调用 
Character.charCount(thisSequence.codePointAt(index))（用此序列取代thisSequence）来确定要移除的char数

```java
public StringBuilder deleteCharAt(int index)
```

- insert

将参数的字符串表示形式插入此序列中

```java
public StringBuilder insert(int offset,int i)
//第二个参数类型：char、boolean、int、long、float、double

public StringBuilder insert(int offset,String str)

public StringBuilder insert(int offset,Object obj)

public StringBuilder insert(int offset,char[] str)

public StringBuilder insert(int index,char[] str,int offset,int len)
//offset-将插入子数组中的第一个char的索引，len-将插入子数组中的char的数量。

public StringBuilder insert(int dstOffset,CharSequence s)

public StringBuilder insert(int dstOffset,CharSequence s,int start,int end)
//start-要插入的子序列的起始索引，end-要插入的子序列的结束索引，序列的长度将增加end - start
```

- length

返回长度（字符数，代码单元数量）

```java
public int length()
```

- replace

使用给定String中的字符替换此序列的子字符串中的字符

```java
public StringBuilder replace(int start,int end,String str)
```

- reverse

将此字符序列用其反转形式取代

```java
public StringBuilder reverse()
```

- setCharAt

将给定索引处的字符设置为ch

```java
public void setCharAt(int index,char ch)
```

- substring

截取此字符序列，返回一个新的字符串

```java
public String substring(int start)

public String substring(int start,int end)
```

- toString

返回此序列中数据的字符串表示形式

```java
public String toString()
```

### 4. Array

- get

返回指定数组对象中索引组件的值，如果该值是一个基本类型值，则自动将其包装在一个对象中

```java
public static Object get(Object array,int index)
    throws IllegalArgumentException,ArrayIndexOutOfBoundsException
```

- getLength

以int形式返回指定数组对象的长度

### 5. Arrays

- asList

返回一个受指定数组支持的固定大小的列表，对返回列表的更改会直接写到数组，但此列表不能进行add/remove操作（得到的是Arrays中的内部类，该类并没有实现add/remove，可以使用ArrayList(Collection<? extends E> c)创建一个新的ArrayList）

```java
public static <T> List<T> asList(T... a)

//此方法还提供了一个创建固定长度的列表的便捷方法，该列表被初始化为包含多个元素:
List<String> list = Arrays.asList("a", "b", "c");
```

- binarySearch

使用二分搜索法来搜索指定的数组，以获得指定的值或对象，调用前必须对数组进行升序排序

```java
public static int binarySearch(int[] a,int key)
public static int binarySearch(int[] a,int fromIndex,int toIndex,int key)
//数组类型为char、byte、short、int、long、float、double

public static int binarySearch(Object[] a,Object key)
public static int binarySearch(Object[] a,int fromIndex,int toIndex,Object key)
//在调用前，必须根据元素的自然顺序对范围进行升序排序，通过sort(Object[], int, int)方法

public static <T> int binarySearch(T[] a,T key,Comparator<? super T> c)
public static <T> int binarySearch(T[] a,int fromIndex,int toIndex,T key,Comparator<? super T> c)
//在调用前，必须根据指定的比较器对数组进行升序排序，通过sort(T[], Comparator)方法
```

- copyOf

返回一个类型相同的数组，截取或用默认值填充，以使副本具有指定的长度（通常用来增加数组的大小）

```java
public static int[] copyOf(int[] original,int newLength)
//参数及返回值类型为char、boolean、byte、short、int、long、float、double的数组

public static <T> T[] copyOf(T[] original,int newLength)

public static <T,U> T[] copyOf(U[] original,int newLength,Class<? extends T[]> newType)
```

- copyOfRange

将指定数组的指定范围复制到一个新数组

```java
public static int[] copyOfRange(int[] original,int from,int to)
//(char, boolean, byte, short, int, long, float, double)

public static <T> T[] copyOfRange(T[] original,int from,int to)

public static <T,U> T[] copyOfRange(U[] original,int from,int to,Class<? extends T[]> newType)
//所得数组属于newType类
```

- equals

如果两个指定类型的数组彼此相等，返回true（包括两个数组引用都为null）

```java
public static boolean equals(int[] a,int[] a2)
//char、boolean、byte、short、int、long、float、double

public static boolean equals(Object[] a,Object[] a2)
```

- deepEquals

如果两个指定类型的数组彼此是深层相等的，返回true（包括两个数组引用都为null）

```java
public static boolean deepEquals(Object[] a1,Object[] a2)

int[][] arr1 = {{1,2,3},{4,5,6},{7,8,9}};
int[][] arr2 = {{1,2,3},{4,5,6},{7,8,9}};
System.out.println(Arrays.toString(arr1));//[[I@15db9742, [I@6d06d69c, [I@7852e922]
System.out.println(Arrays.deepToString(arr1));//[[1, 2, 3], [4, 5, 6], [7, 8, 9]]
System.out.println(Arrays.toString(arr2));//[[I@70dea4e, [I@5c647e05, [I@33909752]
System.out.println(Arrays.deepToString(arr2));//[[1, 2, 3], [4, 5, 6], [7, 8, 9]]
System.out.println(Arrays.equals(arr1,arr2));//false
System.out.println(Arrays.deepEquals(arr1,arr2));//true
```

- fill

将数组的所有元素或指定范围的元素设为指定的值

```java
public static void fill(int[] a,int val)
public static void fill(int[] a,int fromIndex,int toIndex,int val)
//char、boolean、byte、short、int、long、float、double

public static void fill(Object[] a,Object val)
public static void fill(Object[] a,int fromIndex,int toIndex,Object val)
//将指定的Object引用分配给指定Object数组的所有元素或指定范围的元素
```

- hashCode

基于指定数组的内容返回hashcode

```java
public static int hashCode(int[] a)
//char、boolean、byte、short、int、long、float、double

public static int hashCode(Object[] a)
```

- sort

对指定的数组按数字或自然顺序升序进行排序

```java
public static void sort(int[] a)
public static void sort(int[] a,int fromIndex,int toIndex)
//char、byte、short、int、long、float、double

public static void sort(Object[] a)
//根据元素的自然顺序对指定对象数组按升序进行排序，数组中的所有元素都必须实现Comparable接口

public static void sort(Object[] a,int fromIndex,int toIndex)

public static <T> void sort(T[] a,Comparator<? super T> c)
//根据指定比较器产生的顺序对指定对象数组进行排序

public static <T> void sort(T[] a,int fromIndex,int toIndex,Comparator<? super T> c)
```

- toString

返回指定数组内容的字符串表示形式

```java
public static String toString(int[] a)
//char、boolean、byte、short、int、long、float、double

public static String toString(Object[] a)
//如果数组包含作为元素的其他数组，则通过从Object中继承的Object.toString()方法将它们转换为字符串，这描述了它们的标识，而不是它们的内容
```

- deepToString

返回指定数组深层的字符串表示形式

```java
public static String deepToString(Object[] a)
//如果数组包含作为元素的其他数组，则字符串表示形式包含其内容等，此方法是为了将多维数组转换为字符串而设计的
```

### 6. WrapperClass

#### 6.1 装箱和拆箱

- 装箱：把基本数据类型转成包装类
- 拆箱：把包装类转成基本数据类型

```java
//装箱
int a = 10;
Integer a2 = Integer.valueOf(a);
//拆箱
int a3 = a2.intValue();

//jdk1.5后，支持自动拆装箱
Integer a4 = a;
int a5 = a4;
```

#### 6.2 基本类型和字符串转换

```java
public class WrapperClassTest {
	public static void main(String[] args) {
		//基本数据类型转String
		String s1 = 27 + "";
		String s2 = String.valueOf(27);
		
		//String转基本数据类型
		Integer i1 = Integer.valueOf("27");
		int i2 = Integer.parseInt("27");
		
		//long类型不能加L，java.lang.NumberFormatException
//		Long l1 = Long.valueOf("100L");
//		long l2 = Long.parseLong("100L");
		
		Float f1 = Float.valueOf("10.0F");
		float f2 = Float.parseFloat("10.0F");
	}
}
```

#### 6.3 Integer

```java
/**
 * Integer
 *	 常用的基本进制转换
 *		public static String toBinaryString(int i)	 转成2进制的字符串
 *		public static String toOctalString(int i)	 转成8进制的字符串
 *		public static String toHexString(int i)		 转成16进制的字符串
 *	十进制到其他进制
 *		public static String toString(int i,int radix)	
 *	其他进制到十进制
 *		public static int parseInt(String s,int radix); 
 */
public class IntegerTest {

	public static void main(String[] args) {
		//100 转成二进制的字符串
		System.out.println(Integer.toBinaryString(100));//1100100
		//100 转成八进制的字符串
		System.out.println(Integer.toOctalString(100));//144
		//100 转成十六进制的字符串
		System.out.println(Integer.toHexString(100));//64
		
		//把100转成36进制（进制的范围：2-36，超过36返回原数值）
		System.out.println(Integer.toString(100,365));
		
		//把16进制中的abc转成10进制
		System.out.println(Integer.parseInt("abc",16));//2748
	}
}
```

- hashCode

```java
public int hashCode()
//返回该对象的hashcode，char、boolean、byte、short、int、long、float、double

public static int hashCode(int value)
//返回给定值的hashcode，char、boolean、byte、short、int、long、float、double
```

- intValue

以int类型返回该Integer的值

```java
public int intValue()
//char、boolean、byte、short、int、long、float、double
```

- valueOf

返回一个Integer实例（有符号）

```java
public static Integer valueOf(int i)
//char、boolean、byte、short、int、long、float、double

public static Integer valueOf(String s)throws NumberFormatException
//给定字符串表示的是十进制的整数，boolean、byte、short、int、long、float、double

public static Integer valueOf(String s,int radix)throws NumberFormatException
//给定字符串表示的是radix进制的整数，byte、short、int、long
```

- parseInt

将字符串参数解析为有符号的整数

```java
public static int parseInt(String s)throws NumberFormatException
//将字符串参数解析为有符号的整数，boolean、byte、short、int、long、float、double

public static int parseInt(String s,int radix)throws NumberFormatException
//其他进制转十进制，使用第二个参数指定的基数，将字符串参数解析为有符号的整数，byte、short、int、long
```

- toBinaryString

以二进制无符号整数形式返回一个整数参数的字符串表示形式，如果参数为负，那么无符号整数值为参数加上2^32

```java
public static String toBinaryString(int i)
//(int,long(2^64))
```

- toOctolString

以八进制无符号整数形式返回一个整数参数的字符串表示形式，如果参数为负，那么无符号整数值为参数加上2^32

```java
public static String toOctalString(int i)
//(int,long(2^64))
```

- toHexString

以十六进制无符号整数形式返回一个整数参数的字符串表示形式，如果参数为负，那么无符号整数值为参数加上2^32

```java
public static String toHexString(int i)
//(int,long(2^64))
```

- toString

返回一个表示指定整数的String对象

```java
public String toString()
//返回一个表示该Integer值的String对象，boolean、byte、short、int、long、float、double

public static String toString(int i)
//返回参数的字符串表示形式，boolean、byte、short、int、long、float、double

public static String toString(int i,int radix)
//十进制转其他进制，返回用第二个参数指定基数表示的第一个参数的字符串表示形式，byte、short、int、long
```

#### 6.4 Character

- isDigit

确定指定字符是否为数字

```java
public static boolean isDigit(char ch)
```

- isLowerCase

确定指定字符是否为小写字母

```java
public static boolean isLowerCase(char ch)

public static boolean isLowerCase(int codePoint)
```

- isUpperCase

确定指定字符是否为大写字母

```java
public static boolean isUpperCase(char ch)

public static boolean isUpperCase(int codePoint)
```

- toLowerCase

将字符参数转换为小写

```java
public static char toLowerCase(char ch)

public static int toLowerCase(int codePoint)
```

- toUpperCase

将字符参数转换为大写

```java
public static char toUpperCase(char ch)

public static int toUpperCase(int codePoint)
```

### 7. Math

- PI

比任何其他值都更接近pi的double值

```java
public static final double PI
```

- E

比任何其他值都更接近e的double值

```java
public static final double E
```

- abs

返回绝对值

```java
public static int abs(int a)
//(int, long, float, double)
```

- ceil

向上取整

```java
public static double ceil(double a)
```

- exp

返回自然常数（欧拉数）e的double次幂的值

```java
public static double exp(double a)
```

- log

返回 double 值的自然对数（底数是e）

```java
public static double log(double a)
```

- log10

返回double值的底数为10的对数

```java
public static double log10(double a)
```

- floor

向下取整

```java
public static double floor(double a)
```

- floorMod

解决对负数求余问题

```java
public static int floorMod(int x,int y)
    
public static long floorMod(long x,long )

//时针倒拨问题
int a = Math.floorMod(1 - 10, 12);// 3
```

- pow

返回第一个参数的第二个参数次幂的值

```java
public static double pow(double a, double b)
```

- sqrt   

返回正确舍入的double值的正平方根

```java
public static double sqrt(double a)
```

- random

求随机数, [0, 1)

```java
public static double random()
```

- round

对浮点数进行舍入运算（四舍五入取整）

```java
public static int round(float a)
    
public static long round(double a)
```

- sin

返回角的三角正弦

```java
public static double sin(double a)//弧度制

public static double cos(double a)//弧度制

public static double tan(double a)//弧度制

public static double asin(double a)

public static double acos(double a)

public static double atan(double a)
```

- atan2

将矩形坐标 (x, y) 转换成极坐标 (r,theta)，返回所得角theta  
该方法通过计算 y/x 的反正切值来计算相角theta，范围为从-pi到pi

```java
public static double atan2(double y,double x)
```

### 8. System

- arraycopy

复制源数组的一部分到目标数组

```java
public static void arraycopy(Object src,int srcPos,Object dest,int destPos,int length)
```

- currentTimeMillis

返回以毫秒为单位的当前时间（当前时间与协调世界时1970年1月1日午夜之间的时间差）

```java
public static long currentTimeMillis()
```

- nanoTime

返回最准确的可用系统计时器的当前值，以毫微秒（纳秒）为单位（只用来生成不重复的序列，不用来计算时间）

```java
public static long nanoTime()
```

- exit

终止当前正在运行的Java虚拟机，参数用作状态码，非0的状态码表示异常终止

该方法调用Runtime类中的exit方法，该方法永远不会正常返回，等效于调用Runtime.getRuntime().exit(n)

```java
public static void exit(int status)
```

- gc

运行垃圾回收器

```java
public static void gc()
```

### 9. Date

```java
import java.util.Date;

public class DateDemo {
	public static void main(String[] args) {
		Date d1 = new Date();
		System.out.println(d1);// Mon Jul 29 20:45:42 CST 2019
		
		Date d2 = new Date(0);
		System.out.println(d2);// Thu Jan 01 08:00:00 CST 1970
		
		System.out.println(d1.getTime());// 1564404342060
		System.out.println(System.currentTimeMillis());// 1564404342073
		
		d1.setTime(0);
		System.out.println(d1);// Thu Jan 01 08:00:00 CST 1970
	}
}
```



- 构造方法

```java
public Date()
//分配Date对象并初始化此对象，以表示分配它的时间

public Date(long date)
//分配Date对象并初始化此对象，以表示自从标准基准时间以来的指定毫秒数
```

- getTime

将日期对象转为毫秒值

```java
public long getTime()
```

- setTime

将日期设置为毫秒值对应的时间

```java
public void setTime(long time)
```

### 10. SimpleDateFormat

```java
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateDemo {
	public static void main(String[] args) throws ParseException {
		Date date = new Date();
		System.out.println(date);// Mon Jul 29 20:55:38 CST 2019
		
		SimpleDateFormat sdf = new SimpleDateFormat();
		String str = sdf.format(date);
		System.out.println(str);// 19-7-29 下午8:55
		
		SimpleDateFormat sdf2 = new SimpleDateFormat("HH:mm:ss:SSS yyyy-MM-dd");
		String str2 = sdf2.format(date);
		System.out.println(str2);// 20:55:38:489 2019-07-29
		
		SimpleDateFormat sdf3 = new SimpleDateFormat("yyyy-MM-dd HH/mm/ss");
		String str3 = "2019-11-26 00/00/00";
		Date date2 = sdf3.parse(str3);
		System.out.println(date2);// Tue Nov 26 00:00:00 CST 2019
	}
}
```

```java
SimpleDateFormat sdf = new SimpleDateFormat("dd/MMM/yyyy:hh:mm:ss", Locale.US);
Date date = sdf.parse("18/Sep/2013:12:32:45 +0000");
System.out.println(date);// Wed Sep 18 00:32:45 CST 2013
```

- 构造方法

```java
public SimpleDateFormat()
//默认的模式和默认语言环境的日期格式符号构造SimpleDateFormat

public SimpleDateFormat(String pattern)
//用给定的模式和默认语言环境的日期格式符号构造SimpleDateFormat

public SimpleDateFormat(String pattern,Locale locale)
//用给定的模式和给定语言环境的默认日期格式符号构造SimpleDateFormat
```

- format

```java
public final String format(Object obj)
//格式化一个对象以生成一个字符串（DateFormat）
```

- parse

```java
public Date parse(String source) throws ParseException
//从给定字符串的开始解析文本，以生成一个日期，该方法不使用给定字符串的整个文本（DateFormat）
```
