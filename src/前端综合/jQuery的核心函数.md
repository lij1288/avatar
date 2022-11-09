## **jQuery的核心函数**

- jQuery的引入

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
    <script src="https://cdn.staticfile.org/jquery/3.6.0/jquery.js"></script>
</head>
<body>
    <script>
        console.log($)
    </script>
</body>
</html>

```

### $作为工具类使用

```javascript
let a=1
console.log($.isNumeric(a))
```

### $作为函数使用

- 函数作为参数
  - 函数将在文档加载完后执行

```html
<script>
	$(function(){
	    console.log("demo")
	})
</script>
```

- 选择器作为参数
  - 返回经过包装的jQuery对象，不能直接调用原生DOM对象的方法

```html
<button id="btn1">test</button>
<script>
	let $btn1 = $("#btn1")
	console.log($btn1)
</script>
```

- DOM对象作为参数
  - 将DOM对象转为jQuery对象

```html
<button id="btn1">test</button>
<script>
    let btn1 = document.getElementById("btn1")
    let $btn1 = $(btn1)
    console.log($btn1)
</script>
```

- HTML代码作为参数
  - 根据HTML代码创建jQuery对象

```html
<div id="div1"></div>
<script>
    let $btn1 = $("<button id='btn1'>test</button>")
    $("#div1").append($btn1)
</script>
```
