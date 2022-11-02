## **JavaScript的内建结构**

### Date

#### 基本使用

```javascript
let d = new Date() // 当前时间
// let d = new Date("2016-01-20T15:12:45")
// let d = new Date(2016,0,20,15,12,58)

console.log(d) // Wed Jan 20 2016 15:12:58 GMT+0800 (中国标准时间)

console.log(d.getFullYear()) // 2016

console.log(d.getMonth()) // 1

console.log(d.getDate()) // 0

console.log(d.getDay()) // 20

console.log(d.getTime()) // 1453273978135

console.log(Date.now()) // 1453273978135

console.log(d.toLocaleDateString()) // 2016/1/20

console.log(d.toLocaleTimeString()) // 15:12:58
```

#### 日期格式化

- toLocaleString

  - 参数1：描述语言/国家信息的字符串

    - zh 中文

    - zh-CN 中文中国
    - en 英文
    - en-US 英文美国

  - 参数2：配置格式的对象

    - weekday、era

      - narrow
      - short
      - long

    - year、day、hour、minute、second

      - numeric
      - 2-digit

    - month

      - narrow
      - short
      - long

      - numeric
      - 2-digit

```javascript
let d = new Date(2016,0,20,15,12,58,135)

console.log(d.toLocaleString()) // 2016/1/20 15:12:58
console.log(d.toLocaleString('en-US')) // 1/20/2016, 3:12:58 PM

console.log(d.toLocaleString('en',{weekday:'narrow',era:'narrow'})) // A W
console.log(d.toLocaleString('en',{weekday:'short',era:'short'})) // AD Wed
console.log(d.toLocaleString('en',{weekday:'long',era:'long'})) // Anno Domini Wednesday

console.log(d.toLocaleString('en',{year:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'})) // 2016 (day: 20), 3:12:58 PM
console.log(d.toLocaleString('en',{year:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'})) // 16 (day: 20), 03:12:58 PM

console.log(d.toLocaleString('en',{month:'narrow'})) // J
console.log(d.toLocaleString('en',{month:'short'})) // Jan
console.log(d.toLocaleString('en',{month:'long'})) // January
console.log(d.toLocaleString('en',{month:'numeric'})) // 1
console.log(d.toLocaleString('en',{month:'2-digit'})) // 01
```

### Math

#### 常量

```javascript
console.log(Math.PI) // 3.141592653589793
```

#### 方法

```javascript
console.log(Math.abs(-1)) // 1

console.log(Math.min(1,2,3)) // 1

console.log(Math.max(1,2,3)) // 3

console.log(Math.pow(2,3)) // 8

console.log(Math.sqrt(9)) // 3

console.log(Math.floor(1.5)) // 1

console.log(Math.ceil(1.5)) // 2

console.log(Math.round(1.5)) // 2

console.log(Math.trunc(1.5)) // 1

console.log(Math.random()) // 
```

### String

#### 获取长度

```javascript
let str = 'abcade'
console.log(str.length)
```

#### 根据索引获取字符

```javascript
let str = 'abcade'
console.log(str.charAt(0))
```

#### 字符串拼接

```javascript
let str = 'abcade'
console.log(str.concat('f','g'))
```

#### 检查是否包含

```javascript
let str = 'abcade'
console.log(str.includes('ade'))
```

#### 获取索引

- 获取第一次出现的索引

```javascript
let str = 'abcade'
console.log(str.indexOf('a'))
```

- 获取最后一次出现的索引

```javascript
let str = 'abcade'
console.log(str.lastIndexOf('a'))
```

#### 检查开头/结尾

- 检查是否以某字符串开头

```javascript
let str = 'abcade'
console.log(str.startsWith('abc'))
```

- 检查是否以某字符串结尾

```javascript
let str = 'abcade'
console.log(str.endsWith('ade'))
```

#### 填充至指定长度

- 在开头填充至指定长度

```javascript
let str = 'abcade'
console.log(str.padStart(10,'1'))
```

- 在结尾填充至指定长度

```javascript
let str = 'abcade'
console.log(str.padEnd(10,'1'))
```

#### 字符串替换

- 替换第一处指定内容

```javascript
let str = 'abcade'
console.log(str.replace('a','x'))
```

- 替换全部指定内容

```javascript
let str = 'abcade'
console.log(str.replaceAll('a','x'))
```

#### 截取字符串

```javascript
let str = 'abcade'
console.log(str.slice(1,3))
console.log(str.substring(1,3))
```

#### 大小写转换

- 转换为大写

```javascript
let str = 'Abcade'
console.log(str.toUpperCase())
```

- 转换为小写

```javascript
let str = 'Abcade'
console.log(str.toLowerCase())
```

#### 去除前后空格

- 去除前后空格

```javascript
let str = '  abcade   '
console.log(str.trim())
```

- 去除开头空格

```javascript
let str = '  abcade   '
console.log(str.trimStart())
```

- 去重结尾空格

```javascript
let str = '  abcade   '
console.log(str.trimEnd())
```

### Array

#### 创建数组

```javascript
let arr = new Array()
arr[0] = 'a'
arr[1] = 'b'
arr[2] = 'c'
console.log(arr)
```

```javascript
let arr = ['a','b','c']
console.log(arr)
```

#### 获取长度

```javascript
let arr = ['a','b','c']
console.log(arr)
console.log(arr.length)
arr[arr.length] = 'd'
arr[arr.length] = 'e'
console.log(arr)
```

#### 检查是否为数组

```javascript
let arr = ['a','b','c']
console.log(Array.isArray(arr))
```

#### 根据索引获取元素

```javascript
let arr = ['a','b','c']
console.log(arr.at(1))
console.log(arr.at(-1)) // 最后一个元素
```

#### 数组拼接

```javascript
let arr = ['a','b','c']
let arr2 = arr.concat(['d','e'])
console.log(arr2)
```

#### 获取元素索引

- 获取元素第一次出现的索引
  - 参数2：起始位置

```javascript
let arr = ['a','b','c']
console.log(arr.indexOf('c',1))
```

- 获取元素最后一次出现的索引
  - 参数2：起始位置

```javascript
let arr = ['a','b','c']
console.log(arr.lastIndexOf('a',1))
```

#### 拼接元素

- 默认使用逗号拼接

```javascript
let arr = ['a','b','c']
console.log(arr.join())
console.log(arr.join(' '))
```

#### 截取数组

- 参数1：起始索引
- 参数2：结束索引，可省略

```javascript
let arr = ['a','b','c']
console.log(arr.slice(1))
console.log(arr.slice(0,2))
```

#### 展开数组

- 可将数组的元素展开到另一个数组中或作为函数的参数传递

```javascript
let arr = [1,2,3]
let arr2 =[...arr,4,5]
console.log(arr2)

function sum(x,y,z){
    return x+y+z
}
console.log(sum(...arr))
```

#### 添加/删除元素

- 在末尾添加一个或多个元素，返回新的长度

```javascript
let arr = [1,2,3,4,5]
console.log(arr.push(6,7))
console.log(arr)
```

- 在开头添加一个或多个元素，返回新的长度

```javascript
let arr = [1,2,3,4,5]
console.log(arr.unshift(6,7))
console.log(arr)
```

- 删除并返回最后一个元素

```javascript
let arr = [1,2,3,4,5]
console.log(arr.pop())
console.log(arr)
```

- 删除并返回第一个元素

```javascript
let arr = [1,2,3,4,5]
console.log(arr.shift())
console.log(arr)
```

#### 替换元素

- 参数1：删除的起始位置
- 参数2：删除的个数
- 参数n：插入的元素
- 返回值：被删除的元素

```javascript
let arr = [1,2,3,4,5]
console.log(arr.splice(1,2,6,7))
console.log(arr)
```

#### 反转数组

```javascript
let arr = [1,2,3,4,5]
arr.reverse()
console.log(arr)
```

#### 遍历数组

```javascript
for(let i=0; i<arr.length; i++){
    console.log(arr[i])
}

for(let value of arr){
    console.log(value)
}
```

- foreach
  - 需要回调函数作为参数，
    - element：当前元素
    - index：当前元素的索引
    - array：被遍历的数组

```javascript
let arr = ['a','b','c','d','e']
arr.forEach((element,index,array) => {
    console.log(element,index,array)
})
```

#### 数组排序

```javascript
let arr = [3,2,1,4,5]
arr.sort()
console.log(arr)
arr.sort((x, y) => y - x)
console.log(arr)
```

#### 过滤数组

- 将数组中符合条件的元素保存到新数组返回

```javascript
let arr = [1,2,3,4,5]
let res = arr.filter((i) => i%2 == 1)
console.log(res)
```

#### 映射数组

- 根据当前数组生成一个新数组

```javascript
let arr = [1,2,3,4,5]
let res = arr.map((i) => i*3)
console.log(res)
```

#### 聚合数组

- 参数
  - 回调函数：聚合规则
  - 可选参数：初始值

```javascript
let arr = [1,2,3,4,5]
let res = arr.reduce((a, b) => a + b,10)
console.log(res)
```

### Map

#### 基本使用

```javascript
let m = new Map()
m.set('key1','value1')
m.set('key2','value2')
m.set('key3','value3')
console.log(m)
console.log(m.keys())
console.log(m.values())
console.log(m.size)

console.log(m.get('key1'))

console.log(m.has('key3'))

m.delete('key3')
console.log(m)

m.clear()
console.log(m)
```

#### Map和数组转换

```javascript
let m = new Map([
    ['key1','value1'],
    ['key2','value2'],
    ['key3','value3']
])
console.log(m)

let arr = Array.from(m)
console.log(arr)
```

### Set

#### 基本使用

```javascript
let s = new Set()
s.add(1)
s.add(1)
s.add(2)
s.add(3)
console.log(s)
console.log(s.size)

console.log(s.has(3))

s.delete(3)
console.log(s)

s.clear()
console.log(s)
```

#### Set和数组转换

```javascript
let s = new Set([1,1,2,3])
console.log(s)
let arr = [...s]
console.log(arr)
```

### RegExp

#### 正则创建于匹配

- 通过构造函数创建
  - 参数1：正则表达式
  - 参数2：可选，匹配模式
    - i：忽略大小写
    - g：全局匹配

```javascript
let reg = new RegExp('abc','i')
console.log(reg.test('AbcAdeabc'))
```

- 通过字面量创建
  - /正则表达式/匹配模式

```javascript
let reg = /abc/i
```

#### 正则提取

```javascript
let reg = /abc/ig
console.log(reg.exec('AbcAdeabc')) // ['Abc', index: 0, input: 'AbcAdeabc', groups: undefined]
console.log(reg.exec('AbcAdeabc')) // ['abc', index: 6, input: 'AbcAdeabc', groups: undefined]
```

#### 相关方法

##### 拆分字符串

```javascript
let str = '2016-01-20'
console.log(str.split(/-/)) // ['2016', '01', '20']
```

##### 获取第一次匹配的位置

```javascript
let str = 'AbcAdeabc'
console.log(str.search(/abc/i)) // 0 
```

##### 替换字符串

```javascript
let str = 'AbcAdeabc'
console.log(str.replace(/a/,'x')) // AbcAdexbc
console.log(str.replace(/a/ig,'x')) // xbcxdexbc 
```

##### 匹配符合的内容

```javascript
let str = 'AbcAdeabc'
console.log(str.match(/a[b-z]{2}/i)) // ['Abc', index: 0, input: 'AbcAdeabc', groups: undefined]
```

- 全局匹配符合的内容

```javascript
let str = 'AbcAdeabc'
let res = str.matchAll(/a[b-z]{2}/ig)
for(let i of res){
    console.log(i)
}
// ['Abc', index: 0, input: 'AbcAdeabc', groups: undefined]
// ['Ade', index: 3, input: 'AbcAdeabc', groups: undefined]
// ['abc', index: 6, input: 'AbcAdeabc', groups: undefined]
```

