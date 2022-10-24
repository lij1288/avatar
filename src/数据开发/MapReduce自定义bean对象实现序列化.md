## **MapReduce自定义bean对象实现序列化**

- Java的序列化框架Serializable，对象被序列化后会附带额外信息，不便于在网络中传输
- 自定义bean对象
  1. 实现Writable接口
  2. 必须有空参构造，反序列化时，需要反射调用空参构造函数
  3. 重写序列化和反序列化方法，顺序要完全一致
  4. 若自定义bean要作为key，需实现Comparable接口（或直接WritableComparable），因为shuffle过程会对key排序

```java
// hadoop在序列化该类的对象时要调用的方法 --- 将对象的属性值转为二进制
@Override
public void write(DataOutput out) throws IOException {

	out.writeUTF(this.field1);
	out.writeUTF(this.field2);
	out.writeUTF(this.field3);
}
// hadoop在反序列化该类的对象时要调用的方法 --- 从二进制中解析出数据，赋给对象的属性
@Override
public void readFields(DataInput in) throws IOException {
	
	this.field1 = in.readUTF();
	this.field2 = in.readUTF();
	this.field3 = in.readUTF();
}
```