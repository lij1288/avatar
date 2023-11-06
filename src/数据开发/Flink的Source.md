## **Flink的Source**

### Kafka Source

```
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-kafka</artifactId>
            <version>1.15.3</version>
        </dependency>
```



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