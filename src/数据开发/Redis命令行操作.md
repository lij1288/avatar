## **Redis的命令行操作**

### String数据类型

- 创建获取增减

> 192.168.1.103:6379> set online-users 50
>
> OK
>
> 192.168.1.103:6379> set online-users 100
>
> OK
>
> 192.168.1.103:6379> keys *
>
> 1) "online-users"
>
> 192.168.1.103:6379> get online-users
>
> "100"
>
> 192.168.1.103:6379> incr online-users
>
> (integer) 101
>
> 192.168.1.103:6379> decr online-users
>
> (integer) 100
>
> 192.168.1.103:6379> incrby online-users 50
>
> (integer) 150
>
> 192.168.1.103:6379> incrby online-users -30
>
> (integer) 120
>
> 192.168.1.103:6379> decrby online-users -30
>
> (integer) 150

- 获取value长度

> 192.168.1.103:6379> strlen online-users
>
> (integer) 3

- 设置超时时间

> 192.168.1.103:6379> set 18301581288 3545 ex 300
>
> OK

- 创建获取删除多个kv

> 192.168.1.103:6379> mset k1 v1 k2 v2
>
> OK
>
> 192.168.1.103:6379> mget k1 k2
>
> 1) "v1"
> 2) "v2"
>
> 192.168.1.103:6379> del k1 k2
>
> (integer) 2

### Hash数据类型

- 创建获取

> 192.168.1.103:6379> hset Aang age 12
>
> (integer) 1
>
> 192.168.1.103:6379> hget Aang age
>
> "12"

- 增减

> 192.168.1.103:6379> hincrby Aang age 3
>
> (integer) 15

- 删除value中的key

> 192.168.1.103:6379> hdel Aang age
>
> (integer) 1

- 删除key

> 192.168.1.103:6379> del Aang
>
> (integer) 0

- 创建获取多个

> 192.168.1.103:6379> hmset Aang name Aang age 12 gender male
>
> OK
>
> 192.168.1.103:6379> hmget Aang name age gender
>
> 1. "Aang"
>
> 2. "12"
>
> 3. "male"
>
>    192.168.1.103:6379> hgetall Aang
>
> 4. "name"
>
> 5. "Aang"
>
> 6. "age"
>
> 7. "12"
>
> 8. "gender"
>
> 9. "male"

- 判断字段是否存在

> 192.168.1.103:6379> hexists Aang name
>
> (integer) 1
>
> 192.168.1.103:6379> hexists Aang grade
>
> (integer) 0

- 只获取keys或values

> 192.168.1.103:6379> hkeys Aang
>
> 1. "name"
>
> 2. "age"
>
> 3. "gender"
>
>    192.168.1.103:6379> hvals Aang
>
> 4. "Aang"
>
> 5. "12"
>
> 6. "male"

- 获取长度

> 192.168.1.103:6379> hlen Aang
>
> (integer) 3

### List数据类型

- 插入数据

> 192.168.1.103:6379> lpush lst1 1 2 3
>
> (integer) 3
>
> 192.168.1.103:6379> rpush lst1 a b c
>
> (integer) 6

- 获取数据

> 192.168.1.103:6379> lrange lst1 0 -1
>
> 1. "3"
>
> 2. "2"
>
> 3. "1"
>
> 4. "a"
>
> 5. "b"
>
> 6. "c"
>
>    192.168.1.103:6379> lrange lst1 1 3
>
> 7. "2"
>
> 8. "1"
>
> 9. "a"

- 弹出 (删除) 数据

> 192.168.1.103:6379> lpop lst1
>
> "3"
>
> 192.168.1.103:6379> rpop lst1
>
> "c"
>
> 192.168.1.103:6379> lrange lst1 0 -1
>
> 1) "2"
> 2) "1"
> 3) "a"
> 4) "b"

- 获取长度

> 192.168.1.103:6379> llen lst1
>
> (integer) 4

### Set数据类型

- 创建

> 192.168.1.103:6379> sadd s1 1 3 3 5 a b c
>
> (integer) 6

- 获取

> 192.168.1.103:6379> smembers s1
>
> 1) "a"
> 2) "5"
> 3) "3"
> 4) "1"
> 5) "c"
> 6) "b"

- 删除

> 192.168.1.103:6379> srem s1 3
>
> (integer) 1

- 判断是否存在

> 192.168.1.103:6379> sismember s1 3
>
> (integer) 0
>
> 192.168.1.103:6379> sismember s1 5
>
> (integer) 1

- 差集, 交集, 并集

> 192.168.1.103:6379> sadd s1 1 2 3
>
> (integer) 3
>
> 192.168.1.103:6379> sadd s2 2 3 4
>
> (integer) 3
>
> 192.168.1.103:6379> sdiff s1 s2
>
> 1) "1"
>    192.168.1.103:6379> sinter s1 s2
> 2) "2"
> 3) "3"
>    192.168.1.103:6379> sunion s1 s2
> 4) "1"
> 5) "2"
> 6) "3"
> 7) "4"

### ZSet数据类型

- 创建获取

> 192.168.1.103:6379> zadd z1 90 Aang 85 Katara 75 Sokka
>
> (integer) 3
>
> 192.168.1.103:6379> zrange z1 0 -1
>
> 1. "Sokka"
>
> 2. "Katara"
>
> 3. "Aang"
>
>    192.168.1.103:6379> zrange z1 0 -1 withscores
>
> 4. "Sokka"
>
> 5. "75"
>
> 6. "Katara"
>
> 7. "85"
>
> 8. "Aang"
>
> 9. "90"
>
>    192.168.1.103:6379> zrevrange z1 0 -1
>
> 10. "Aang"
>
> 11. "Katara"
>
> 12. "Sokka"

- 增减score

> 192.168.1.103:6379> zincrby z1 10 Katara
>
> "95"
>
> 192.168.1.103:6379> zrange z1 0 -1 withscores
>
> 1) "Sokka"
> 2) "75"
> 3) "Aang"
> 4) "90"
> 5) "Katara"
> 6) "95"

- 获取元素排名

> 192.168.1.103:6379> zrank z1 Katara
>
> (integer) 2
>
> 192.168.1.103:6379> zrevrank z1 Katara
>
> (integer) 0
