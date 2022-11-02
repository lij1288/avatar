## **JavaScript的解构赋值**

```javascript
let arr = [1,2,3]
let a,b,c
[a,b,c] = arr
console.log(a,b,c)

let [x,y,z] = [1,2,3]
console.log(x,y,z)
```

- 通过解构赋值进行变量交换

```javascript
let a = 1
let b = 2
;[a,b] = [b,a]
console.log(a,b)
```

- 通过解构赋值进行元素交换

```javascript
let arr = [1,2]
;[arr[0],arr[1]] = [arr[1],arr[0]]
console.log(arr)
```

- 对象的解构
  - 若没有对应属性返回underfined

```javascript
let obj = {name:'avatar',age:12}
let {name,addr,age} = obj
console.log(name,addr,age)

let {id:a = 1,name:b,age:c} = obj
console.log(a,b,c)
```



