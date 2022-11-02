## **JavaScript的序列化**

- JS中对象的序列化是将一个对象转换为JSON字符串

### JSON

- JavaScript Object Notation（JS对象简谱）

- JS的序列化工具类
- 一个序列号的对象或数组
- 一种轻量的数据交换格式

### 序列化和反序列化

```javascript
let obj = {name:'avatar',age:12}
let str = JSON.stringify(obj)
console.log(str)
let obj2 = JSON.parse(str)
console.log(obj2)
```

### 编写JSON字符串的注意事项

- JSON字符串的两种类型
  - JSON对象{}
  - JSON数组[]
- JSON字符串的属性名必须使用双引号
- JSON中可以使用的属性值/元素
  - 数字Number
  - 字符串String（必须使用双引号）
  - 布尔值Boolean
  - 空值Null
  - 对象Object {}
  - 数组Array []



