## **Flume的Channel**

### Memory Channel

#### 1> Properties

| Property Name                | Default         | Description                                                  |
| :--------------------------- | :-------------- | :----------------------------------------------------------- |
| **type**                     | –               | The component type name, needs to be `memory`                |
| capacity                     | 100             | The maximum number of events stored in the channel           |
| transactionCapacity          | 100             | The maximum number of events the channel will take from a source or give to a sink per transaction |
| keep-alive                   | 3               | Timeout in seconds for adding or removing an event           |
| byteCapacityBufferPercentage | 20              | Defines the percent of buffer between byteCapacity and the estimated total size of all events in the channel, to account for data in headers. See below. |
| byteCapacity                 | see description | Maximum total **bytes** of memory allowed as a sum of all events in this channel. The implementation only counts the Event `body`, which is the reason for providing the `byteCapacityBufferPercentage` configuration parameter as well. Defaults to a computed value equal to 80% of the maximum memory available to the JVM (i.e. 80% of the -Xmx value passed on the command line). Note that if you have multiple memory channels on a single JVM, and they happen to hold the same physical events (i.e. if you are using a replicating channel selector from a single source) then those event sizes may be double-counted for channel byteCapacity purposes. Setting this value to `0` will cause this value to fall back to a hard internal limit of about 200 GB. |

#### 2> Demo

### File Channel

#### 1> Properties

| Property Name Default                       | Description                      |                                                              |
| :------------------------------------------ | :------------------------------- | :----------------------------------------------------------- |
| **type**                                    | –                                | The component type name, needs to be `file`.                 |
| checkpointDir                               | ~/.flume/file-channel/checkpoint | The directory where checkpoint file will be stored           |
| useDualCheckpoints                          | false                            | Backup the checkpoint. If this is set to `true`, `backupCheckpointDir` **must** be set |
| backupCheckpointDir                         | –                                | The directory where the checkpoint is backed up to. This directory **must not** be the same as the data directories or the checkpoint directory |
| dataDirs                                    | ~/.flume/file-channel/data       | Comma separated list of directories for storing log files. Using multiple directories on separate disks can improve file channel peformance |
| transactionCapacity                         | 10000                            | The maximum size of transaction supported by the channel     |
| checkpointInterval                          | 30000                            | Amount of time (in millis) between checkpoints               |
| maxFileSize                                 | 2146435071                       | Max size (in bytes) of a single log file                     |
| minimumRequiredSpace                        | 524288000                        | Minimum Required free space (in bytes). To avoid data corruption, File Channel stops accepting take/put requests when free space drops below this value |
| capacity                                    | 1000000                          | Maximum capacity of the channel                              |
| keep-alive                                  | 3                                | Amount of time (in sec) to wait for a put operation          |
| use-log-replay-v1                           | false                            | Expert: Use old replay logic                                 |
| use-fast-replay                             | false                            | Expert: Replay without using queue                           |
| checkpointOnClose                           | true                             | Controls if a checkpoint is created when the channel is closed. Creating a checkpoint on close speeds up subsequent startup of the file channel by avoiding replay. |
| encryption.activeKey                        | –                                | Key name used to encrypt new data                            |
| encryption.cipherProvider                   | –                                | Cipher provider type, supported types: AESCTRNOPADDING       |
| encryption.keyProvider                      | –                                | Key provider type, supported types: JCEKSFILE                |
| encryption.keyProvider.keyStoreFile         | –                                | Path to the keystore file                                    |
| encrpytion.keyProvider.keyStorePasswordFile | –                                | Path to the keystore password file                           |
| encryption.keyProvider.keys                 | –                                | List of all keys (e.g. history of the activeKey setting)     |
| encyption.keyProvider.keys.*.passwordFile   | –                                | Path to the optional key password file                       |

#### 2> Demo

```properties
a1.sources = s1
a1.sources.s1.channels = c1
a1.sources.s1.type = exec
a1.sources.s1.command = tail -F /tmp/phoenixera/log/test.log 
a1.sources.s1.batchSize = 100

a1.channels = c1
a1.channels.c1.type = file

a1.sinks = k1
a1.sinks.k1.type = logger
a1.sinks.k1.channel = c1
```

### Kafka Channel

#### 1> Properties

| Property Name                           | Default       | Description                                                  |
| :-------------------------------------- | :------------ | :----------------------------------------------------------- |
| **type**                                | –             | The component type name, needs to be `org.apache.flume.channel.kafka.KafkaChannel` |
| **kafka.bootstrap.servers**             | –             | List of brokers in the Kafka cluster used by the channel This can be a partial list of brokers, but we recommend at least two for HA. The format is comma separated list of hostname:port |
| kafka.topic                             | flume-channel | Kafka topic which the channel will use                       |
| kafka.consumer.group.id                 | flume         | Consumer group ID the channel uses to register with Kafka. Multiple channels must use the same topic and group to ensure that when one agent fails another can get the data Note that having non-channel consumers with the same ID can lead to data loss. |
| parseAsFlumeEvent                       | true          | Expecting Avro datums with FlumeEvent schema in the channel. This should be true if Flume source is writing to the channel and false if other producers are writing into the topic that the channel is using. Flume source messages to Kafka can be parsed outside of Flume by using org.apache.flume.source.avro.AvroFlumeEvent provided by the flume-ng-sdk artifact |
| pollTimeout                             | 500           | The amount of time(in milliseconds) to wait in the “poll()” call of the consumer. https://kafka.apache.org/090/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html#poll(long) |
| defaultPartitionId                      | –             | Specifies a Kafka partition ID (integer) for all events in this channel to be sent to, unless overriden by `partitionIdHeader`. By default, if this property is not set, events will be distributed by the Kafka Producer’s partitioner - including by `key` if specified (or by a partitioner specified by `kafka.partitioner.class`). |
| partitionIdHeader                       | –             | When set, the producer will take the value of the field named using the value of this property from the event header and send the message to the specified partition of the topic. If the value represents an invalid partition the event will not be accepted into the channel. If the header value is present then this setting overrides `defaultPartitionId`. |
| kafka.consumer.auto.offset.reset        | latest        | What to do when there is no initial offset in Kafka or if the current offset does not exist any more on the server (e.g. because that data has been deleted): earliest: automatically reset the offset to the earliest offset latest: automatically reset the offset to the latest offset none: throw exception to the consumer if no previous offset is found for the consumer’s group anything else: throw exception to the consumer. |
| kafka.producer.security.protocol        | PLAINTEXT     | Set to SASL_PLAINTEXT, SASL_SSL or SSL if writing to Kafka using some level of security. See below for additional info on secure setup. |
| kafka.consumer.security.protocol        | PLAINTEXT     | Same as kafka.producer.security.protocol but for reading/consuming from Kafka. |
| *more producer/consumer security props* |               | If using SASL_PLAINTEXT, SASL_SSL or SSL refer to [Kafka security](http://kafka.apache.org/documentation.html#security) for additional properties that need to be set on producer/consumer. |

#### 2> Demo

```properties
a1.sources = s1
# 配置两channel便于观察
a1.channels = c1 c2
a1.sinks = k1

a1.sources.s1.channels = c1 c2
a1.sources.s1.type = exec
a1.sources.s1.command = tail -F /tmp/phoenixera/log/test.log 

a1.channels.c1.type = org.apache.flume.channel.kafka.KafkaChannel
a1.channels.c1.kafka.bootstrap.servers = linux01:9092,linux02:9092,linux03:9092
a1.channels.c1.parseAsFlumeEvent = false

a1.channels.c2.type = memory
a1.sinks.k1.type = logger
a1.sinks.k1.channel = c2
```

> bin/flume-ng agent -n a1 -c conf/ -f agentconf/kfkc.conf -Dflume.root.logger=DEBUG,console

> /usr/apps/kafka_2.11-1.1.1/bin/kafka-console-consumer.sh --bootstrap-server linux01:9092,linux02:9092,linux03:9092 --topic flume-channel --from-beginning

```properties
a1.sources = s1
a1.channels = c1
a1.sinks = k1

a1.sources.s1.channels = c1
a1.sources.s1.type = exec
a1.sources.s1.command = tail -F /tmp/phoenixera/log/test.log 

a1.channels.c1.type = org.apache.flume.channel.kafka.KafkaChannel
a1.channels.c1.kafka.bootstrap.servers = linux01:9092,linux02:9092,linux03:9092
a1.channels.c1.parseAsFlumeEvent = false

a1.sinks.k1.channel = c1
a1.sinks.k1.type = logger
```

> bin/flume-ng agent -n a1 -c conf/ -f agentconf/kfkc-logger.conf -Dflume.root.logger=INFO,console
