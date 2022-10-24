## **Scala的while读取io流死循环问题处理**

### 问题记录

```scala
val br = new BufferedReader(new FileReader("data/input/category.dat"))
var line: String = null
while ((line = br.readLine() ) != null){
    println(line)
}
```

### 解决过程

- line = br.readLine()在scala中被认为是一个表达式, 返回类型为Unit, 值为()

```scala
val res: Unit = (line = br.readLine())
println(res)// ()
```

```scala
var line: String = null
do{
    line = br.readLine()
    if(line != null){
        println(line)
    }
}while(line != null)
```



