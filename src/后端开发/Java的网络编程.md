## **Java的网络编程**

### 1. 网络编程

#### 1.1 计算机网络

- 通过传输介质，通信设施和网络通信协议，把分散在不同地点的计算机设备互连起来，实现资源共享和数据传输的系统

#### 1.2 网络编程

- 编写程序使联网的设备之间进行数据传输

#### 1.3 网络模型

- 网络模型一般是指OSI七层参考模型和TCP/IP四层参考模型

- OSI模型（Open System Interconnection Reference Model，开放式系统互联通信参考模型）

  | **7. 应用层**     | **提供应用程序间通信**       |
  | :---------------- | :--------------------------- |
  | **6. 表示层**     | **处理数据格式, 数据加密等** |
  | **5. 会话层**     | **建立维护和管理会话**       |
  | **4. 传输层**     | **建立主机端到端连接**       |
  | **3. 网络层**     | **寻址和路由选择**           |
  | **2. 数据链路层** | **提供介质访问, 链路管理等** |
  | **1. 物理层**     | **比特流传输**               |

- TCP/IP协议（Transmission Control Protocol/Internet Protocol，传输控制协议/因特网互联协议）

  | **4. 应用层** | **处理特定的应用程序细节**                 |
  | ------------- | ------------------------------------------ |
  | **3. 传输层** | **为两台主机上的应用程序提供端到端的通信** |
  | **2. 网络层** | **处理分组在网络中的活动**                 |
  | **1. 链路层** | **处理与传输媒介的物理接口细节**           |

### 2. 网络编程三要素

#### 2.1 IP地址

- IP协议给因特网上的每台计算机和其它设备都规定的唯一的地址
- IP地址是一个32位的二进制数，通常被分割成4个8位二进制数（也就是4个字节），通常用”点分十进制“表示成a.b.c.d的格式，其中a、b、c、d都是0 ~ 255之间的十进制数

#### 2.2 端口号

- 端口是操作系统对软件的标识

- 端口包括物理端口和逻辑端口，物理端口是用于连接物理设备之间的接口，逻辑端口是指逻辑意义上用于区分服务的端口

#### 2.3 协议

- 2.3.1 UDP协议
  - UDP协议（User Datagram Protocol，用户数据报协议），为应用程序提供了一种无需建立连接就可以发送封装的IP数据报的方法
  - 将数据源和目的封装在数据包中，不需要建立连接，每个数据包的大小限制在64k，是不可靠连接，速度快
  - 一般用于即时通信，在线视频、网络语音电话等

- 2.3.2 TCP协议

  - TCP协议（Transmisssion Control Protocol，传输控制协议），一种面向连接的，可靠的，基于字节流的传输层通信协议
  - 建立连接，形成传输数据的通道，在连接中进行大数据量传输，通过三次握手完成连接，是可靠协议，效率低
  - 一般用于文件传输，收发邮件，远程登录等

- 2.3.3 协议对比

  - TCP是面向连接的传输控制协议，UDP提供了无连接的数据报服务
  
  - TCP具有高可靠性，确保传输数据的正确性，不出现丢失或乱序
  
    UDP在传输数据前不建立连接，不对数据报进行检查和修改，无须等待对方应答，所以会出现分组丢失、重复、乱序，应用程序需要负责传输可靠性方面的所有工作
  
  - UDP具有较好的实时性，工作效率较TCP协议高
  
    UDP段结构比TCP段结构简单, 因此网络开销也小

### 3. InetAddress

- java中用于获取IP地址的类，里面封装了IP地址，主机名等信息

```java
import java.net.InetAddress;
import java.net.UnknownHostException;

public class InetAddressDemo {
	public static void main(String[] args) {
		try {
			
			// 得到本机的InetAddress对象
			InetAddress ip1 = InetAddress.getLocalHost();
			System.out.println(ip1.getHostName());// DESKTOP-V2N4VF2
			System.out.println(ip1.getHostAddress());// 192.168.43.172
			
			// 得到其他设备的信息
			// 传主机名
			InetAddress ip2 = InetAddress.getByName("DESKTOP-5P8HI4R");
			System.out.println(ip2.getHostName());// DESKTOP-5P8HI4R
			System.out.println(ip2.getHostAddress());// 169.254.16.64
			//传IP
			InetAddress ip3 = InetAddress.getByName("169.254.16.64");
			System.out.println(ip3.getHostName());
            // DESKTOP-5P8HI4R（有时得不到主机名，会显示IP地址）
			System.out.println(ip3.getHostAddress());// 169.254.16.64
			
			// 得到本机的InetAddress对象
//			InetAddress ip4 = InetAddress.getByName("localhost");
			InetAddress ip4 = InetAddress.getByName("127.0.0.1");
			System.out.println(ip4.getHostName());// 127.0.0.1
			System.out.println(ip4.getHostAddress());// 127.0.0.1
			
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
	}
}
```

### 4. UDP协议编程

#### 传输数据

服务端接收一条客户端发送的数据，并打印

```java
//服务端连续运行导致异常：java.net.BindException: Address already in use: Cannot bind

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UdpServer {
	public static void main(String[] args) {
		try {
			
			// 1. 创建DatagramSocket对象，用于接收数据，并监听端口号
			@SuppressWarnings("resource")
			DatagramSocket ds = new DatagramSocket(1288);
			
			// 2. 创建一个空的数据报包，用来接收数据
			DatagramPacket dp = new DatagramPacket(new byte[64*1024], 64*1024);
			
			// 3. 接收数据报包
			ds.receive(dp);// 数据进入到了dp中
			
			// 4. 拆数据
			byte[] bs = dp.getData();
			int len = dp.getLength();
			InetAddress ip = dp.getAddress();// 客户端的发送IP的对象
			String str = new String(bs, 0, len);
			System.out.println(ip.getHostAddress() + " : " + str);
			
			// 5. 关闭资源
			ds.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

```java
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UdpClient {
	public static void main(String[] args) {
		try {
			
			// 1. 创建DatagramSocket对象，用于发送数据
			DatagramSocket ds = new DatagramSocket();
			
			// 2. 准备数据
			String str = "UDP传输数据";
			DatagramPacket dp = new DatagramPacket(str.getBytes(), 
                str.getBytes().length, InetAddress.getLocalHost(), 1288);
			
			// 3. 发送数据
			ds.send(dp);
			
			// 4. 关闭资源
			ds.close();
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
```

#### 循环录入

```java
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;

public class UdpServer {
	public static void main(String[] args) {
		
		try {
			
			@SuppressWarnings("resource")
			DatagramSocket ds = new DatagramSocket(1288);
			
			DatagramPacket dp = new DatagramPacket(new byte[64*1024], 64*1024);
			
			while(true) {
				ds.receive(dp);
				System.out.println(dp.getAddress().getHostAddress() + " : " + 
					new String(dp.getData(), 0, dp.getLength()));
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

```java
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.util.Scanner;

public class UdpClient {
	public static void main(String[] args) {
		
		try {
			
			DatagramSocket ds = new DatagramSocket();
			Scanner sc = new Scanner(System.in);
			String line;
			while((line = sc.nextLine()) != null) {
				DatagramPacket dp = new DatagramPacket(
					line.getBytes(), line.getBytes().length, InetAddress.getLocalHost(), 1288);
				ds.send(dp);
				if("over".equals(line)) {
					break;
				}
			}
			ds.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
```

#### 聊天室

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ChatRoomSystem {
	public static void main(String[] args) {
		
//		new Thread(new ChatRoomServer()).start();
//		try {
//			Thread.sleep(30);// 让Server先运行
//		} catch (InterruptedException e) {
//			e.printStackTrace();
//		}
//		new Thread(new ChatRoomClient()).start();
		
		//线程池
		ExecutorService pool = Executors.newFixedThreadPool(10);
		pool.execute(new ChatRoomServer());
		try {
			Thread.sleep(30);// 让Server先运行
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		pool.execute(new ChatRoomClient());
	}
}
```

```java
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;

public class ChatRoomServer implements Runnable{

	@Override
	public void run() {
		try {
			
			DatagramSocket ds = new DatagramSocket(1288);
			DatagramPacket dp = new DatagramPacket(new byte[64*1024], 64*1024);
			while(true) {
				ds.receive(dp);
				System.out.println(dp.getAddress().getHostAddress() + " : " + 
					new String(dp.getData(), 0, dp.getLength()));
				
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

```java
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.util.Scanner;

public class ChatRoomClient  implements Runnable {

	@Override
	public void run() {
		try {
			
			DatagramSocket ds = new DatagramSocket();
			Scanner sc = new Scanner(System.in);
			String line;
			while((line = sc.nextLine()) != null) {
				DatagramPacket dp = new DatagramPacket(line.getBytes(), line.getBytes().length, InetAddress.getByName("192.168.255.255"), 1288);

				ds.send(dp);
				if("over".equals(line)) {
					break;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
```

### 5. TCP协议编程

#### 传输数据

```java
//先运行客户端导致异常：java.net.ConnectException: Connection refused: connect

import java.io.IOException;
import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class TcpServer {
	public static void main(String[] args) {
		
		try {
			
			// 1. 创建服务端的对象，并监听端口号
			ServerSocket ss = new ServerSocket(1288);
			
			// 2. 建立连接，得到客户端的Socket对象
			Socket s = ss.accept();
			
			// 3. 获取数据，使用输入流
			InputStream in = s.getInputStream();
			
			// 4. 读取数据
			byte[] bs = new byte[1024];
			int len;
			while((len = in.read(bs)) != -1) {
				System.out.println(new String(bs, 0, len));
			}
			
			in.close();
			s.close();
			ss.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

```java
import java.io.IOException;
import java.io.OutputStream;
import java.net.Socket;

public class TcpClient {
	public static void main(String[] args) {
		
		try {
			
			Socket s = new Socket("127.0.0.1", 1288);
			OutputStream out = s.getOutputStream();
			
			out.write("TCP".getBytes());
			
			out.close();
			s.close();// 关闭Socket的时候，会写过去一个结束的标志
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 阻塞问题

```java
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class TcpServer {
	public static void main(String[] args) {
		
		try {
			
			// 1. 创建服务端的对象，并监听端口号
			ServerSocket ss = new ServerSocket(1288);
			
			// 2. 建立连接，得到客户端的Socket对象
			Socket s = ss.accept();
			
			// 3. 获取数据，使用输入流
			InputStream in = s.getInputStream();
			
			// 4. 读取数据
			byte[] bs = new byte[1024];
			int len;
			while((len = in.read(bs)) != -1) {// 阻塞在while循环
				System.out.println(new String(bs, 0, len));
			}
			
			// 服务端返回给客户端，使用输出流
			OutputStream out = s.getOutputStream();
			out.write("TCP传输数据 --- byServer".getBytes());
			
			out.close();
			in.close();
			s.close();
			ss.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

```java
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class TcpClient {
	public static void main(String[] args) {
		
		try {
			
			Socket s = new Socket("localhost", 1288);
			OutputStream out = s.getOutputStream();
			
			out.write("TCP传输数据 --- byClient".getBytes());
			
//			// 解决阻塞的第一种方法（调用后不能再使用OutputStream）
//			s.shutdownOutput();// 把结束的标志写过去
//			s.getOutputStream();// java.net.SocketException: Socket output is shutdown
			
			// 解决阻塞的第二种方法
			//自己定义结束的标志，缓冲字符流的newLine
			
			InputStream in = s.getInputStream();
			byte[] bs = new byte[1024];
			int len;
			while((len = in.read(bs)) != -1) {
				System.out.println(new String(bs, 0, len));
			}
			
			in.close();
			out.close();
			s.close();// 关闭Socket的时候，会写过去一个结束的标志
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 缓冲字符流传输数据

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class ServerDemo {
	public static void main(String[] args) {
		
		try {
			
			ServerSocket ss = new ServerSocket(1288);
			System.out.println("服务端启动");
			Socket s = ss.accept();
			InputStream in = s.getInputStream();
			//包装成缓冲字符流
			BufferedReader br = new BufferedReader(new InputStreamReader(in));
			BufferedWriter bw = new BufferedWriter(
                new OutputStreamWriter(s.getOutputStream()));
			
			String str =br.readLine();
			System.out.println(str);
			
			bw.write("缓冲字符流传输数据 --- byServer");
			bw.newLine();
			bw.flush();
			
            bw.close();
            br.close();
			s.close();
			ss.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.Socket;

public class ClientDemo {
	public static void main(String[] args) {
		
		try {
			
			Socket s = new Socket("localhost", 1288);
			OutputStream out = s.getOutputStream();
			//包装成缓冲字符流
			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(out));
			BufferedReader br = new BufferedReader(
                new InputStreamReader(s.getInputStream()));
			
			bw.write("缓冲字符流传输数据 --- byClient");
			bw.newLine();
			bw.flush();
			
			System.out.println(br.readLine());
			
            bw.close();
            br.close();
			s.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 录入并发送

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;

public class ServerDemo {
	public static void main(String[] args) {
		
		try {
			
			ServerSocket ss = new ServerSocket(1288);
			Socket s = ss.accept();
			InetAddress ip = s.getInetAddress();
			System.out.println(ip.getHostAddress() + " connected...");
			BufferedReader br = new BufferedReader(
                new InputStreamReader(s.getInputStream()));
			String line;
			while((line = br.readLine()) != null) {
				System.out.println(line);
			}
			
            br.close();
			s.close();
			ss.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

```java
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.Scanner;

public class ClientDemo {
	public static void main(String[] args) {
		
		try {
			
			Socket s = new Socket("localhost", 1288);
			Scanner sc = new Scanner(System.in);
			BufferedWriter bw = new BufferedWriter(
                new OutputStreamWriter(s.getOutputStream()));
			
			String line;
			while((line = sc.nextLine()) != null) {
				bw.write(line);
				bw.newLine();
				bw.flush();
				if("over".equals(line)) {
					break;
				}
			}
			
            bw.close();
			s.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 键盘录入大写返回

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;

public class ServerDemo {
	public static void main(String[] args) {
		
		try {
			
			ServerSocket ss = new ServerSocket(1288);
			Socket s = ss.accept();
			InetAddress ip = s.getInetAddress();
			System.out.println(ip.getHostAddress() + " connected...");
			BufferedReader br = new BufferedReader(
                new InputStreamReader(s.getInputStream()));
			BufferedWriter bw = new BufferedWriter(
                new OutputStreamWriter(s.getOutputStream()));
			
			String line;
			while((line = br.readLine()) != null) {
				System.out.println(line);
				
				bw.write(line.toUpperCase());
				bw.newLine();
				bw.flush();
				
				// 若不加发over会异常，异常位置为while条件判断语句
				// java.net.SocketException: Software caused connection abort: recv failed
				if("over".equals(line)) {
					break;
				}
			}
			
            bw.close();
            br.close();
			s.close();
			ss.close();
			
		} catch (IOException e) {
			System.out.println("客户端异常");
			e.printStackTrace();
		}
	}
}
```

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.Scanner;

public class ClientDemo {
	public static void main(String[] args) {
		try {
			
			Socket s = new Socket("localhost", 1288);
			Scanner sc = new Scanner(System.in);
			BufferedWriter bw = new BufferedWriter(
                new OutputStreamWriter(s.getOutputStream()));
			BufferedReader br = new BufferedReader(
                new InputStreamReader(s.getInputStream()));
			
			String line;
			while((line = sc.nextLine()) != null) {
				bw.write(line);
				bw.newLine();
				bw.flush();
				if("over".equals(line)) {
					break;
				}
				System.out.println(br.readLine());
			}
			
            bw.close();
            br.close();
			s.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 上传图片

1. 客户端从本地读取一张图片
2. 客户端和服务端建立网络连接，获取输出流
3. 使用输出流将读取的图片写到服务端
4. 服务端读取客户端发来的图片，保存到本地

```java
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class ServerDemo {
	public static void main(String[] args) {
		
		try {
			
			// 1. 和客户端建立连接
			ServerSocket ss = new ServerSocket(1288);
			Socket s = ss.accept();
			
			// 2. 读取数据
			BufferedInputStream bis = new BufferedInputStream(s.getInputStream());
			
			// 3. 写到服务器的本地
			BufferedOutputStream bos = new BufferedOutputStream(
                new FileOutputStream("d:/iotest/test.jpg"));
			
			byte[] bs = new byte[1024];
			int len;
			while((len = bis.read(bs)) != -1) {
				bos.write(bs, 0, len);
			}
			bos.flush();
			
            bos.close();
            bis.close();
			s.close();
			ss.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

```java
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.Socket;

public class ClientDemo {
	public static void main(String[] args) {
		
		try {
			
			// 1. 从本地读取一张图片
			BufferedInputStream bis = new BufferedInputStream(
                new FileInputStream("d:/src.jpg"));
			
			// 2. 和服务器建立网络通讯
			Socket s = new Socket("127.0.0.1", 1288);
			BufferedOutputStream bos = new BufferedOutputStream(s.getOutputStream());
			
			// 3. 把数据写给服务器
			byte[] bs = new byte[1024];
			int len;
			while((len = bis.read(bs)) != -1) {
				bos.write(bs, 0, len);
			}
			bos.flush();
			
            bos.close();
            bis.close();
			s.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

#### 并发上传图片

1. 支持多个客户端上传（while(true)）

2. 可以同时上传（多线程）

```java
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ServerDemo {
	public static void main(String[] args) {
		
		try {
			
			ServerSocket ss = new ServerSocket(1288);
			// 支持多个客户端上传
			
			ExecutorService pool = Executors.newFixedThreadPool(25);
			while(true) {
				Socket s = ss.accept();
				pool.execute(new UploadTask(s));
				
//				new Thread(new UploadTask(s)).start();	
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}

class UploadTask implements Runnable{
	
	Socket s;// 读取数据需要使用s
	public UploadTask(Socket s) {
		this.s = s;
	}
	
	@Override
	public void run() {
		
		try {
			
			// 2. 读取数据
			BufferedInputStream bis = new BufferedInputStream(s.getInputStream());
			
			// 3. 写到服务器的本地
			BufferedOutputStream bos = new BufferedOutputStream(
				new FileOutputStream("d:/iotest/" + System.nanoTime()+".jpg"));
			byte[] bs = new byte[1024];
			int len;
			while((len = bis.read(bs)) != -1) {
				bos.write(bs, 0, len);
			}
			bos.flush();
			
			bos.close();// s.close()不能关闭bos，不能删除图片
			bis.close();
			s.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

```java
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.Socket;

public class ClientDemo {
	public static void main(String[] args) {
		
		try {
			for(int i = 0; i < 25; i++) {
				// 1. 从本地读取一张图片
				BufferedInputStream bis = new BufferedInputStream(
					new FileInputStream("d:/src.jpg"));
				
				// 2. 和服务端建立网络通讯
				Socket s =new Socket("127.0.0.1", 1288);
				BufferedOutputStream bos = new BufferedOutputStream(
                    s.getOutputStream());
				
				// 3. 把数据写给服务器
				byte[] bs = new byte[1024];
				int len;
				while((len = bis.read(bs)) != -1) {
					bos.write(bs, 0, len);
				}
				bos.flush();
				
				bos.close();
				bis.close();
				s.close();
			}
	
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```
