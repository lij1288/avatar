## **Flume的Interceptor**

### Timestamp Interceptor

- 添加kv到header，k默认timestamp可自定义，v为当前的时间戳（毫秒）

#### 1> Properties

| Property Name    | Default   | Description                                                  |
| :--------------- | :-------- | :----------------------------------------------------------- |
| **type**         | –         | The component type name, has to be `timestamp` or the FQCN   |
| headerName       | timestamp | The name of the header in which to place the generated timestamp. |
| preserveExisting | false     | If the timestamp already exists, should it be preserved - true or false |

#### 2> Demo

```properties
a1.sources = s1
a1.sources.s1.channels = c1
a1.sources.s1.type = netcat
a1.sources.s1.bind = 0.0.0.0
a1.sources.s1.port = 1288
a1.sources.s1.interceptors = i1
a1.sources.s1.interceptors.i1.type = timestamp

a1.channels = c1
a1.channels.c1.type = memory

a1.sinks = k1
a1.sinks.k1.type = logger
a1.sinks.k1.channel = c1
```

> 2019-10-19 21:06:45,519 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] 
>
> Event: { headers:{timestamp=1571490405513} body: 68 65 6C 6C 6F 0D                               hello. }  

### Static Interceptor

- 添加自定义的kv到header

#### 1> Properties

| Property Name    | Default | Description                                                  |
| :--------------- | :------ | :----------------------------------------------------------- |
| **type**         | –       | The component type name, has to be `static`                  |
| preserveExisting | true    | If configured header already exists, should it be preserved - true or false |
| key              | key     | Name of header that should be created                        |
| value            | value   | Static value that should be created                          |

#### 2> Demo

```properties
a1.sources = s1
a1.sources.s1.channels = c1
a1.sources.s1.type = netcat
a1.sources.s1.bind = 0.0.0.0
a1.sources.s1.port = 1288
a1.sources.s1.interceptors = i1
a1.sources.s1.interceptors.i1.type = static
a1.sources.s1.interceptors.i1.key = mykey
a1.sources.s1.interceptors.i1.value = myvalue

a1.channels = c1
a1.channels.c1.type = memory

a1.sinks = k1
a1.sinks.k1.type = logger
a1.sinks.k1.channel = c1
```

> 2019-10-19 21:15:56,626 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] 
>
> Event: { headers:{mykey=myvalue} body: 68 65 6C 6C 6F 0D                               hello. }

### Host Interceptor

- 添加kv到header，k默认host可自定义，v为agent所在主机名或ip

#### 1> Properties

| Property Name    | Default | Description                                                  |
| :--------------- | :------ | :----------------------------------------------------------- |
| **type**         | –       | The component type name, has to be `host`                    |
| preserveExisting | false   | If the host header already exists, should it be preserved - true or false |
| useIP            | true    | Use the IP Address if true, else use hostname.               |
| hostHeader       | host    | The header key to be used.                                   |

#### 2> Demo

```properties
a1.sources = s1
a1.sources.s1.channels = c1
a1.sources.s1.type = netcat
a1.sources.s1.bind = 0.0.0.0
a1.sources.s1.port = 1288
a1.sources.s1.interceptors = i1
a1.sources.s1.interceptors.i1.type = host
a1.sources.s1.interceptors.i1.useIP = false

a1.channels = c1
a1.channels.c1.type = memory

a1.sinks = k1
a1.sinks.k1.type = logger
a1.sinks.k1.channel = c1
```

> 2019-10-19 21:42:48,290 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] 
>
> Event: { headers:{host=linux01} body: 68 65 6C 6C 6F 0D                               hello. }

### UUID Interceptor

- 添加kv到header，k默认id可自定义，v为uuid

#### 1> Properties

| Property Name    | Default | Description                                                  |
| :--------------- | :------ | :----------------------------------------------------------- |
| **type**         | –       | The component type name has to be `org.apache.flume.sink.solr.morphline.UUIDInterceptor$Builder` |
| headerName       | id      | The name of the Flume header to modify                       |
| preserveExisting | true    | If the UUID header already exists, should it be preserved - true or false |
| prefix           | “”      | The prefix string constant to prepend to each generated UUID |

#### 2> Demo

```properties
a1.sources = s1
a1.sources.s1.channels = c1
a1.sources.s1.type = netcat
a1.sources.s1.bind = 0.0.0.0
a1.sources.s1.port = 1288
a1.sources.s1.interceptors = i1
a1.sources.s1.interceptors.i1.type = org.apache.flume.sink.solr.morphline.UUIDInterceptor$Builder

a1.channels = c1
a1.channels.c1.type = memory

a1.sinks = k1
a1.sinks.k1.type = logger
a1.sinks.k1.channel = c1
```

> 2019-10-19 21:45:41,482 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] 
>
> Event: { headers:{id=54fd2630-99cf-40b4-98df-7fc1101326d9} body: 68 65 6C 6C 6F 0D                 hello. }

