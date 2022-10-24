## **Redis的API使用**

### String数据类型

```scala
import redis.clients.jedis.Jedis

object StringValue {
  def main(args: Array[String]): Unit = {

    val jedis: Jedis = new Jedis("192.168.1.103", 6379)
    jedis.auth("root")
    // 选择使用的database, 公有16个, 默认使用0号database
//    jedis.select(0)

    jedis.set("online-users", "100")
    val r1 = jedis.get("online-users")
    println(r1)

    jedis.incrBy("online-users", 50)
    val r2 = jedis.get("online-users")
    println(r2)
      
    jedis.del("online-users")
  }
}
```

### Hash数据类型

```scala
import java.util

import redis.clients.jedis.Jedis

object HashValue {
  def main(args: Array[String]): Unit = {

    val jedis: Jedis = new Jedis("192.168.1.103", 6379)
    jedis.auth("root")

    jedis.hset("sichuan", "chengdu", "1000")
    jedis.hset("sichuan", "yaan", "1000")

    jedis.hincrByFloat("sichuan", "yaan", 500.5)

    val str: String = jedis.hget("sichuan", "yaan")
    println(str)

    val all: util.Map[String, String] = jedis.hgetAll("sichuan")

    // jeids由java编写, 取出的是java集合
    import scala.collection.JavaConversions._
    for(t <- all){
      println(s"key: ${t._1} -> value: ${t._2}")
    }

    jedis.hdel("sichuan", "yaan")
      
    jedis.del("sichuan")
  }
}
```



### List数据类型

```scala
import java.util

import redis.clients.jedis.Jedis

object ListValue {
  def main(args: Array[String]): Unit = {

    val jedis: Jedis = new Jedis("192.168.1.103", 6379)
    jedis.auth("root")

    jedis.lpush("lst1", "1", "2", "3")
    jedis.rpush("lst1", "a", "b", "c")

    jedis.lpop("lst1")
    jedis.rpop("lst1")

    val strings: util.List[String] = jedis.lrange("lst1", 0, -1)

    import scala.collection.JavaConversions._
    for(s <- strings){
      println(s)
    }
  }
}
```



### Set数据类型

```scala
import java.util

import redis.clients.jedis.Jedis

object SetValue {
  def main(args: Array[String]): Unit = {

    val jedis: Jedis = new Jedis("192.168.1.103", 6379)
    jedis.auth("root")

    jedis.sadd("s1", "1", "2", "3", "3", "5")


    jedis.srem("s1", "2")

    val boolean = jedis.sismember("s1", "2")
    println(boolean)

    val strings: util.Set[String] = jedis.smembers("s1")

    import scala.collection.JavaConversions._
    for(s <- strings){
      println(s)
    }
  }
}
```



### ZSet数据类型

```scala
import java.{lang, util}

import redis.clients.jedis.{Jedis, Tuple}

object ZSetValue {
  def main(args: Array[String]): Unit = {

    val jedis: Jedis = new Jedis("192.168.1.103", 6379)
    jedis.auth("root")

    jedis.zadd("z1", 90, "Aang")
    jedis.zadd("z1", 85, "Katara")
    jedis.zadd("z1", 75, "Sokka")

    jedis.zincrby("z1", 10, "Katara")


    val tuples: util.Set[Tuple] = jedis.zrangeWithScores("z1", 0, -1)

    import scala.collection.JavaConversions._
    for(t <- tuples){
      println(t)
    }

    val long: lang.Long = jedis.zrank("z1", "Katara")
    println(long)
  }
}
```