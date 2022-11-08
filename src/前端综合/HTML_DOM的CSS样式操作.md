## **HTML DOM的CSS样式操作**

### 修改CSS样式

```html
<body>
    <input type="submit" value="提交" id="id1">
    <script>
        let e = document.getElementById("id1")
        e.onmouseover = function(){
            e.style.color = "red"
        }
        e.onmouseleave = function(){
            e.style.color = "black"
        }
    </script>
</body>
```

### 读取CSS样式

- getComputedStyle()
  - 参数1：要获取样式的对象
  - 参数2：要获取的伪元素

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
    <style>
        .class1 {
            height: 100px;
            width: 200px;
            background-color: hsl(211, 57%, 70%);
        }
        .class1::before {
            content: "test";
        }
    </style>
</head>
<body>
    <div class="class1" id="div1"></div>
    <script>
        let d = document.getElementById("div1")
        let styleObj = getComputedStyle(d)
        console.log(styleObj)
        console.log(styleObj.backgroundColor)

        let beforeObj = getComputedStyle(d,"::before")
        console.log(beforeObj)
        console.log(beforeObj.content)
    </script>
</body>
</html>
```

### 通过class修改样式

#### className操作

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
    <style>
        .class1 {
            height: 100px;
            width: 200px;
            background-color: hsl(211, 57%, 70%);
        }
        .class2 {
            border-radius: 15px;
        }
        .class3 {
            height: 100px;
            width: 200px;
            background-color: hsl(81, 82%, 53%);
        }
    </style>
</head>
<body>
    <div class="class1" id="div1"></div>
    <div class="class1" id="div2"></div>
    <div class="class1" id="div3"></div>
    <script>
        let d1 = document.getElementById("div1")
        let d2 = document.getElementById("div2")
        let d3 = document.getElementById("div3")

        console.log(d1.className) // class1
        console.log(d1.classList) // DOMTokenList ['class1', value: 'class1']

        d2.className += " class2"
        console.log(d2.className) // class1 class2
        console.log(d2.classList) // DOMTokenList(2) ['class1', 'class2', value: 'class1 class2']

        d3.className = "class3"
        console.log(d3.className) // class3
        console.log(d3.classList) // DOMTokenList ['class3', value: 'class3']
    </script>
</body>
</html>
```

#### classList操作

- 添加一个或多个class
  - element.classList.add()
- 移除一个或多个class
  - element.classList.remove()
- 切换元素中的class
  - element.classList.toggle()
- 替换class
  - element.classList.replace()
- 检查是否包含指定class
  - element.classList.contains()

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
    <style>
        .class1 {
            height: 100px;
            width: 200px;
            background-color: hsl(211, 57%, 70%);
        }
        .class2 {
            border-radius: 15px;
        }
        .class3 {
            height: 100px;
            width: 200px;
            background-color: hsl(81, 82%, 53%);
        }
        .class4 {
            border-radius: 25px;
        }
    </style>
</head>
<body>
    <div class="class1 class2 class3" id="div1"></div>
    <script>
        let d1 = document.getElementById("div1")
        
        d1.classList.toggle("class3")

        d1.classList.remove("class1")
        d1.classList.add("class1")
        
        d1.classList.replace("class2","class4")
        
        console.log(d1.classList.contains("class4"))
    </script>
</body>
</html>
```
