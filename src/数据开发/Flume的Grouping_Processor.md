## **Flume的Grouping Processor**

### Failover Sink Processor

#### 1> Properties

| Property Name                     | Default   | Description                                                  |
| :-------------------------------- | :-------- | :----------------------------------------------------------- |
| **sinks**                         | –         | Space-separated list of sinks that are participating in the group |
| **processor.type**                | `default` | The component type name, needs to be `failover`              |
| **processor.priority.<sinkName>** | –         | Priority value. <sinkName> must be one of the sink instances associated with the current sink group A higher priority value Sink gets activated earlier. A larger absolute value indicates higher priority |
| processor.maxpenalty              | 30000     | The maximum backoff period for the failed Sink (in millis)   |

#### 2> Demo

```properties
a1.sources = s1
a1.channels = c1
a1.sinks = k1 k2

a1.sources.s1.channels = c1
a1.sources.s1.type = exec
a1.sources.s1.command = tail -F /tmp/phoenixera/test.log

a1.channels.c1.type = memory

a1.sinks.k1.channel = c1
a1.sinks.k1.type = avro
a1.sinks.k1.hostname = linux02
a1.sinks.k1.port = 1288

a1.sinks.k2.channel = c1
a1.sinks.k2.type = avro
a1.sinks.k2.hostname = linux03
a1.sinks.k2.port = 1288

a1.sinkgroups = g1
a1.sinkgroups.g1.sinks = k1 k2
a1.sinkgroups.g1.processor.type = failover
a1.sinkgroups.g1.processor.priority.k1 = 200
a1.sinkgroups.g1.processor.priority.k2 = 100
a1.sinkgroups.g1.processor.maxpenalty = 5000
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
a1.sinks.k1.type = logger
```

### Load balancing Sink Processor

#### 1> Properties

| Property Name                 | Default       | Description                                                  |
| :---------------------------- | :------------ | :----------------------------------------------------------- |
| **processor.sinks**           | –             | Space-separated list of sinks that are participating in the group |
| **processor.type**            | `default`     | The component type name, needs to be `load_balance`          |
| processor.backoff             | false         | Should failed sinks be backed off exponentially.             |
| processor.selector            | `round_robin` | Selection mechanism. Must be either `round_robin`, `random` or FQCN of custom class that inherits from `AbstractSinkSelector` |
| processor.selector.maxTimeOut | 30000         | Used by backoff selectors to limit exponential backoff (in milliseconds) |

#### 2> Demo

```properties
a1.sources = s1
a1.channels = c1
a1.sinks = k1 k2

a1.sources.s1.channels = c1
a1.sources.s1.type = exec
a1.sources.s1.command = tail -F /tmp/phoenixera/test.log

a1.channels.c1.type = memory

a1.sinks.k1.channel = c1
a1.sinks.k1.type = avro
a1.sinks.k1.hostname = linux02
a1.sinks.k1.port = 1288
a1.sinks.k1.batch-size = 5

a1.sinks.k2.channel = c1
a1.sinks.k2.type = avro
a1.sinks.k2.hostname = linux03
a1.sinks.k2.port = 1288
a1.sinks.k2.batch-size = 5

a1.sinkgroups = g1
a1.sinkgroups.g1.sinks = k1 k2
a1.sinkgroups.g1.processor.type = load_balance
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
a1.sinks.k1.type = logger
```


