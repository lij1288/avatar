## **Scala的并发编程**

### Master

```scala
import akka.actor.{Actor, ActorSystem, Props}
import com.typesafe.config.ConfigFactory
import scala.concurrent.duration._
import scala.collection.mutable

class Master extends Actor {

  val id2worker = new mutable.HashMap[String, WorkerInfo]()
  val CHECK_INTEVAL = 10000

  // 在preStart中启动定时器，定期检查超时的Worker，然后剔除
  override def preStart(): Unit = {

    import context.dispatcher

    context.system.scheduler.schedule(0 milliseconds, CHECK_INTEVAL milliseconds, self, CheckTimeOutWorker)

  }

  // Actor用于接收消息的方法
  override def receive: Receive = {

    // Worker发送给Master的注册消息
    case RegisterWorker(id, memory, cores) => {

      // 将数据封装起来保存到内存中
      val workerInfo = new WorkerInfo(id, memory, cores)
      id2worker(id) = workerInfo
      println(workerInfo)
      // Master向Worker发送注册成功消息
      sender() ! RegisteredWorker
    }
    // Worker发送给Master的心跳消息（周期性的）
    case Heartbeat(workerId) => {

      // 根据workerId到id2worker中查找对应的WorkInfo
      if(id2worker.contains(workerId)){

        // 根据workerId取出WorkerInfo
        val workerInfo = id2worker(workerId)
        // 更新最近一次心跳时间
        val currentTime = System.currentTimeMillis()
        workerInfo.lastUpdateTime = currentTime
      }
    }
    // Master发送给自己的消息
    case CheckTimeOutWorker => {

      // 取出超时的Worker
      val currentTime = System.currentTimeMillis()
      val workers = id2worker.values
      val deadWrokers = workers.filter(currentTime - _.lastUpdateTime > 10000)
      // 移除超时的Worker
      deadWrokers.foreach(id2worker -= _.id)

      println(id2worker.size + " Workers alive")
    }
  }

}

object Master {

  val MASTER_ACTOR_SYSTEM = "MASTER_ACTOR_SYSTEM"
  val MASTER_ACTOR = "MASTER_ACTOR"

  // 程序执行的入口
  def main(args: Array[String]): Unit = {

    val host = args(0)
    val port = args(1).toInt
    val configStr =
      s"""
        |akka.actor.provider = "akka.remote.RemoteActorRefProvider"
        |akka.remote.netty.tcp.hostname = "$host"
        |akka.remote.netty.tcp.port = "$port"
        |""".stripMargin
    // 创建ActorSystem --- 单例
    // 通过配置工厂，解析字符串
    val conf = ConfigFactory.parseString(configStr)
    val actorSystem = ActorSystem(MASTER_ACTOR_SYSTEM, conf)
    // 通过ActorSystem创建Actor
    // 通过反射创建指定类型的Actor的实例
    val masteractor = actorSystem.actorOf(Props[Master], MASTER_ACTOR)

  }
}
```

### Worker

```scala
import java.util.UUID

import akka.actor.{Actor, ActorSelection, ActorSystem, Props}
import com.typesafe.config.ConfigFactory

import scala.concurrent.duration._

class Worker(val masterHost: String, val masterPort: Int, val memory: Int, val cores: Int) extends Actor {

  var masterRef: ActorSelection = _
  val WORKER_ID = UUID.randomUUID().toString
  val HEARTBEAT_INTERVAL = 5000

  // 生命周期方法，一定执行并按照一定顺序
  // 在构造方法之后，receive方法之前，执行一次preStart
  override def preStart(): Unit = {

    // Worker向Master建立网络连接，返回Master的代理对象
    masterRef = context.actorSelection(s"akka.tcp://${Master.MASTER_ACTOR_SYSTEM}@$masterHost:$masterPort/user/MASTER_ACTOR")

    // Worker向Master发送注册消息
    masterRef ! RegisterWorker(WORKER_ID, 8192, 8)
  }

  // Actor用于接收消息的方法
  override def receive: Receive = {

    // Master发送给Worker的注册成功消息
    case RegisteredWorker => {
      println("Master: Registered successfully")
      // 导入隐式转换
      import context.dispatcher
      // 启动一个定时器，定期向Master发送心跳，使用Akka封装的定时器
      // Worker定期给自己发送消息，然后再向Master发送心跳消息
      context.system.scheduler.schedule(0 milliseconds, HEARTBEAT_INTERVAL milliseconds, self, SendHeartbeat)
    }
    // Worker发送给自己的消息
    case SendHeartbeat => {

      // Worker向Master发送心跳消息
      masterRef ! Heartbeat(WORKER_ID)
    }
  }
}

object Worker {

  val WORKER_ACTOR_SYSTEM = "WORKER_ACTOR_SYSTEM"
  val WORKER_ACTOR = "WORKER_ACTOR"

  // 程序执行的入口
  def main(args: Array[String]): Unit = {

    val masterHost = args(0)
    val masterPort = args(1).toInt
    val workerHost = args(2)
    val workerPort = args(3).toInt
    val memory = args(4).toInt
    val cores = args(5).toInt
    val configStr =
      s"""
         |akka.actor.provider = "akka.remote.RemoteActorRefProvider"
         |akka.remote.netty.tcp.hostname = "$workerHost"
         |akka.remote.netty.tcp.port = "$workerPort"
         |""".stripMargin
    // 创建ActorSystem --- 单例
    // 通过配置工厂，解析字符串
    val conf = ConfigFactory.parseString(configStr)
    val actorSystem = ActorSystem(WORKER_ACTOR_SYSTEM, conf)
    // 通过ActorSystem创建Actor
    // 通过反射创建指定类型的Actor的实例
    val workeractor = actorSystem.actorOf(Props(new Worker(masterHost, masterPort, memory, cores)), WORKER_ACTOR)

  }
}
```

#### Message

```scala
// Worker发送给Master的注册消息，case class默认实现了序列化接口
case class RegisterWorker(id: String, memory: Int, cores: Int)

// Master发送给Worker的注册成功消息
case object RegisteredWorker

// Worker发送给Master的心跳消息
case class Heartbeat(workerId: String)

// Workder发送给自己的消息
case object SendHeartbeat

// Master发送给自己的消息
case object CheckTimeOutWorker
```

#### WorkerInfo

```scala
class WorkerInfo(val id: String, var memory: Int, var cores: Int) {

  var lastUpdateTime: Long = _

  override def toString = s"WorkerInfo($id, $memory, $cores)"
}

```

- pom.xml

```xml
    <!-- 导入scala的依赖 -->
    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <encoding>UTF-8</encoding>
        <scala.version>2.11.12</scala.version>
        <scala.compat.version>2.11</scala.compat.version>
        <akka.version>2.4.17</akka.version>
    </properties>


    <dependencies>
        <!-- scala的依赖 -->
        <dependency>
            <groupId>org.scala-lang</groupId>
            <artifactId>scala-library</artifactId>
            <version>${scala.version}</version>
        </dependency>

        <!-- akka actor依赖 -->
        <dependency>
            <groupId>com.typesafe.akka</groupId>
            <artifactId>akka-actor_2.11</artifactId>
            <version>${akka.version}</version>
        </dependency>

        <!-- akka远程通信依赖 -->
        <dependency>
            <groupId>com.typesafe.akka</groupId>
            <artifactId>akka-remote_2.11</artifactId>
            <version>${akka.version}</version>
        </dependency>

    </dependencies>


    <build>
        <pluginManagement>
            <plugins>
                <!-- 编译scala的插件 -->
                <plugin>
                    <groupId>net.alchim31.maven</groupId>
                    <artifactId>scala-maven-plugin</artifactId>
                    <version>3.2.2</version>
                </plugin>
                <!-- 编译java的插件 -->
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.5.1</version>
                </plugin>
            </plugins>
        </pluginManagement>
        <plugins>
            <plugin>
                <groupId>net.alchim31.maven</groupId>
                <artifactId>scala-maven-plugin</artifactId>
                <executions>
                    <execution>
                        <id>scala-compile-first</id>
                        <phase>process-resources</phase>
                        <goals>
                            <goal>add-source</goal>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>scala-test-compile</id>
                        <phase>process-test-resources</phase>
                        <goals>
                            <goal>testCompile</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <executions>
                    <execution>
                        <phase>compile</phase>
                        <goals>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>


            <!-- 打jar插件 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>2.4.3</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <filters>
                                <filter>
                                    <artifact>*:*</artifact>
                                    <excludes>
                                        <exclude>META-INF/*.SF</exclude>
                                        <exclude>META-INF/*.DSA</exclude>
                                        <exclude>META-INF/*.RSA</exclude>
                                    </excludes>
                                </filter>
                            </filters>

                            <transformers>
                                <transformer implementation="org.apache.maven.plugins.shade.resource.AppendingTransformer">
                                    <resource>reference.conf</resource>
                                </transformer>

                                <!-- 指定main方法 -->
                                <!--<transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">-->
                                <!--<mainClass>cn._51doit.rpc.Master</mainClass>-->
                                <!--</transformer>-->
                            </transformers>

                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```
