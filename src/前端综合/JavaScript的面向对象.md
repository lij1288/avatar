## **JavaScript的面向对象**

### 创建对象

- 可使用{}创建对象
- 可使用对象作为属性值

- 可使用Symbol作为属性名，通过[]获取属性值

```javascript
let obj = Object()
obj.field1 = 1
obj.field2 = 2
delete obj.field2 // 删除属性
console.log(obj.field1)
console.log("field2" in obj) // 检查对象中是否有某个属性
```

```javascript
let field3 = Symbol()
let obj = {
    field1:"field1",
    ["field2"]:"field2",
    [field3]:"field3",
    field4:{
        field41:"field41",
        field42:"field42"
    }
}
console.log(obj)
console.log(obj.field1)
console.log(obj.field2)
console.log(obj[field3])
console.log(obj.field4.field41)
```

### 枚举属性

- Symbol属性不会被枚举

```javascript
for(let propName in obj){
    console.log(propName, obj[propName])
}
```

### 方法和函数

#### 方法

- 当一个对象的属性指向一个函数，则称这个函数是该对象的方法

```javascript
obj = {}
obj.fn = function(){
    console.log("demo")
}
obj.fn()
```

#### 函数

- 函数也是一个对象
- typeof返回function

```javascript
function fn(){
    console.log("demo")
}
console.log(typeof fn)
```

#### 创建函数

```javascript
function fn1(){
    console.log("demo1")
}

let fn2 = function(){
    console.log("demo2")
}

let fn3 = () => {
    console.log("demo3")
}

let fn4 = () => console.log("demo4")
```

#### 参数

- 若实参多于形参，多余的实参不会使用
- 若形参多余实参，多余的形参为undefined

```javascript
function fn(a,b){
    console.log(a + b)
}
fn(1,2)
```

- 定义参数时可为参数指定默认值

```javascript
function fn(a,b=2){
    console.log(a + b)
}
fn(1)
```

- 箭头函数只有1个参数时可以省略括号

```javascript
let fn = x => {
    console.log(x)
}
```

#### 返回值

- 若没有return或return后没有任何值则返回undefined

```javascript
function fn(a, b) {
    return a + b
}
```

- 箭头函数的返回值可以直接写在箭头后

```javascript
let fn1 = (a, b) => a + b
let fn2 = () => ({id:1, name:"avatar"})
```

#### window

- 浏览器提供了一个window对象，代表的是浏览器窗口
- 通过window对象可以对浏览器窗口进行操作，window对象还负责存储JS中的内置对象和浏览器的宿主对象

- 向window对象中添加的属性会自动成为全局遍历
- var用于声明变量，作用与let相同，但不具有块作用域，有函数作用域
- 在全局或块中使用var声明的变量会作为window对象的属性保存
- 函数会作为window对象的方法保存
- let声明的变量不会存储在window对象中

#### this

- 以函数形式调用时，this指向window
- 以方法形式调用时，this指向调用方法的对象

- 箭头函数的this由外层作用域决定

```javascript
function fn1() {
    console.log("fn1 -->", this)
}

const fn2 = () => {
    console.log("fn2 -->", this) // 总是window
}

fn1() // window
fn2() // window

const obj = {
    fn1,
    fn2,
    objfn(){
        console.log(this.name)

        function objfn1(){
            console.log("objfn1 -->", this)
        }
        objfn1()

        let objfn2 = () => {
            console.log("objfn2 -->", this)
        }

        objfn2()
    }
}

obj.fn1() // obj
obj.fn2() // window
obj.objfn() // window obj
```

### 类和构造函数

- 实例属性只能通过实例访问
- 静态属性只能通过类访问
- 实例方法中的this为当前实例
- 静态方法中的this为当前类

```javascript
class Demo{
    field1 = 'test1'
    static field2 = 'test2'
    fn1(){
        console.log('fn1',this)
    }

    static fn2(){
        console.log('fn2',this)
    }
}

let d = new Demo()
console.log(d)
console.log(Demo.field2)
d.fn1()
Demo.fn2()
```

- 通过构造函数为实例属性赋值

```javascript
class Demo{
    constructor(field1,field2){
        this.field1 = field1
        this.field2 = field2
    }
}

let d = new Demo('test1', 'test2')
console.log(d)
```

- 检查对象是否是类的实例

```javascript
console.log(d instanceof Demo)
```



### 封装

```javascript
class Demo{
    #field1
    #field2
    constructor(field1,field2){
        this.#field1 = field1
        this.#field2 = field2
    }
    setField1(field1){
        this.#field1 = field1
    }
    getField1(){
        return this.#field1
    }
    setField2(field2){
        this.#field2 = field1
    }
    getField2(){
        return this.#field2
    }
}

let d = new Demo('test1', 'test2')
console.log(d)
d.setField1('test')
console.log(d.getField1())
```

### 继承

```javascript
class Demo{
    constructor(field1){
        this.field1 = field1
    }
    fn(){
        console.log('demo')
    }
}

class SubDemo extends Demo{
    constructor(field1,field2){
        super(field1)
        this.field2 = field2
    }
    fn(){
        super.fn()
        console.log('demo2')
    }
}

sd = new SubDemo('test1','test2')
console.log(sd)
sd.fn()
```

### 多态

- 在JS中不会检查参数的类型，要调用某个函数，无需指定的类型，只要对象满足条件即可

```javascript
class Demo{
    constructor(field1){
        this.field1 = field1
    }
}

let d = new Demo('test')

function fn(obj){
    console.log(obj.field1)
}
fn(d)
```

### 原型对象

- 原型链
  - 原型对象形成原型链
  - 读取对象属性时，优先使用对象自身属性，若没有则使用上一级原型对象的属性，直到找到Object对象仍未找到则返回undefined

- 所有同类型对象的原型对象是同一个
- 原型对象提供一个公共的区域可以被所有该类型对象访问，JS中的继承是通过原型对象来实现的
- 访问原型对象

```javascript
class Demo{
    constructor(field1){
        this.field1 = field1
    }
    fn(){
        console.log('demo')
    }
}

let d = new Demo('test')

console.log(d.__proto__)
console.log(Object.getPrototypeOf(d))
```

- 检查对象是否有某属性

```javascript
class Demo{
    constructor(field1){
        this.field1 = field1
    }
    fn(){
        console.log('demo')
    }
}
let d = new Demo('test')

console.log(d instanceof Demo)
console.log("fn" in d) // 检查对象自身或原型中是否有某属性
console.log(Object.hasOwn(d,"fn")) // 检查对象自身是否有某属性
```

### 属性复制

- 将被复制对象的属性复制到目标对象

```javascript
let obj = {addrid:1, addr:'addr1'}

let obj2 = {name:'avatar', age:12}
Object.assign(obj2,obj)

console.log(obj2)
let obj3 = {name:'avatar', age:12, ...obj}
console.log(obj3)
```

### 高阶函数

- 将函数作为参数或返回值的函数

```javascript
function filter(arr, func){
    let arr2 = []
    for (let i = 0; i < arr.length; i++){
        if (func(arr[i])) {
            arr2.push(arr[i])
        }
    }
    return arr2
}

let Person{
    constructor(name,age){
        this.name = name
        this.age = age
    }
}
let arr = [
    new Person('avatar',12),
    new Person('katara',14),
    new Person('sokka',15)
]
console.log(filter(arr, a => a.age > 12))

arr2 = [1,2,3,4,5]
console.log(filter(arr2, a => a%2 == 1))
```

```javascript
function demo(){
    console.log("demo")
    return "demo"
}
function logger(func){
    return () => {
        console.log("logging")
        let result = func()
        return result
    }
}
let demo2 = logger(demo)
demo2()
```

### 闭包

- 主要用来隐藏不希望被外部访问的内容

- 构成的条件
  - 函数的嵌套
  - 内部函数引用外部函数中的变量
  - 内部函数作为返回值

```javascript
function demo(){
    let num = 0 
    return () => {
        num++
        console.log(num)
    }
}
let demo2 = demo()
demo2()
demo2()
demo2()
let demo3 = demo()
demo3()
demo3()
demo3()
```

