## **JavaScript的基础语法**

### 编写位置

- 网页内部的script标签

```html
<script>
    alert("demo")
</script>
```

- 通过script标签引入外部的js文件

```html
<script src="./src/js/demo.js"></script>
```

- 将js代码编写在指定属性中

```html
<button onclick="alert('demo')">test</button>
```

```html
<a href="javascript:alert('demo')">test</a>
```

### 内容输出

```javascript
alert("弹窗内容")
console.log("控制台内容")
document.write("网页内容")
```

### 调试

```javascript
console.log(1)
debugger
console.log(2)
```

### 标识符

- 标识符只能包含字母、数字、下划线、$，且不能以数字开头
- 标识符不能是js中的关键字和保留字

### 变量和常量

#### 字面量

```javascript
console.log("demo")
console.log(1)
console.log(true)
console.log(null)
```

#### 变量

- let声明的变量具有块作用域，在代码块中声明的变量无法在代码块外访问，使用var在代码块中声明的变量可以在代码块外访问

```javascript
let x="demo1",y="demo2"
console.log(x)
console.log(y)
```

#### 常量

```javascript
const a=1
console.log(a)
```

### 数据类型

#### 数据类型

- typeof：输出值的类型

```javascript
let x="demo"
console.log(typeof x)
```

- 数值Number
  - 所有整数和浮点数
  - 数值超过一定范围会显示近似值
  - 特殊数值Infinity表示无穷
  - 特殊数值NaN表示无效数字

- 大整数Bigint
  - 可表示数值范围为无限大
  - 使用n结尾

- 字符串String
  - 通过单引号或双引号表示字符串
  - 模板字符串可以嵌入变量

```javascript
let x="demo"
let y=`${x}`
console.log(y)
```

- 布尔值Boolean
- 空值Null
  - typeof返回object
- 未定义Undefined
  - 未赋值变量的值
- 符号Symbol
  - 用来创建唯一标识

```javascript
let x=Symbol()
```

#### 类型转换

##### 转换为字符串

- toString()方法
  - null和undefined没有toString()方法，调用toString()会报错
- String()函数
  - null转换为"null"，undefined转换为"undefined"

```javascript
let a=true
b = a.toString()
c = String(a)
console.log(y,typeof b)
console.log(z,typeof c)
```

##### 转换为数值

- Number()函数

  - 字符串
    - 合法数字会自动转换为对应的数字
    - 空字符串或纯空格字符串则转换为0
    - 不是合法数字则转换为NaN

  - 布尔值
    - true转换为1，false转换为0
  - null转换为0
  - undefined转换为NaN

- parseInt()函数

  - 将字符串转换为整数，若参数不是字符串，则先转为字符串再转换
  - 从左到右解析，知道读取到字符串中所有的有效整数

- parseFloat()函数

  - 将字符串转换为小数，若参数不是字符串，则先转为字符串再转换
  - 从左到右解析，知道读取到字符串中所有的有效小数

```javascript
let a="1.5"
b = Number(a) // 1.5
c = parseInt(a) // 1
d = parseFloat(a) // 1.5
console.log(b,typeof b)
console.log(c,typeof c)
console.log(d,typeof d)
```

##### 转换为布尔值

- Bookean()函数
  - 数值
    - 0和NaN转换为flase，其他数值转换为true
  - 字符串
    - 空串转换为false，其他字符串转换为true
  - null和underfined转换为false
  - 对象转换为ture

```javascript
let a=0
b = Boolean(a) 
console.log(b,typeof b)
```

### 运算符

#### 算数运算符

- +、-、*、/、**、%
- ++、--
- 除了字符串的加法，其他运算的操作数不是数值时，会先转换为数值再进行运算
- JS是弱类型语言，当进行运算时会通过自动的类型转换完成运算

- 任意值和字符串做加法，会先转换为字符串再进行拼接，可用于将其他类型转为字符串

```javascript
a = 10 - '5' // 5
console.log(a,typeof a)
a = 10 + '5' // "105"
console.log(a,typeof a)
```

#### 赋值运算符

- =、+=、-=、*=、/=、**=、%=
- ??=当变量为null或undefined时才进行赋值

#### 一元运算符

- +、-
- 对非数值类型进行正负运算时，会先转换为数值，可用于将其他类型转为数值

#### 逻辑运算符

- !、&&、||
- 对非布尔值进行取反运算时，会先转换为布尔值，!!可用于将其他类型转为数值

#### 关系运算符

- <、<=、>、>=

- ==
  - 相等运算符，会先转换为相同类型再比较
  - null和undefined进行比较会返回true
  - NaN不和任何值相等，包括其自身
- !=
  - 不等运算符

- ===
  - 全等运算符，不会先转换为相同类型再比较
  - null和undefined进行比较会返回false
- !==
  - 不全等运算符

#### 条件运算符

- 条件表达式 ? 表达式1 : 表达式2

```javascript
let a = 100
let b = 200
let max = a > b ? a : b
console.log(max,typeof max)
```

### 流程控制结构

#### 选择结构

- if

```javascript
// 第一种形式
if(表达式){
    语句体
}
// 第二种形式
if(表达式){
    语句体1
}else{
    语句体2
}
// 第三种形式
if(表达式1){
    语句体1
}else if(表达式2){
    语句体2
}
...
else{
    语句体n
}
```

- switch

```javascript
switch(表达式){
    case 表达式1:
        语句体1
        break
	case 表达式2:
        语句体2
        break
	...
    default:
    	语句体n
        break
}
```

#### 循环结构

- while

```javascript
// 第一种形式
while(表达式){
    语句体
}
// 第二种形式
do{
    语句体
}while(表达式)
```

- for

```javascript
for(初始化表达式;条件表达式;更新表达式){
    语句体
}
```

#### 中断控制流程语句

- break
  - 终止switch和循环语句
- continue
  - 跳过当次循环
