## **Flume的Selector**

### Replicating Channel Selector

- 复制选择器（默认）

#### 1> Properties

| Property Name     | Default     | Description                                        |
| :---------------- | :---------- | :------------------------------------------------- |
| selector.type     | replicating | The component type name, needs to be `replicating` |
| selector.optional | –           | Set of channels to be marked as `optional`         |

#### 2> Demo

```properties
a1.sources = s1
a1.channels = c1 c2
a1.sinks = k1 k2

a1.sources.s1.channels = c1 c2
a1.sources.s1.type = exec
a1.sources.s1.command = tail -F /tmp/phoenixera/test.log 
a1.sources.s1.selector.type = replicating


a1.channels.c1.type = memory

a1.channels.c2.type = memory

a1.sinks.k1.channel = c1
a1.sinks.k1.type = org.apache.flume.sink.kafka.KafkaSink
a1.sinks.k1.kafka.bootstrap.servers = linux01:9092,linux02:9092,linux03:9092
a1.sinks.k1.kafka.topic = tpc_a

a1.sinks.k2.channel = c2
a1.sinks.k2.type = org.apache.flume.sink.kafka.KafkaSink
a1.sinks.k2.kafka.bootstrap.servers = linux01:9092,linux02:9092,linux03:9092
a1.sinks.k2.kafka.topic = tpc_b
```

### Multiplexing Channel Selector

- 多路选择器

- 主要用来做负载均衡，如多个hdfs sink同时写入hdfs

#### 1> Properties

| Property Name      | Default               | Description                                         |
| :----------------- | :-------------------- | :-------------------------------------------------- |
| selector.type      | replicating           | The component type name, needs to be `multiplexing` |
| selector.header    | flume.selector.header |                                                     |
| selector.default   | –                     |                                                     |
| selector.mapping.* | –                     |                                                     |

#### 2> Demo

```properties
a1.sources = s1
a1.channels = c1
a1.sinks = k1

a1.sources.s1.channels = c1
a1.sources.s1.type = exec
a1.sources.s1.command = tail -F /tmp/phoenixera/test.log 
a1.sources.s1.interceptors = i1
a1.sources.s1.interceptors.i1.type = static
a1.sources.s1.interceptors.i1.key = flag
a1.sources.s1.interceptors.i1.value = 1

a1.channels.c1.type = memory

a1.sinks.k1.channel = c1
a1.sinks.k1.type = avro
a1.sinks.k1.hostname = linux01
a1.sinks.k1.port = 1288
```

```properties
a1.sources = s1
a1.channels = c1
a1.sinks = k1

a1.sources.s1.channels = c1
a1.sources.s1.type = exec
a1.sources.s1.command = tail -F /tmp/phoenixera/test.log 
a1.sources.s1.interceptors = i1
a1.sources.s1.interceptors.i1.type = static
a1.sources.s1.interceptors.i1.key = flag
a1.sources.s1.interceptors.i1.value = 2

a1.channels.c1.type = memory

a1.sinks.k1.channel = c1
a1.sinks.k1.type = avro
a1.sinks.k1.hostname = linux01
a1.sinks.k1.port = 1288
```

```properties
a1.sources = s1
a1.channels = c1 c2
a1.sinks = k1 k2

a1.sources.s1.channels = c1 c2
a1.sources.s1.type = avro
a1.sources.s1.bind = 0.0.0.0
a1.sources.s1.port = 1288

a1.sources.s1.selector.type = multiplexing
a1.sources.s1.selector.header = flag
a1.sources.s1.selector.default = c2
s1.sources.s1.selector.mapping.1 = c1
s1.sources.s1.selector.mapping.2 = c2


a1.channels.c1.type = memory

a1.channels.c2.type = memory

a1.sinks.k1.channel = c1
a1.sinks.k1.type = logger

a1.sinks.k2.channel = c2
a1.sinks.k2.type = logger
```

