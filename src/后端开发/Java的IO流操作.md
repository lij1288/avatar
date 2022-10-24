## **Java的IO流操作**

### 1. File

- 文件或文件夹的描述对象

#### 1.1 构造方法

```java
import java.io.File;

public class FileDemo {
	public static void main(String[] args) {
		
		File f1 = new File("D:\\develop\\workspace\\iotest\\A.txt");
		
		File f2 = new File("D:\\develop\\workspace", "iotest\\A.txt");
		
		File f3 = new File("D:/develop/workspace");
		
		File f4 = new File(f3, "iotest\\A.txt");
	}
}
```

#### 1.2 创建删除重命名

```java
import java.io.File;
import java.io.IOException;

public class FileDemo {
	public static void main(String[] args) {
		
		try {
//			File f1 = new File("D:/develop/workspace/iotest/test/B.txt");
//			System.out.println(f1.createNewFile());
//			//java.io.IOException：系统找不到指定的路径（要求文件夹必须存在）
			
			File f2 = new File("D:/develop/workspace/iotest/C.txt");
			System.out.println(f2.createNewFile());//true
			
			File f3 = new File("D:/develop/workspace/iotest/test1");
			System.out.println(f3.mkdir());//true
			
			File f4 = new File("D:/develop/workspace/iotest/test1/test2/test3");
			System.out.println(f4.mkdirs());//true
			
			f3.delete();//false（文件夹有内容无法删除）
			
			f4.delete();//true
			
			File f5 = new File("D:/develop/workspace/iotest/D");
			f5.createNewFile();//得到的是文件，生成文件还是目录取决于调用的方法
			
			File f6 = new File("D:/develop/workspace/iotest/folder1/a.txt");
			File f7 = new File("D:/develop/workspace/iotest/folder2/b.txt");
			System.out.println(f6.renameTo(f7));//true
            // renameTo剪切文件或文件夹
            
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 1.3 判断功能

```java
import java.io.File;
import java.io.IOException;

public class FileDemo {
	public static void main(String[] args) {
		
		File f1 = new File("D:/develop/workspace/iotest/C.txt");
		System.out.println(f1.isDirectory());//false
		System.out.println(f1.isFile());//true
		System.out.println(f1.exists());//true
		System.out.println(f1.canRead());//true
		System.out.println(f1.canWrite());//true
		System.out.println(f1.isHidden());//false
	}
}
```

#### 1.4 基本获取功能

```java
import java.io.File;
import java.io.IOException;

public class FileDemo {
	public static void main(String[] args) throws IOException {
		
		File f1 = new File("D:/develop/workspace/iotest/A.txt");
        System.out.println(f1.getAbsolutePath());
        //D:\develop\workspace\iotest\folder1\a.txt
		System.out.println(f1.getPath());
        //D:\develop\workspace\iotest\folder1\a.txt
		
		File f2 = new File("text.txt");////相对路径，基准路径为eclipse的默认工作空间
		f2.createNewFile();
		System.out.println(f2.getAbsolutePath());
        //D:\develop\workspace\javase\javase\text.txt
		System.out.println(f2.getPath());
        //text.txt
		
		System.out.println(f1.getName());//A.txt
		System.out.println(f1.length());//9
		System.out.println(f1.lastModified());//1563421320978
	}
}
```

#### 1.5 高级获取功能

```java
import java.io.File;
import java.io.IOException;

public class FileDemo {
	public static void main(String[] args) {
		
		File f1 = new File("D:/develop/workspace/iotest");
		String[] arr = f1.list();
		for (String s : arr) {
			System.out.println(s);
		}
		
		File[] listFiles = f1.listFiles();
		for (File f : listFiles) { 
			System.out.println(f.getAbsolutePath());
			System.out.println(f.length());
			System.out.println(f.lastModified());
		}
	}
}
```

#### 1.6 过滤器的使用

```java
import java.io.File;
import java.io.FilenameFilter;

public class FileDemo {
	public static void main(String[] args) {
		
		File f1 = new File("D:/develop/workspace/iotest");
		
		File[] listFiles = f1.listFiles(new FilenameFilter() {

			@Override
			public boolean accept(File dir, String name) {
				File f = new File(dir, name);
				if(f.isFile() && name.toLowerCase().endsWith(".txt".toLowerCase())) {
					return true;
				}
				return false;
			}
		});
		
		for (File f : listFiles) {
			System.out.println(f.getAbsolutePath());
		}		
	}
}
```

#### 1.7 递归

##### 1.7.1 递归概述

- 递归：方法中调用方法本身的现象（递推 + 回归）
- 注意事项
  1. 要有出口，否则就是死递归
  2. 次数不能太多，否则内存溢出
  3. 构造方法不能递归使用

##### 1.7.2 递归遍历文件

```java
import java.io.File;

/**
 *	递归遍历目录下指定后缀名结尾的文件名称
 */
public class RecursionDemo {
	public static void main(String[] args) {
		
		findAllFiles("D:/develop/workspace/iotest", ".txt");
//		findAllFiles("D:/develop/workspace/123", ".txt");//目录不存在，listFiles = null
		
	}
	
	public static void findAllFiles(String path, String suffix) {
		//把路径包装成File
		File f = new File(path);
        
        //判断是文件还是文件夹
		if(f.isFile()) {//是文件
			if(f.getName().toLowerCase().endsWith(suffix.toLowerCase())) {
				System.out.println(f.getAbsolutePath());
			}
		}else {//是文件夹
			File[] listFiles = f.listFiles();
			if(listFiles != null && listFiles.length > 0) {
				for (File file : listFiles) {
					findAllFiles(file.getAbsolutePath(), suffix);
				}
			}
		}
	}
}
```

##### 1.7.3 递归删除文件

```java
import java.io.File;

/**
 *	递归删除目录下所有文件夹和文件
 */
public class RecursionDemo {
	public static void main(String[] args) {
		
		deleteAllFiles("D:/develop/workspace/iotest");
		
	}
	
	public static void deleteAllFiles(String path) {
		//把路径包装成File
		File f = new File(path);
		
		//判断是文件还是文件夹
		if(f.isFile()) {//是文件
			f.delete();
		}else {//是文件夹
			//获取子文件
			File[] listFiles = f.listFiles();
			if(listFiles != null && listFiles.length > 0) {
				for (File file : listFiles) {
					deleteAllFiles(file.getAbsolutePath());
				}
			}
			f.delete();//删除自己
		}
	}
}
```

##### 1.7.4 复制文件夹及文件

```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class CopyFileTest {
	public static void main(String[] args) throws IOException {
		copyAllFile("D:/iotest", "D:/dest");
	}
	
	public static void copyAllFile(String path, String dest) throws IOException {

		File f = new File(path);
		if(f.isFile()) {
			FileInputStream fis = new FileInputStream(path);
			FileOutputStream fos = new FileOutputStream(dest + "/" + f.getName());
			byte[] bs = new byte[1024];
			int len;
			while((len = fis.read(bs)) != -1) {
				fos.write(bs, 0, len);
			}
		}else {
			File dir = new File(dest, f.getName());
			dir.mkdir();
			File[] filelist = f.listFiles();
			for (File file : filelist) {
				copyAllFile(file.getAbsolutePath(), dir.getAbsolutePath());
			}                                       
		}
	}
}
```

### 2. IO流概述

#### 2.1 文件的本质

- 文件中存储的都是二进制的数据，能看到数据的具体形态，是因为各自的软件做了解码的工作

#### 2.2 字节和字符的区别

- 字节是存储容量的基本单位，1字节 = 8个二进制位

  字符是指字母、数字、汉字和各种符号

- 一个字符在计算机中用若干个字节的二进制数表示

  |       |  中文   | 英文/数字 |
  | :---: | :-----: | :-------: |
  |  GBK  | 2个字节 |  1个字节  |
  | UTF-8 | 3个字节 |  1个字节  |

- 计算机中所有的数据都可以使用字节表示，但只有纯文本文件才能使用字符表示

#### 2.3 读写和输入输出的关系

- 以程序为参照物
- 输入 ----- 读
- 输出 ----- 写

#### 2.3 IO流的分类

- 按流分类

  输入流 ----- Input

  输出流 ----- Output

- 按处理的单位分类

  字节流 ----- 以字节为单位进行处理（任何文件）

  字符流 ----- 以字符为单位进行处理（纯文本文件）

- 组合得到四个基类

  字节输入流 ----- InputStream

  字节输出流 ----- OutputStream

  字符输入流 ----- Reader

  字符输出流 ----- Writer

### 3. 文件字节流

#### 3.1 文件字节输出流

- 以字节为单位向文件中写数据（可以创建文件）

```java
import java.io.FileOutputStream;
import java.io.IOException;

public class FileOutPutStreamDemo {
	public static void main(String[] args) {
		FileOutputStream fos = null;//若在try里无法关流
		try {
            //创建一个文件字节输出流的对象
			fos = new FileOutputStream("D:/fos.txt");
			
			fos.write(97);
			fos.write(98);
			fos.write(99);//abc
			
			fos.write("文件字节流".getBytes());//文件字节流
            
			fos.write("文件字节流".getBytes(), 6, 3);//字
            
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if(fos != null) {//防止空指针异常
				try {
                    //关流
					fos.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
}
```

#### 3.2 自动关流

- 把流的定义语句放到try()中，程序运行完后自动关流
- 在try()中只能定义流的定义语句（实现AutoCloseable接口）

```java
import java.io.FileOutputStream;
import java.io.IOException;

public class FileOutPutStreamDemo {
	public static void main(String[] args) {

		try (
            	FileOutputStream fos = 
            	new FileOutputStream("D:/iotest/fos.txt", true);// 追加
        		){
			fos.write("文件字节流".getBytes());
            
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 3.3 文件字节输入流

- 以字节为单位从文件中读数据

```java
import java.io.FileInputStream;
import java.io.IOException;

public class FileInputStreamDemo {
	public static void main(String[] args) {
 
		try (
				FileInputStream fis = new FileInputStream("D:/iotest/ab.txt");
				){
			int a = fis.read();
			int b = fis.read();
//			int c = fis.read();

			System.out.println((char) a);// a
			System.out.println(b);// 98
//			System.out.println(c);//-1（没有内容可读）

			int d = fis.read();
			int e = fis.read();
			int f = fis.read();

			byte[] bytes1 = { (byte) d, (byte) e, (byte) f };
			String s1 = new String(bytes1);
			System.out.println(s1);// 文

			byte[] bytes2 = new byte[1024];
			int len = fis.read(bytes2);
			System.out.println(len);// 12
			System.out.println(new String(bytes2));// 件字节流（空格）
			System.out.println(new String(bytes2).length());
            // 1016，12字节+1012字节->4中文+1012空格

			String s2 = new String(bytes2, 0, len);
			System.out.println(s2);// 件字节流
			System.out.println(s2.length());// 4

		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

- 循环读取文件

```java
import java.io.FileInputStream;
import java.io.IOException;

public class FileInputStreamDemo {
	public static void main(String[] args) {
		
		try(
				FileInputStream fis = new FileInputStream("d:/iotest/test.txt");
				) {
            
			byte[] bs = new byte[1024];
			int len;
            //如果文件中没有内容可读，会返回-1
			while((len = fis.read(bs)) != -1) {
				System.out.println(new String(bs, 0, len));
			}
            
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 3.4 拷贝文件

- 从文件中一个一个地读取数组，然后再一个一个地写到文件中

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class CopyFileDemo {
	public static void main(String[] args) {
		
		try(
				FileInputStream fis = 
            		new FileInputStream("d:/iotest/folder1/src.jpg");
				FileOutputStream fos = 
            		new FileOutputStream("d:/iotest/folder2/dest.jpg");
				) {
			
			byte[] bs = new byte[1024];
			int len;
			while((len = fis.read(bs)) != -1) {
				fos.write(bs, 0, len);
			}
			System.out.println("拷贝成功");
            
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

### 4. 缓冲字节流

#### 4.1 缓冲字节流概述

- 使用字节流每次从文件中进行读写地时候，都需要和文件进行大量的IO交互，与磁盘做交互的效率是比较低的

  为了降低与磁盘的交互次数，使用缓冲字节流，缓冲字节流将数据放到缓冲区，我们直接和缓冲区做交互，可以提升效率，缓冲区默认大小为8K

#### 4.2 缓冲字节输出流

```java
import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class BufferedOutputStreamDemo {
	public static void main(String[] args) {
		
		try(
				BufferedOutputStream bos = new BufferedOutputStream(
                    new FileOutputStream("d:/iotest/bos.txt"));
				) {
			
			bos.write(97);
			bos.write("缓冲字节输出流".getBytes());
			bos.flush();//防止忘写关流
            
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 4.3 缓冲字节输入流

```java
import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;

public class BufferedInputStreamDemo {
	public static void main(String[] args) {
		
		try(
				BufferedInputStream bis = new BufferedInputStream(
                    new FileInputStream("d:/iotest/bis.txt"));
				) {
			
			byte[] bs = new byte[1024];
			int len;
			while((len = bis.read(bs)) != -1) {
				System.out.println(new String(bs, 0, len));
			}
            
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 4.4 拷贝文件

```java
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class CopyFileDemo {
	public static void main(String[] args) {
		
		try(
				BufferedInputStream bis = new BufferedInputStream(
                	new FileInputStream("d:/iotest/folder1/src.jpg"));
				BufferedOutputStream bos = new BufferedOutputStream(
                    new FileOutputStream("d:/iotest/folder2/dest.jpg"));
				) {
			
			byte[] bs = new byte[1024];
			int len;
			while((len = bis.read(bs)) != -1) {
				bos.write(bs, 0, len);
			}
			System.out.println("拷贝成功");
            
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

### 5. 转换流（字符流）

#### 5.1 字符流概述

- 字符流：字节流 + 编码

- 编码：将文字转成二进制

  解码：将二进制转成文件

- 字符流只能处理文本文件

- 应用场景

  1. 可以指定编码
  2. 可以把字节流转成字符流

#### 5.2 字符输出流

```java
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

public class OutputSreamWriterDemo {
	public static void main(String[] args) {
		
		try(
				OutputStreamWriter osw = new OutputStreamWriter(
					new FileOutputStream("d:/iotest/osw.txt"));
				) {
			
			osw.write(97);
			char[] chs = {'一', '二'};
			osw.write(chs, 0 ,1);//一
			osw.write("字符输出流");
	
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 5.3 字符输入流

```java
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

public class InputStreamReaderDemo {
	public static void main(String[] args) {
		
		try(
				InputStreamReader isr = new InputStreamReader(
					new FileInputStream("d:/iotest/isr.txt"));
				) {
			
			char[] chs = new char[1024];
			int len;
			while((len = isr.read(chs)) != -1) {
				System.out.println(new String(chs, 0, len));
			}
            
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 5.4 拷贝文件

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

public class CopyFileDemo {
	public static void main(String[] args) {
		
		try(
				InputStreamReader isr = new InputStreamReader(
					new FileInputStream("d:/iotest/folder1/src.txt"));
				OutputStreamWriter osw = new OutputStreamWriter(
					new FileOutputStream("d:/iotest/folder2/dest.txt"));
				) {
			
			char[] chs = new char[1024];
			int len;
			while((len = isr.read(chs)) != -1) {
				osw.write(chs, 0, len);
			}
			System.out.println("拷贝成功");
            
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

### 6. 简化流（字符流）

#### 6.1 简化流概述

- 不能指定编码，也不能把字节流转成字符流

#### 6.2 简化流写数据

```java
import java.io.FileWriter;
import java.io.IOException;

public class FileWriterDemo {
	public static void main(String[] args) {
		
		try(
				FileWriter fw = new FileWriter("d:/iotest/fw.txt");
				) {
			
			fw.write("简化流输出流");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 6.3 简化流读数据

```java
import java.io.FileReader;
import java.io.IOException;

public class FileReaderDemo {
	public static void main(String[] args) {
		
		try(
				FileReader fr = new FileReader("d:/iotest/fr.txt");
				) {
			
			char[] chs = new char[1024];
			int len;
			while((len = fr.read(chs)) != -1) {
				System.out.println(new String(chs, 0, len));
				
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 6.4 拷贝文件

```java
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class CopyFileDemo {
	public static void main(String[] args) {
		
		try(
				FileReader fr = new FileReader("d:/iotest/folder1/src.txt");
				FileWriter fw = new FileWriter("d:/iotest/folder2/dest.txt");
				) {
			
			char[] chs = new char[1024];
			int len;
			while((len = fr.read(chs)) != -1) {
				fw.write(chs, 0, len);
			}
			System.out.println("拷贝成功");
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 6.5 先写后读注意事项

- 在一个程序中向同一个文件先写数据再读回来，写完数据后要关流，否则会导致输出流继续占用文件，输入流无法读取数据

```java
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class NoticeDemo {
	public static void main(String[] args) {
		
		try(
				FileWriter fw = new FileWriter("d:/iotest/notice.txt");
				//代码执行到这里会检查文件是否存在，不存在会自动创建（目录不存在会报错）
				FileReader fr = new FileReader("d:/iotest/notice.txt");
				//代码执行到这里会检查文件是否存在，不存在会报错（系统找不到指定的文件）
				) {
			
			fw.write("先写后读注意事项");
			fw.close();//若不关流会继续占用文件，下面读不出来
			
			char[] chs = new char[1024];
			int len;
			while((len = fr.read(chs)) != -1) {
				System.out.println(new String(chs, 0, len));
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

### 7. 缓冲字符流

#### 7.1 缓冲字符流写数据

```java
import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

public class BufferedWriterDemo {
	public static void main(String[] args) {
		
		try(
				BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(
					new FileOutputStream("d:/iotest/bw.txt")));
				) {
			
			bw.write("缓冲字符流");
			bw.newLine();//缓冲字符流特有
			bw.write("写入数据");
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 7.2 缓冲字符流读数据

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class BufferedReaderDemo {
	public static void main(String[] args) {
		
		try(
				BufferedReader br = new BufferedReader(new FileReader("d:/iotest/br.txt"));
				) {
					
//			char[] chs = new char[1024];
//			int len;
//			while((len = br.read(chs)) != -1) {
//				System.out.println(new String(chs, 0, len));
			
			//拷贝文件尽量使用char[]，使用readLine/newLine拷贝文件可能会造成部分空行的丢失
			String line;
			while((line = br.readLine()) != null) {
				System.out.println(line);
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 7.3 拷贝文件

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

public class CopyFileDemo {
	public static void main(String[] args) {
		
		try(
				BufferedReader br = new BufferedReader(new InputStreamReader(
					new FileInputStream("d:/iotest/folder1/src.txt")));
				BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(
					new FileOutputStream("d:/iotest/folder2/dest.txt")));
				) {
			
			char[] chs = new char[1024];
			int len;
			while((len = br.read(chs)) != -1) {
				bw.write(chs, 0 , len);
			}
			System.out.println("拷贝成功");
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

### 8. 序列化和对象流

#### 8.1 序列化概述

- 序列化：把对象转成二进制

  反序列化：把二进制转成对象

  持久化：把内存数据存储到磁盘上

- 实现序列化的步骤

  1. 让类实现Serializable接口
  2. 使用ObjectOutputStream写数据：调用writeObject
  3. 使用ObjectInputStream读数据：调用readObject

- 注意事项

  > java.io.InvalidClassException: IOTest.Cat; local class incompatible: 
  >
  > stream classdesc serialVersionUID = -9099947994027219172, 
  >
  > local class serialVersionUID = -5637107044009983997

  由于模板改变导致

  解决方法

  1. 重写一遍，再读

  2. 生成序列化ID（光标放在类名上）

     > Add default serial version ID ----- 添加默认版本号
     >
     > Add generated serial version Id ----- 添加根据属性值生成的版本号


#### 8.2 对象流写入数据

```java
import java.io.Serializable;

public class Cat implements Serializable{
	
	private static final long serialVersionUID = -9099947994027219172L;
    
	String name;
	int age;
	
	public Cat(String name, int age) {
		this.name = name;
		this.age = age;
	}

	@Override
	public String toString() {
		return "Cat [name=" + name + ", age=" + age + "]";
	}
}
```

```java
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;

public class ObjectOutputStreamDemo {
	public static void main(String[] args) {
		
		try(
				ObjectOutputStream oos = new ObjectOutputStream(
                	new FileOutputStream("d:/iotest/cat"));
				) {
			
			Cat c = new Cat("Tom", 3);
			oos.writeObject(c);
			oos.writeUTF("以UTF-8格式写入此字符串");
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 8.3 对象流读取数据

```java
import java.io.FileInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;

public class ObjectInputStreamDemo {
	public static void main(String[] args) {
		
		try(
				ObjectInputStream ois = new ObjectInputStream(
                    new FileInputStream("d:/iotest/cat"));
				) {
			
			Object o = ois.readObject();
			System.out.println(o);
			System.out.println(o instanceof Cat);
			String s = ois.readUTF();
			System.out.println(s);
			
		} catch (IOException | ClassNotFoundException e) {
			e.printStackTrace();
		}
	}
}
```

### 9. Properties配置文件的读取

- 目的：便于维护
- 新建配置文件：在src右键 -> New -> File -> config.properties
- 步骤:
  1. 创建Properties对象
  2. 加载配置文件
  3. 使用对象获取配置文件中的信息

```java
import java.io.IOException;
import java.util.Properties;

/**
 * 	config.properties内容:
 *	date.format = yyyy-MM-dd
 */
public class PropertiesDemo {
	public static void main(String[] args) {
		
		try {
			
			//1. 创建Properties对象
			Properties p = new Properties();
			
			//2. ClassLoader：类加载器
			//不用jdk中的类名获取
			p.load(PropertiesDemo.class.getClassLoader().getResourceAsStream("config.properties"));
			
			//3. 获取信息
			String value = p.getProperty("date.format");
			System.out.println(value);//yyyy-MM-dd
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

### 10. 标准输入输出流

- System.in: InputStream

  > System.clas
  >
  > public final static InputStream in = null;

- System.out: OutputStream

  > System.class
  >
  > public final static PrintStream out = null;



### 11. 数据流

- DataOutputStream将数据按照原来的类型进行编码

- 文件大小19字节

```java
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;

public class DataStreamDemo {
	public static void main(String[] args) throws Exception {
		DataOutputStream dos = new DataOutputStream(new FileOutputStream("D:/iotest/employee"));
		Employee e = new Employee();
		e.setId(1);
		e.setName("Jerry");
		e.setSalary(8000);
		dos.writeInt(e.getId());
		dos.writeUTF(e.getName());
		dos.writeDouble(e.getSalary());
		dos.close();
		DataInputStream dis = new DataInputStream(new FileInputStream("D:/iotest/employee"));
		Employee temp = new Employee();
		temp.setId(dis.readInt());
		temp.setName(dis.readUTF());
		temp.setSalary(dis.readDouble());
		System.out.println(temp);
		dis.close();
	}
}
```

- 文件大小110字节

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

public class ObjectStreamDemo {
	public static void main(String[] args) throws Exception {
		ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("D:/iotest/employee"));
		Employee e = new Employee();
		e.setId(1);
		e.setName("Jerry");
		e.setSalary(8000);
		oos.writeObject(e);
		oos.close();
		ObjectInputStream ois = new ObjectInputStream(new FileInputStream("D:/iotest/employee"));
		Employee temp = (Employee) ois.readObject();
		System.out.println(temp);
		ois.close();
	}
}
```
