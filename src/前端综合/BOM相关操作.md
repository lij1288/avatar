## **BOM相关操作**

- Browser Object Model浏览器对象模型
- BOM对象作为window的属性保存，可直接使用
- Window：窗口对象
- Navigator：浏览器对象

- Location：地址栏对象
- History：历史记录对象
- Screen：屏幕对象

### Navigator

- 获取浏览器信息
  - navigator.userAgent

```javascript
console.log(navigator.userAgent)
```

### Location

- 获取当前地址
  - location.href

```javascript
console.log(location.href)
```

- 调转到新地址
  - location.assign()

```javascript
location.assign("https://lijiong.cn")
```

```javascript
location = "https://lijiong.cn"
```

- 跳转到新地址（无法回退）
  - location.replace()

```javascript
location.replace("https://lijiong.cn")
```

- 刷新页面

  - location.reload()
    - 可选参数：true清理缓存

```javascript
location.reload(true)
```

### History

- 回退

```javascript
history.back()
```

- 前进

```javascript
history.forward()
```

- 指定页数回退/前进
  - 负数：回退；正数：前进

```javascript
history.go(-1)
```

```javascript
history.go(1)
```

### 定时器

#### 延迟执行

- setTimeout()
  - 参数1：回调函数
  - 参数2：毫秒时间
  - 关闭：clearTimeout(timer)

```javascript
let timer = setTimeout(()=>{
    console.log("test")
}, 3000)
// clearTimeout(timer)
```

#### 间隔执行

- setInterval()
  - 参数1：回调函数
  - 参数2：毫秒时间
  - 关闭：clearInterval()

```javascript
let timer = setInterval(()=>{
    console.log("test")
}, 3000)
// clearInterval(timer)
```
