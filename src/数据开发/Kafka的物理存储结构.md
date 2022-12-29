## **Kafka的物理存储结构**

### 存储目录

#### topic-partition

### 数据文件

#### index

- offset->log文件中该消息的物理偏移量
- 以稀疏索引方式构造

> kafka-run-class.sh kafka.tools.DumpLogSegments --files 00000000000000000000.index --print-data-log

```
Dumping 00000000000000000000.index
offset: 55 position: 4150
offset: 300 position: 8330
offset: 535 position: 12917
......
```

#### log

> kafka-run-class.sh kafka.tools.DumpLogSegments --files 00000000000000000000.log --print-data-log

```
Dumping 00000000000000000000.log
Starting offset: 0
baseOffset: 0 lastOffset: 0 count: 1 baseSequence: -1 lastSequence: -1 producerId: -1 producerEpoch: -1 partitionLeaderEpoch: 0 isTransactional: false isControl: false position: 0 CreateTime: 1672034989919 size: 74 magic: 2 compresscodec: NONE crc: 1830590829 isvalid: true
| offset: 0 isValid: true crc: null keySize: -1 valueSize: 6 CreateTime: 1672034989919 baseOffset: 0 lastOffset: 0 baseSequence: -1 lastSequence: -1 producerEpoch: -1 partitionLeaderEpoch: 0 batchSize: 74 magic: 2 compressType: NONE position: 0 sequence: -1 headerKeys: [] payload: value0
baseOffset: 1 lastOffset: 1 count: 1 baseSequence: -1 lastSequence: -1 producerId: -1 producerEpoch: -1 partitionLeaderEpoch: 0 isTransactional: false isControl: false position: 74 CreateTime: 1672034990952 size: 74 magic: 2 compresscodec: NONE crc: 1124278838 isvalid: true
| offset: 1 isValid: true crc: null keySize: -1 valueSize: 6 CreateTime: 1672034990952 baseOffset: 1 lastOffset: 1 baseSequence: -1 lastSequence: -1 producerEpoch: -1 partitionLeaderEpoch: 0 batchSize: 74 magic: 2 compressType: NONE position: 74 sequence: -1 headerKeys: [] payload: value5
baseOffset: 2 lastOffset: 2 count: 1 baseSequence: -1 lastSequence: -1 producerId: -1 producerEpoch: -1 partitionLeaderEpoch: 0 isTransactional: false isControl: false position: 148 CreateTime: 1672034991976 size: 75 magic: 2 compresscodec: NONE crc: 3760709816 isvalid: true
| offset: 2 isValid: true crc: null keySize: -1 valueSize: 7 CreateTime: 1672034991976 baseOffset: 2 lastOffset: 2 baseSequence: -1 lastSequence: -1 producerEpoch: -1 partitionLeaderEpoch: 0 batchSize: 75 magic: 2 compressType: NONE position: 148 sequence: -1 headerKeys: [] payload: value10
baseOffset: 3 lastOffset: 3 count: 1 baseSequence: -1 lastSequence: -1 producerId: -1 producerEpoch: -1 partitionLeaderEpoch: 0 isTransactional: false isControl: false position: 223 CreateTime: 1672034992994 size: 75 magic: 2 compresscodec: NONE crc: 3235670643 isvalid: true
| offset: 3 isValid: true crc: null keySize: -1 valueSize: 7 CreateTime: 1672034992994 baseOffset: 3 lastOffset: 3 baseSequence: -1 lastSequence: -1 producerEpoch: -1 partitionLeaderEpoch: 0 batchSize: 75 magic: 2 compressType: NONE position: 223 sequence: -1 headerKeys: [] payload: value15
baseOffset: 4 lastOffset: 4 count: 1 baseSequence: -1 lastSequence: -1 producerId: -1 producerEpoch: -1 partitionLeaderEpoch: 0 isTransactional: false isControl: false position: 298 CreateTime: 1672034994014 size: 75 magic: 2 compresscodec: NONE crc: 3706759663 isvalid: true
| offset: 4 isValid: true crc: null keySize: -1 valueSize: 7 CreateTime: 1672034994014 baseOffset: 4 lastOffset: 4 baseSequence: -1 lastSequence: -1 producerEpoch: -1 partitionLeaderEpoch: 0 batchSize: 75 magic: 2 compressType: NONE position: 298 sequence: -1 headerKeys: [] payload: value20
baseOffset: 5 lastOffset: 5 count: 1 baseSequence: -1 lastSequence: -1 producerId: -1 producerEpoch: -1 partitionLeaderEpoch: 0 isTransactional: false isControl: false position: 373 CreateTime: 1672034995031 size: 75 magic: 2 compresscodec: NONE crc: 620151198 isvalid: true
| offset: 5 isValid: true crc: null keySize: -1 valueSize: 7 CreateTime: 1672034995031 baseOffset: 5 lastOffset: 5 baseSequence: -1 lastSequence: -1 producerEpoch: -1 partitionLeaderEpoch: 0 batchSize: 75 magic: 2 compressType: NONE position: 373 sequence: -1 headerKeys: [] payload: value25
......
```

#### timeindex

- timestamp->offset

> kafka-run-class.sh kafka.tools.DumpLogSegments --files 00000000000000000000.timeindex --print-data-log

```
Dumping 00000000000000000000.timeindex
timestamp: 1672123070492 offset: 55
timestamp: 1672123238350 offset: 300
timestamp: 1672123968894 offset: 535
......
```

### 数据文件切分条件

- log文件大小超过log.segment.bytes（默认1073741824 ，1 gibibyte）

- log文件中最小时间戳到当前时间戳超过log.roll.ms（默认null，优先级高于log.roll.hours）或log.roll.hours（默认168，7天）

- index文件，或timeindex文件大小超过log.index.size.max.bytes（默认10485760，10 mebibytes）

- 最新消息的偏移量与当前文件起始偏移量的差值大于Inter.MAX_VALUE，即最新消息的偏移量不能转换为相对偏移量