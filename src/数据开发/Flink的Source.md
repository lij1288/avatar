## **Flink的Source**

### Kafka Source

```
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-kafka</artifactId>
            <version>1.15.3</version>
        </dependency>
```

- 起始消费位移
  - OffsetsInitializer.committedOffsets(OffsetResetStrategy.LATEST)
    - 选择为之间所提交的偏移量，若不存在则设为最新。
  - OffsetsInitializer.earliest()
    - 选择为最早。
  - OffsetsInitializer.latest()
    - 选择为最新。
  - OffsetsInitializer.offsets(Map<TopicPartition, Long> offsets)
    - 选择为参数指定的每个分区和对应的偏移量。
- setProperty("auto.offset.commit", "true")
  - 开启Kafka的自动位移提交机制，将最新偏移量提交到Kafka的comsumer_offset中。
  - KafkaSource不依赖与Kafka的自动位移提交机制，宕机时从Flink状态中获取偏移量。
  - 用于**方便外部监控系统跟踪消费进度、数据积压程度**，因为外部监控系统不方便获取Flink内部状态。
- setBounded(OffsetsInitializer stoppingOffsetsInitializer)
  - 将本Source算子设置为有界流，读到指定位置后停止读取并退出。
  - 用于**补数、重跑历史数据**。
- setUnbounded(OffsetsInitializer stoppingOffsetsInitializer)
  - 将本Source算子设置为无界流，读到指定位置后停止读取但不退出。
  - 用于**读取某一固定长度数据与另外一个真正的无界流进行联合处理**。
- env.addSource(SourceFunction<OUT> function)
  - 参数为SourceFunction接口的实现类。
- env.fromSource(Source<OUT, ?, ?> source, WatermarkStrategy<OUT> timestampsAndWatermarks, String sourceName)
  - 参数为Source接口的实现类。

### 文件Source

```java
import org.apache.flink.api.java.io.TextInputFormat;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.source.FileProcessingMode;

public class flinkdemo {
    public static void main(String[] args) throws Exception {

        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

//       DataStreamSource<String> source = env.readTextFile("data/input");
        DataStreamSource<String> source = env.readFile(new TextInputFormat(null), "data/input", FileProcessingMode.PROCESS_CONTINUOUSLY, 1000);

        source.print();

        env.execute();
    }
}
```

### 自定义Source

### 测试Source

- 集合Source

> DataStreamSource<String> source = env.fromElements("a", "b", "c");

> List<String> list = Arrays.asList("a", "b", "c");
> DataStreamSource<String> source = env.fromCollection(list);

- Socket Source

> DataStreamSource<String> source = env.socketTextStream("10.0.43.51", 1288);