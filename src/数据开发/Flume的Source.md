## **Flume的Source**

### NetCat Source

- 启动一个socket服务，监听一个端口，将端口上收到的数据转成event写入channel

#### 1> Properties

| Property Name   | Default     | Description                                   |
| :-------------- | :---------- | :-------------------------------------------- |
| **channels**    | –           |                                               |
| **type**        | –           | The component type name, needs to be `netcat` |
| **bind**        | –           | Host name or IP address to bind to            |
| **port**        | –           | Port # to bind to                             |
| max-line-length | 512         | Max line length per event body (in bytes)     |
| ack-every-event | true        | Respond with an “OK” for every event received |
| selector.type   | replicating | replicating or multiplexing                   |
| selector.*      |             | Depends on the selector.type value            |
| interceptors    | –           | Space-separated list of interceptors          |
| interceptors.*  |             |                                               |

#### 2> Demo

```properties
# 定义agent中各组件名称
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# 描述和配置source组件
a1.sources.r1.type = netcat
a1.sources.r1.bind = 0.0.0.0
a1.sources.r1.port = 1288
a1.sources.r1.channels = c1  

# 描述和配置channel组件
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000

# 描述和配置sink组件
a1.sinks.k1.type = logger
a1.sinks.k1.channel = c1
```

> bin/flume-ng agent -n a1 -c conf -f agentconf/netcat-m-logger.conf 
>
> -Dflume.root.logger=DEBUG,console

> telnet linux01 1288

### Exec Source

-   启动一个用户指定的linux shell命令，采集命令的输出作为收集的数据，转为enent写入channel

#### 1> Properties

| Property Name   | Default     | Description                                                  |
| :-------------- | :---------- | :----------------------------------------------------------- |
| **channels**    | –           |                                                              |
| **type**        | –           | The component type name, needs to be `exec`                  |
| **command**     | –           | The command to execute                                       |
| shell           | –           | A shell invocation used to run the command. e.g. /bin/sh -c. Required only for commands relying on shell features like wildcards, back ticks, pipes etc. |
| restartThrottle | 10000       | Amount of time (in millis) to wait before attempting a restart |
| restart         | false       | Whether the executed cmd should be restarted if it dies      |
| logStdErr       | false       | Whether the command’s stderr should be logged                |
| batchSize       | 20          | The max number of lines to read and send to the channel at a time |
| batchTimeout    | 3000        | Amount of time (in milliseconds) to wait, if the buffer size was not reached, before data is pushed downstream |
| selector.type   | replicating | replicating or multiplexing                                  |
| selector.*      |             | Depends on the selector.type value                           |
| interceptors    | –           | Space-separated list of interceptors                         |
| interceptors.*  |             |                                                              |

#### 2> Demo

```properties
a1.sources = s1
a1.sources.s1.channels = c1
a1.sources.s1.type = exec
a1.sources.s1.command = tail -F /tmp/phoenixera/weblog/access.log 
a1.sources.s1.batchSize = 100

a1.channels = c1
a1.channels.c1.type = memory
a1.channels.c1.capacity = 200
a1.channels.c1.transactionCapacity = 100

a1.sinks = k1
a1.sinks.k1.type = logger
a1.sinks.k1.channel = c1
```

> bin/flume-ng agent -n a1 -c conf -f agentconf/exec-m-logger.conf -Dflume.root.logger=DEBUG,console

> [root@linux01 ~]# i=0
> [root@linux01 ~]# while true
>
> \> do
> \> echo "$((i++))" >> /tmp/phoenixera/weblog/access.log 
> \> sleep 0.5
> \> done

### Spooldir Source

#### 1> Properties

| Property Name            | Default     | Description                                                  |
| :----------------------- | :---------- | :----------------------------------------------------------- |
| **channels**             | –           |                                                              |
| **type**                 | –           | The component type name, needs to be `spooldir`.             |
| **spoolDir**             | –           | The directory from which to read files from.                 |
| fileSuffix               | .COMPLETED  | Suffix to append to completely ingested files                |
| deletePolicy             | never       | When to delete completed files: `never` or `immediate`       |
| fileHeader               | false       | Whether to add a header storing the absolute path filename.  |
| fileHeaderKey            | file        | Header key to use when appending absolute path filename to event header. |
| basenameHeader           | false       | Whether to add a header storing the basename of the file.    |
| basenameHeaderKey        | basename    | Header Key to use when appending basename of file to event header. |
| includePattern           | ^.*$        | Regular expression specifying which files to include. It can used together with `ignorePattern`. If a file matches both `ignorePattern` and `includePattern` regex, the file is ignored. |
| ignorePattern            | ^$          | Regular expression specifying which files to ignore (skip). It can used together with `includePattern`. If a file matches both `ignorePattern` and `includePattern` regex, the file is ignored. |
| trackerDir               | .flumespool | Directory to store metadata related to processing of files. If this path is not an absolute path, then it is interpreted as relative to the spoolDir. |
| trackingPolicy           | rename      | The tracking policy defines how file processing is tracked. It can be “rename” or “tracker_dir”. This parameter is only effective if the deletePolicy is “never”. “rename” - After processing files they get renamed according to the fileSuffix parameter. “tracker_dir” - Files are not renamed but a new empty file is created in the trackerDir. The new tracker file name is derived from the ingested one plus the fileSuffix. |
| consumeOrder             | oldest      | In which order files in the spooling directory will be consumed `oldest`, `youngest` and `random`. In case of `oldest` and `youngest`, the last modified time of the files will be used to compare the files. In case of a tie, the file with smallest lexicographical order will be consumed first. In case of `random` any file will be picked randomly. When using `oldest` and `youngest` the whole directory will be scanned to pick the oldest/youngest file, which might be slow if there are a large number of files, while using `random` may cause old files to be consumed very late if new files keep coming in the spooling directory. |
| pollDelay                | 500         | Delay (in milliseconds) used when polling for new files.     |
| recursiveDirectorySearch | false       | Whether to monitor sub directories for new files to read.    |
| maxBackoff               | 4000        | The maximum time (in millis) to wait between consecutive attempts to write to the channel(s) if the channel is full. The source will start at a low backoff and increase it exponentially each time the channel throws a ChannelException, upto the value specified by this parameter. |
| batchSize                | 100         | Granularity at which to batch transfer to the channel        |
| inputCharset             | UTF-8       | Character set used by deserializers that treat the input file as text. |
| decodeErrorPolicy        | `FAIL`      | What to do when we see a non-decodable character in the input file. `FAIL`: Throw an exception and fail to parse the file. `REPLACE`: Replace the unparseable character with the “replacement character” char, typically Unicode U+FFFD. `IGNORE`: Drop the unparseable character sequence. |
| deserializer             | `LINE`      | Specify the deserializer used to parse the file into events. Defaults to parsing each line as an event. The class specified must implement `EventDeserializer.Builder`. |
| deserializer.*           |             | Varies per event deserializer.                               |
| bufferMaxLines           | –           | (Obselete) This option is now ignored.                       |
| bufferMaxLineLength      | 5000        | (Deprecated) Maximum length of a line in the commit buffer. Use deserializer.maxLineLength instead. |
| selector.type            | replicating | replicating or multiplexing                                  |
| selector.*               |             | Depends on the selector.type value                           |
| interceptors             | –           | Space-separated list of interceptors                         |
| interceptors.*           |             |                                                              |

#### 2> Demo

```properties
a1.sources = r1
a1.channels = c1
a1.sinks = k1

a1.sources.r1.channels = c1
a1.sources.r1.type = spooldir
a1.sources.r1.spoolDir = /root/weblog 

a1.channels.c1.type = memory

a1.sinks.k1.type = logger
a1.sinks.k1.channel = c1
```

> bin/flume-ng agent -n a1 -c conf -f agentconf/spooldir-m-logger.conf 
>
> -Dflume.root.logger=DEBUG,console

### Avro Source

- 监听一个端口，收集端口上收到的avro序列化数据流，该source中拥有avro的反序列化器，可以将收到的二进制序列进行正确的反序列化，并封装进event传输到channel

- batchSize为5

#### 1> Properties

| Property Name         | Default | Description                                                  |
| :-------------------- | :------ | :----------------------------------------------------------- |
| **channels**          | –       |                                                              |
| **type**              | –       | The component type name, needs to be `avro`                  |
| **bind**              | –       | hostname or IP address to listen on                          |
| **port**              | –       | Port # to bind to                                            |
| threads               | –       | Maximum number of worker threads to spawn                    |
| selector.type         |         |                                                              |
| selector.*            |         |                                                              |
| interceptors          | –       | Space-separated list of interceptors                         |
| interceptors.*        |         |                                                              |
| compression-type      | none    | This can be “none” or “deflate”. The compression-type must match the compression-type of matching AvroSource |
| ssl                   | false   | Set this to true to enable SSL encryption. If SSL is enabled, you must also specify a “keystore” and a “keystore-password”, either through component level parameters (see below) or as global SSL parameters (see [SSL/TLS support](http://flume.apache.org/releases/content/1.9.0/FlumeUserGuide.html#ssl-tls-support) section). |
| keystore              | –       | This is the path to a Java keystore file. If not specified here, then the global keystore will be used (if defined, otherwise configuration error). |
| keystore-password     | –       | The password for the Java keystore. If not specified here, then the global keystore password will be used (if defined, otherwise configuration error). |
| keystore-type         | JKS     | The type of the Java keystore. This can be “JKS” or “PKCS12”. If not specified here, then the global keystore type will be used (if defined, otherwise the default is JKS). |
| exclude-protocols     | SSLv3   | Space-separated list of SSL/TLS protocols to exclude. SSLv3 will always be excluded in addition to the protocols specified. |
| include-protocols     | –       | Space-separated list of SSL/TLS protocols to include. The enabled protocols will be the included protocols without the excluded protocols. If included-protocols is empty, it includes every supported protocols. |
| exclude-cipher-suites | –       | Space-separated list of cipher suites to exclude.            |
| include-cipher-suites | –       | Space-separated list of cipher suites to include. The enabled cipher suites will be the included cipher suites without the excluded cipher suites. If included-cipher-suites is empty, it includes every supported cipher suites. |
| ipFilter              | false   | Set this to true to enable ipFiltering for netty             |
| ipFilterRules         | –       | Define N netty ipFilter pattern rules with this config.      |

#### 2> Demo

```properties
a1.sources = r1
a1.channels = c1
a1.sinks = k1

a1.sources.r1.type = avro
a1.sources.r1.channels = c1
a1.sources.r1.bind = 0.0.0.0
a1.sources.r1.port = 1288

a1.channels.c1.type = memory

a1.sinks.k1.type = logger
a1.sinks.k1.channel = c1
```

> bin/flume-ng agent -c conf -f agentconf/avro-m-logger.conf -n a1 -Dflume.root.logger=DEBUG,console

> bin/flume-ng avro-client --host linux01 --port 1288

### Kafka Source

#### 1> Properties

| Property Name                    | Default   | Description                                                  |
| :------------------------------- | :-------- | :----------------------------------------------------------- |
| **channels**                     | –         |                                                              |
| **type**                         | –         | The component type name, needs to be `org.apache.flume.source.kafka.KafkaSource` |
| **kafka.bootstrap.servers**      | –         | List of brokers in the Kafka cluster used by the source      |
| kafka.consumer.group.id          | flume     | Unique identified of consumer group. Setting the same id in multiple sources or agents indicates that they are part of the same consumer group |
| **kafka.topics**                 | –         | Comma-separated list of topics the kafka consumer will read messages from. |
| **kafka.topics.regex**           | –         | Regex that defines set of topics the source is subscribed on. This property has higher priority than `kafka.topics` and overrides `kafka.topics` if exists. |
| batchSize                        | 1000      | Maximum number of messages written to Channel in one batch   |
| batchDurationMillis              | 1000      | Maximum time (in ms) before a batch will be written to Channel The batch will be written whenever the first of size and time will be reached. |
| backoffSleepIncrement            | 1000      | Initial and incremental wait time that is triggered when a Kafka Topic appears to be empty. Wait period will reduce aggressive pinging of an empty Kafka Topic. One second is ideal for ingestion use cases but a lower value may be required for low latency operations with interceptors. |
| maxBackoffSleep                  | 5000      | Maximum wait time that is triggered when a Kafka Topic appears to be empty. Five seconds is ideal for ingestion use cases but a lower value may be required for low latency operations with interceptors. |
| useFlumeEventFormat              | false     | By default events are taken as bytes from the Kafka topic directly into the event body. Set to true to read events as the Flume Avro binary format. Used in conjunction with the same property on the KafkaSink or with the parseAsFlumeEvent property on the Kafka Channel this will preserve any Flume headers sent on the producing side. |
| setTopicHeader                   | true      | When set to true, stores the topic of the retrieved message into a header, defined by the `topicHeader` property. |
| topicHeader                      | topic     | Defines the name of the header in which to store the name of the topic the message was received from, if the `setTopicHeader` property is set to `true`. Care should be taken if combining with the Kafka Sink `topicHeader` property so as to avoid sending the message back to the same topic in a loop. |
| kafka.consumer.security.protocol | PLAINTEXT | Set to SASL_PLAINTEXT, SASL_SSL or SSL if writing to Kafka using some level of security. See below for additional info on secure setup. |
| *more consumer security props*   |           | If using SASL_PLAINTEXT, SASL_SSL or SSL refer to [Kafka security](http://kafka.apache.org/documentation.html#security) for additional properties that need to be set on consumer. |
| Other Kafka Consumer Properties  | –         | These properties are used to configure the Kafka Consumer. Any consumer property supported by Kafka can be used. The only requirement is to prepend the property name with the prefix `kafka.consumer`. For example: `kafka.consumer.auto.offset.reset` |

#### 2> Demo

```properties
a1.sources = r1
a1.channels = c1
a1.sinks = k1

a1.sources.r1.type = org.apache.flume.source.kafka.KafkaSource
a1.sources.r1.channels = c1
a1.sources.r1.batchSize = 100
a1.sources.r1.batchDurationMillis = 2000
a1.sources.r1.kafka.bootstrap.servers = linux01:9092,linux02:9092,linux03:9092
a1.sources.r1.kafka.topics = mytopic
a1.sources.r1.kafka.consumer.group.id = g01

a1.channels.c1.type = memory

a1.sinks.k1.type = logger
a1.sinks.k1.channel = c1
```

> /usr/apps/kafka_2.11-1.1.1/bin/kafka-console-producer.sh --broker-list linux01:9092,linux02:9092,linux03:9092 --topic tes

> bin/flume-ng agent -n a1 -c conf/ -f agentconf/kafka-m-logger.conf  -Dflume.root.logger=INFO,console

### Taildir Source

#### 1> Properties

| Property Name                       | Default                        | Description                                                  |
| :---------------------------------- | :----------------------------- | :----------------------------------------------------------- |
| **channels**                        | –                              |                                                              |
| **type**                            | –                              | The component type name, needs to be `TAILDIR`.              |
| **filegroups**                      | –                              | Space-separated list of file groups. Each file group indicates a set of files to be tailed. |
| **filegroups.<filegroupName>**      | –                              | Absolute path of the file group. Regular expression (and not file system patterns) can be used for filename only. |
| positionFile                        | ~/.flume/taildir_position.json | File in JSON format to record the inode, the absolute path and the last position of each tailing file. (若不存在会自动创建) |
| headers.<filegroupName>.<headerKey> | –                              | Header value which is the set with header key. Multiple headers can be specified for one file group. |
| byteOffsetHeader                    | false                          | Whether to add the byte offset of a tailed line to a header called ‘byteoffset’. |
| skipToEnd                           | false                          | Whether to skip the position to EOF in the case of files not written on the position file. |
| idleTimeout                         | 120000                         | Time (ms) to close inactive files. If the closed file is appended new lines to, this source will automatically re-open it. |
| writePosInterval                    | 3000                           | Interval time (ms) to write the last position of each file on the position file. |
| batchSize                           | 100                            | Max number of lines to read and send to the channel at a time. Using the default is usually fine. |
| maxBatchCount                       | Long.MAX_VALUE                 | Controls the number of batches being read consecutively from the same file. If the source is tailing multiple files and one of them is written at a fast rate, it can prevent other files to be processed, because the busy file would be read in an endless loop. In this case lower this value. |
| backoffSleepIncrement               | 1000                           | The increment for time delay before reattempting to poll for new data, when the last attempt did not find any new data. |
| maxBackoffSleep                     | 5000                           | The max time delay between each reattempt to poll for new data, when the last attempt did not find any new data. |
| cachePatternMatching                | true                           | Listing directories and applying the filename regex pattern may be time consuming for directories containing thousands of files. Caching the list of matching files can improve performance. The order in which files are consumed will also be cached. Requires that the file system keeps track of modification times with at least a 1-second granularity. |
| fileHeader                          | false                          | Whether to add a header storing the absolute path filename.  |
| fileHeaderKey                       | file                           | Header key to use when appending absolute path filename to event header. |

#### 2> Demo

```properties
a1.sources = r1
a1.sources.r1.type = TAILDIR
a1.sources.r1.channels = c1
a1.sources.r1.positionFile = /tmp/phoenixera/flumedata/taildir_position.json
a1.sources.r1.filegroups = f1
a1.sources.r1.filegroups.f1 = /tmp/phoenixera/weblog/access.log
a1.sources.r1.fileHeader = true
a1.sources.ri.maxBatchCount = 1000

a1.channels = c1
a1.channels.c1.type = memory
a1.channels.c1.capacity = 200
a1.channels.c1.transactionCapacity = 100

a1.sinks = k1
a1.sinks.k1.type = logger
a1.sinks.k1.channel = c1
```

> while true; do echo "$((i++))" >> /tmp/phoenixera/weblog/access.log ; sleep 0.5; done
>
> bin/flume-ng agent -n a1 -c conf/ -f agentconf/taildir-m-logger.conf -Dflume.root.logger=DEBUG,console

