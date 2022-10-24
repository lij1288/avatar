## **Flume的Sink**

### HDFS Sink

#### 1> Properties

| Name                   | Default      | Description                                                  |
| :--------------------- | :----------- | :----------------------------------------------------------- |
| **channel**            | –            |                                                              |
| **type**               | –            | The component type name, needs to be `hdfs`                  |
| **hdfs.path**          | –            | HDFS directory path (eg hdfs://namenode/flume/webdata/)      |
| hdfs.filePrefix        | FlumeData    | Name prefixed to files created by Flume in hdfs directory    |
| hdfs.fileSuffix        | –            | Suffix to append to file (eg `.avro` - *NOTE: period is not automatically added*) |
| hdfs.inUsePrefix       | –            | Prefix that is used for temporal files that flume actively writes into |
| hdfs.inUseSuffix       | `.tmp`       | Suffix that is used for temporal files that flume actively writes into |
| hdfs.emptyInUseSuffix  | false        | If `false` an `hdfs.inUseSuffix` is used while writing the output. After closing the output `hdfs.inUseSuffix` is removed from the output file name. If `true` the `hdfs.inUseSuffix` parameter is ignored an empty string is used instead. |
| hdfs.rollInterval      | 30           | Number of seconds to wait before rolling current file (0 = never roll based on time interval) |
| hdfs.rollSize          | 1024         | File size to trigger roll, in bytes (0: never roll based on file size) |
| hdfs.rollCount         | 10           | Number of events written to file before it rolled (0 = never roll based on number of events) |
| hdfs.idleTimeout       | 0            | Timeout after which inactive files get closed (0 = disable automatic closing of idle files) |
| hdfs.batchSize         | 100          | number of events written to file before it is flushed to HDFS |
| hdfs.codeC             | –            | Compression codec. one of following : gzip, bzip2, lzo, lzop, snappy |
| hdfs.fileType          | SequenceFile | File format: currently `SequenceFile`, `DataStream` or `CompressedStream` (1)DataStream will not compress output file and please don’t set codeC (2)CompressedStream requires set hdfs.codeC with an available codeC |
| hdfs.maxOpenFiles      | 5000         | Allow only this number of open files. If this number is exceeded, the oldest file is closed. |
| hdfs.minBlockReplicas  | –            | Specify minimum number of replicas per HDFS block. If not specified, it comes from the default Hadoop config in the classpath. |
| hdfs.writeFormat       | Writable     | Format for sequence file records. One of `Text` or `Writable`. Set to `Text` before creating data files with Flume, otherwise those files cannot be read by either Apache Impala (incubating) or Apache Hive. |
| hdfs.threadsPoolSize   | 10           | Number of threads per HDFS sink for HDFS IO ops (open, write, etc.) |
| hdfs.rollTimerPoolSize | 1            | Number of threads per HDFS sink for scheduling timed file rolling |
| hdfs.kerberosPrincipal | –            | Kerberos user principal for accessing secure HDFS            |
| hdfs.kerberosKeytab    | –            | Kerberos keytab for accessing secure HDFS                    |
| hdfs.proxyUser         |              |                                                              |
| hdfs.round             | false        | Should the timestamp be rounded down (if true, affects all time based escape sequences except %t) |
| hdfs.roundValue        | 1            | Rounded down to the highest multiple of this (in the unit configured using `hdfs.roundUnit`), less than current time. |
| hdfs.roundUnit         | second       | The unit of the round down value - `second`, `minute` or `hour`. |
| hdfs.timeZone          | Local Time   | Name of the timezone that should be used for resolving the directory path, e.g. America/Los_Angeles. |
| hdfs.useLocalTimeStamp | false        | Use the local time (instead of the timestamp from the event header) while replacing the escape sequences. |
| hdfs.closeTries        | 0            | Number of times the sink must try renaming a file, after initiating a close attempt. If set to 1, this sink will not re-try a failed rename (due to, for example, NameNode or DataNode failure), and may leave the file in an open state with a .tmp extension. If set to 0, the sink will try to rename the file until the file is eventually renamed (there is no limit on the number of times it would try). The file may still remain open if the close call fails but the data will be intact and in this case, the file will be closed only after a Flume restart. |
| hdfs.retryInterval     | 180          | Time in seconds between consecutive attempts to close a file. Each close call costs multiple RPC round-trips to the Namenode, so setting this too low can cause a lot of load on the name node. If set to 0 or less, the sink will not attempt to close the file if the first attempt fails, and may leave the file open or with a ”.tmp” extension. |
| serializer             | `TEXT`       | Other possible options include `avro_event` or the fully-qualified class name of an implementation of the `EventSerializer.Builder` interface. |
| serializer.*           |              |                                                              |



| Alias        | Description                                                  |
| :----------- | :----------------------------------------------------------- |
| %{host}      | Substitute value of event header named “host”. Arbitrary header names are supported. |
| %t           | Unix time in milliseconds                                    |
| %a           | locale’s short weekday name (Mon, Tue, ...)                  |
| %A           | locale’s full weekday name (Monday, Tuesday, ...)            |
| %b           | locale’s short month name (Jan, Feb, ...)                    |
| %B           | locale’s long month name (January, February, ...)            |
| %c           | locale’s date and time (Thu Mar 3 23:05:25 2005)             |
| %d           | day of month (01)                                            |
| %e           | day of month without padding (1)                             |
| %D           | date; same as %m/%d/%y                                       |
| %H           | hour (00..23)                                                |
| %I           | hour (01..12)                                                |
| %j           | day of year (001..366)                                       |
| %k           | hour ( 0..23)                                                |
| %m           | month (01..12)                                               |
| %n           | month without padding (1..12)                                |
| %M           | minute (00..59)                                              |
| %p           | locale’s equivalent of am or pm                              |
| %s           | seconds since 1970-01-01 00:00:00 UTC                        |
| %S           | second (00..59)                                              |
| %y           | last two digits of year (00..99)                             |
| %Y           | year (2010)                                                  |
| %z           | +hhmm numeric timezone (for example, -0400)                  |
| %[localhost] | Substitute the hostname of the host where the agent is running |
| %[IP]        | Substitute the IP address of the host where the agent is running |
| %[FQDN]      | Substitute the canonical hostname of the host where the agent is running |

#### 2> Demo

```properties
a1.sources = s1
a1.channels = c1
a1.sinks = k1

a1.sources.s1.channels = c1
a1.sources.s1.type = exec
a1.sources.s1.command = tail -F /tmp/phoenixera/log/test.log 
a1.sources.s1.interceptors = i1
a1.sources.s1.interceptors.i1.type = timestamp

a1.channels.c1.type = memory

a1.sinks.k1.channel = c1
a1.sinks.k1.type = hdfs
a1.sinks.k1.hdfs.path = hdfs://linux01:9000/flumetest/%Y-%m-%d/%H-%M/%S
a1.sinks.k1.hdfs.round = true
a1.sinks.k1.hdfs.roundValue = 10
a1.sinks.k1.hdfs.roundUnit = second

a1.sinks.k1.hdfs.filePrefix = test_
a1.sinks.k1.hdfs.fileSuffix = .log.gz

a1.sinks.k1.hdfs.rollInterval = 0
a1.sinks.k1.hdfs.rollSize = 15
a1.sinks.k1.hdfs.rollCount = 0

a1.sinks.k1.hdfs.fileType = CompressedStream
a1.sinks.k1.hdfs.codeC = gzip
a1.sinks.k1.hdfs.writeFormat = Text
```

> bin/flume-ng agent -n a1 -c conf/ -f agentconf/hdfss.conf -Dflume.root.logger=INFO,console

### Kafka Sink

- 自动创建的topic只有一个leader，没有follower

#### 1> Properties

| Property Name                    | Default             | Description                                                  |
| :------------------------------- | :------------------ | :----------------------------------------------------------- |
| **type**                         | –                   | Must be set to `org.apache.flume.sink.kafka.KafkaSink`       |
| **kafka.bootstrap.servers**      | –                   | List of brokers Kafka-Sink will connect to, to get the list of topic partitions This can be a partial list of brokers, but we recommend at least two for HA. The format is comma separated list of hostname:port |
| kafka.topic                      | default-flume-topic | The topic in Kafka to which the messages will be published. If this parameter is configured, messages will be published to this topic. If the event header contains a “topic” field, the event will be published to that topic overriding the topic configured here. Arbitrary header substitution is supported, eg. %{header} is replaced with value of event header named “header”. (If using the substitution, it is recommended to set “auto.create.topics.enable” property of Kafka broker to true.) |
| flumeBatchSize                   | 100                 | How many messages to process in one batch. Larger batches improve throughput while adding latency. |
| kafka.producer.acks              | 1                   | How many replicas must acknowledge a message before its considered successfully written. Accepted values are 0 (Never wait for acknowledgement), 1 (wait for leader only), -1 (wait for all replicas) Set this to -1 to avoid data loss in some cases of leader failure. |
| useFlumeEventFormat              | false               | By default events are put as bytes onto the Kafka topic directly from the event body. Set to true to store events as the Flume Avro binary format. Used in conjunction with the same property on the KafkaSource or with the parseAsFlumeEvent property on the Kafka Channel this will preserve any Flume headers for the producing side. |
| defaultPartitionId               | –                   | Specifies a Kafka partition ID (integer) for all events in this channel to be sent to, unless overriden by `partitionIdHeader`. By default, if this property is not set, events will be distributed by the Kafka Producer’s partitioner - including by `key` if specified (or by a partitioner specified by `kafka.partitioner.class`). |
| partitionIdHeader                | –                   | When set, the sink will take the value of the field named using the value of this property from the event header and send the message to the specified partition of the topic. If the value represents an invalid partition, an EventDeliveryException will be thrown. If the header value is present then this setting overrides `defaultPartitionId`. |
| allowTopicOverride               | true                | When set, the sink will allow a message to be produced into a topic specified by the `topicHeader` property (if provided). |
| topicHeader                      | topic               | When set in conjunction with `allowTopicOverride` will produce a message into the value of the header named using the value of this property. Care should be taken when using in conjunction with the Kafka Source `topicHeader` property to avoid creating a loopback. |
| kafka.producer.security.protocol | PLAINTEXT           | Set to SASL_PLAINTEXT, SASL_SSL or SSL if writing to Kafka using some level of security. See below for additional info on secure setup. |
| *more producer security props*   |                     | If using SASL_PLAINTEXT, SASL_SSL or SSL refer to [Kafka security](http://kafka.apache.org/documentation.html#security) for additional properties that need to be set on producer. |
| Other Kafka Producer Properties  | –                   | These properties are used to configure the Kafka Producer. Any producer property supported by Kafka can be used. The only requirement is to prepend the property name with the prefix `kafka.producer`. For example: kafka.producer.linger.ms |

#### 2> Demo

```properties
a1.sources = s1
a1.channels = c1
a1.sinks = k1

a1.sources.s1.channels = c1
a1.sources.s1.type = exec
a1.sources.s1.command = tail -F /tmp/phoenixera/log/test.log 

a1.channels.c1.type = memory

a1.sinks.k1.channel = c1
a1.sinks.k1.type = org.apache.flume.sink.kafka.KafkaSink
a1.sinks.k1.kafka.bootstrap.servers = linux01:9092,linux02:9092,linux03:9092
a1.sinks.k1.kafka.topic = kfkst
```

> bin/flume-ng agent -n a1 -c conf/ -f agentconf/kfkst.conf -Dflume.root.logger=DEBUG,console

### Avro Sink

#### 1> Properties

| Property Name             | Default                                               | Description                                                  |
| :------------------------ | :---------------------------------------------------- | :----------------------------------------------------------- |
| **channel**               | –                                                     |                                                              |
| **type**                  | –                                                     | The component type name, needs to be `avro`.                 |
| **hostname**              | –                                                     | The hostname or IP address to bind to.                       |
| **port**                  | –                                                     | The port # to listen on.                                     |
| batch-size                | 100                                                   | number of event to batch together for send.                  |
| connect-timeout           | 20000                                                 | Amount of time (ms) to allow for the first (handshake) request. |
| request-timeout           | 20000                                                 | Amount of time (ms) to allow for requests after the first.   |
| reset-connection-interval | none                                                  | Amount of time (s) before the connection to the next hop is reset. This will force the Avro Sink to reconnect to the next hop. This will allow the sink to connect to hosts behind a hardware load-balancer when news hosts are added without having to restart the agent. |
| compression-type          | none                                                  | This can be “none” or “deflate”. The compression-type must match the compression-type of matching AvroSource |
| compression-level         | 6                                                     | The level of compression to compress event. 0 = no compression and 1-9 is compression. The higher the number the more compression |
| ssl                       | false                                                 | Set to true to enable SSL for this AvroSink. When configuring SSL, you can optionally set a “truststore”, “truststore-password”, “truststore-type”, and specify whether to “trust-all-certs”. |
| trust-all-certs           | false                                                 | If this is set to true, SSL server certificates for remote servers (Avro Sources) will not be checked. This should NOT be used in production because it makes it easier for an attacker to execute a man-in-the-middle attack and “listen in” on the encrypted connection. |
| truststore                | –                                                     | The path to a custom Java truststore file. Flume uses the certificate authority information in this file to determine whether the remote Avro Source’s SSL authentication credentials should be trusted. If not specified, then the global keystore will be used. If the global keystore not specified either, then the default Java JSSE certificate authority files (typically “jssecacerts” or “cacerts” in the Oracle JRE) will be used. |
| truststore-password       | –                                                     | The password for the truststore. If not specified, then the global keystore password will be used (if defined). |
| truststore-type           | JKS                                                   | The type of the Java truststore. This can be “JKS” or other supported Java truststore type. If not specified, then the global keystore type will be used (if defined, otherwise the defautl is JKS). |
| exclude-protocols         | SSLv3                                                 | Space-separated list of SSL/TLS protocols to exclude. SSLv3 will always be excluded in addition to the protocols specified. |
| maxIoWorkers              | 2 * the number of available processors in the machine | The maximum number of I/O worker threads. This is configured on the NettyAvroRpcClient NioClientSocketChannelFactory. |

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
a1.sources.s1.interceptors.i1.key = topic
a1.sources.s1.interceptors.i1.value = tpc1

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
a1.sources.s1.interceptors.i1.key = topic
a1.sources.s1.interceptors.i1.value = tpc2

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
a1.sources.s1.type = avro
a1.sources.s1.bind = 0.0.0.0
a1.sources.s1.port = 1288

a1.channels.c1.type = memory

a1.sinks.k1.channel = c1
a1.sinks.k1.type = org.apache.flume.sink.kafka.KafkaSink
a1.sinks.k1.kafka.bootstrap.servers = linux01:9092,linux02:9092,linux03:9092
a1.sinks.k1.kafka.topic = tpc3
```

> bin/flume-ng agent -n a1 -c conf/ -f agentconf/avrost.conf -Dflume.root.logger=INFO,console
