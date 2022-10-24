## **Flume的自定义组件**

### 自定义Source

```java
import org.apache.commons.io.FileUtils;
import org.apache.flume.Context;
import org.apache.flume.Event;
import org.apache.flume.EventDrivenSource;
import org.apache.flume.channel.ChannelProcessor;
import org.apache.flume.conf.Configurable;
import org.apache.flume.event.EventBuilder;
import org.apache.flume.source.AbstractSource;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.ArrayList;

public class HoldOffsetSource extends AbstractSource implements EventDrivenSource, Configurable {

    String data_file_path;
    String position_file_path;
    Integer batchSize;
    Long batchTime;
    RandomAccessFile rda;

    public void configure(Context context) {
        data_file_path = context.getString("data_file_path");
        position_file_path = context.getString("position_file_path", "/tmp/position");
        batchSize = context.getInteger("batchSize", 100);
        batchTime = context.getLong("batchTime", 3000L);
    }

    @Override
    public synchronized void start() {
        super.start();
        try {
            long offset = 0;
            File positionFile = new File(position_file_path);
            if(positionFile.exists()){
                String position = FileUtils.readFileToString(positionFile);
                offset = Long.parseLong(position);
            }
            rda = new RandomAccessFile(new File(data_file_path), "r");
            rda.seek(offset);

            ChannelProcessor channelProcessor = getChannelProcessor();

            ArrayList<Event> events = new ArrayList<Event>();

            long preBatchTime = System.currentTimeMillis();

            String line = null;

            while(true){
                line = rda.readLine();
                if(line == null){
                    Thread.sleep(3000);
                    continue;
                }

                Event event = EventBuilder.withBody(line.getBytes());
                events.add(event);

                if(events.size() == batchSize || System.currentTimeMillis() - preBatchTime >batchTime){
                    channelProcessor.processEventBatch(events);
                    events.clear();
                    preBatchTime = System.currentTimeMillis();

                    offset = rda.getFilePointer();
                    FileUtils.writeStringToFile(positionFile, offset + "");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public synchronized void stop() {
        super.stop();
        try {
            if(rda != null){
                rda.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```



```properties
a1.sources = s1
a1.channels = c1
a1.sinks = k1

a1.sources.s1.channels = c1
a1.sources.s1.type = com.phoenixera.mysrc.HoldOffsetSource
a1.sources.s1.data_file_path = /tmp/phoenixera/test.log 
a1.sources.s1.position_file_path = /tmp/phoenixera/position
a1.sources.s1.batchSize = 150
a1.sources.s1.batchTime = 5000

a1.channels.c1.type = memory

a1.sinks.k1.channel = c1
a1.sinks.k1.type = logger
```

### 自定义Interceptor

```xml
        <dependency>
            <groupId>org.apache.flume</groupId>
            <artifactId>flume-ng-core</artifactId>
            <version>1.9.0</version>
            <scope>provided</scope>
        </dependency>
```



```java
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.flume.Context;
import org.apache.flume.Event;
import org.apache.flume.interceptor.Interceptor;

import java.util.ArrayList;
import java.util.List;

public class EncryptInterceptor implements Interceptor {

    private final String fields_separator;
    private final String fields_indexes;
    private final String indexes_separator;

    private EncryptInterceptor(String fields_separator, String fields_indexes, String indexes_separator) {
        this.fields_separator = fields_separator;
        this.fields_indexes = fields_indexes;
        this.indexes_separator = indexes_separator;
    }

    public void initialize() {

    }

    public Event intercept(Event event) {
        byte[] eventBody = event.getBody();
        String line = new String(eventBody);

        String[] fields = line.split(fields_separator);
        String[] indexes = fields_indexes.split(indexes_separator);
        for (String index : indexes) {
            int i = Integer.parseInt(index);
            String data = fields[i];
            String md5Data = DigestUtils.md5Hex(data);
            String base64Data = Base64.encodeBase64String(md5Data.getBytes());
            fields[i] = base64Data;
        }
        byte[] body2 = StringUtils.join(fields, fields_separator).getBytes();
        event.setBody(body2);
        return event;
    }

    public List<Event> intercept(List<Event> events) {
        ArrayList<Event> list = new ArrayList<Event>();
        for (Event event : events) {
            Event event2 = intercept(event);
            list.add(event2);
        }
        return list;
    }

    public void close() {
    }

    public static class Builder implements Interceptor.Builder{

        private String fields_separator = null;
        private String fields_indexes = null;
        private String indexes_separator = null;

        public Interceptor build() {
            return new EncryptInterceptor(fields_separator, fields_indexes, indexes_separator);
        }

        public void configure(Context context) {
            fields_separator = context.getString(Constants.FIELDS_SEPARATOR, ",");
            fields_indexes =  context.getString(Constants.FIELDS_INDEXES, "0");
            indexes_separator = context.getString(Constants.INDEXES_SEPARATOR, ":");
        }
    }

    public static class Constants{
        public static final String FIELDS_SEPARATOR = "fields_separator";
        public static final String FIELDS_INDEXES = "fields_indexes";
        public static final String INDEXES_SEPARATOR = "indexes_separator";
    }
}
```



```properties
a1.sources = s1
a1.sources.s1.channels = c1
a1.sources.s1.type = spooldir
a1.sources.s1.spoolDir = /tmp/phoenixera/clicklog
a1.sources.s1.batchSize = 100
a1.sources.s1.interceptors = i1
a1.sources.s1.interceptors.i1.type = com.phoenixera.myinter.EncryptInterceptor$Builder
a1.sources.s1.interceptors.i1.indices = 0:3
a1.sources.s1.interceptors.i1.idxSplitBy = :
a1.sources.s1.interceptors.i1.dataSplitBy = ,

a1.channels = c1
a1.channels.c1.type = memory
a1.channels.c1.capacity = 200
a1.channels.c1.transactionCapacity = 100

a1.sinks = k1
a1.sinks.k1.type = logger
a1.sinks.k1.channel = c1

# kafka
# a1.sinks = k1
# a1.sinks.k1.type = org.apache.flume.sink.kafka.KafkaSink
# a1.sinks.k1.kafka.bootstrap.servers = linux01:9092,linux02:9092,linux03:9092
# a1.sinks.k1.channel = c1
```

