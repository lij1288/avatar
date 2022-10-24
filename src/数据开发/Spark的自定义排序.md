## **Spark的自定义排序**

- 定义class，实现Serializable和Comparable或定义case class实现ordered接口（默认实现序列化接口）

- 隐式转换
- 借助元组来排序