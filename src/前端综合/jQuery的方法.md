## **jQuery的方法**

### 筛选元素

- 根据索引获取元素
  - eq()
- 获取第一个元素
  - first()
- 获取最后一个元素
  - last()
- 获取索引为偶数的元素
  - even()
- 获取索引为奇数的元素
  - odd()
- 切片筛选元素
  - slice()
- 过滤元素
  - filter()

```html
<button id="test">test</button>
<div id="div1">
    <button class="class1" id="btn1">btn1</button>
    <button class="class1" id="btn2">btn2</button>
    <button class="class1" id="btn3">btn3</button>
    <button class="class1 class2" id="btn4">btn4</button>
    <button class="class2" id="btn5">btn5</button>
</div>
<script>
    $(function(){
        $("#test").click(function(){
            console.log($(".class1"))
            console.log($(".class1").eq(-1))
            console.log($(".class1").first())
            console.log($(".class1").last())
            console.log($(".class1").even())
            console.log($(".class1").odd())
            console.log($(".class1").slice(1,3))
            console.log($(".class1").filter(".class2"))
        })
    })
</script>
```

- 将jQuery对象恢复到筛选前的状态
  - end()
- 向jquery对象中添加元素
  - add()

```html
<button id="test">test</button>
<div id="div1">
    <button class="class1" id="btn1">btn1</button>
    <button class="class1" id="btn2">btn2</button>
    <button class="class1" id="btn3">btn3</button>
    <button class="class1 class2" id="btn4">btn4</button>
    <button class="class2" id="btn5">btn5</button>
</div>
<script>
    $(function(){
        $("#test").click(function(){
            $(".class1")
            .first()
            .css("background-color","hsl(81, 82%, 53%)")
            .end()
            .css("border-color","hsl(211, 57%, 70%)")
            .add(".class2")
            .css("font-weight","bold")
        })
    })
</script>
```

### 添加子元素

- 在父元素后添加子元素
  - append()
- 将子元素添加到父元素后
  - appendTo()
- 在父元素前添加子元素
  - prepend()
- 将子元素添加到父元素前
  - prependTo()

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
    <script src="https://cdn.staticfile.org/jquery/3.6.0/jquery.js"></script>
    <style>
        .class1 {
            height: 200px;
            width: 300px;
            background-color: hsl(211, 57%, 70%);
        }
        .class2 {
            border-radius: 15px;
        }
        .class3 {
            height: 50px;
            width: 200px;
            background-color: hsl(81, 82%, 53%);
        }
    </style>
</head>
<body>
    <button id="btn">btn</button>
    <div class="class1" id="div1">
        <button id="btn1">btn1</button>
        <button id="btn2">btn2</button>
    </div>
    <script>
        $(function(){
            $("#btn").click(function(){
                $("#div1").append("<div class='class3'>")
                // $("<div class='class3'>").appendTo("#div1")

                // $("#div1").prepend("<div class='class3'>")
                // $("<div class='class3'>").prependTo("#div1")
            })
        })
    </script>
</body>
</html>
```

### 移除元素

- 移除所有子元素
  - empty()
- 移除元素（移除事件）
  - remove()
- 移除元素（不移除事件）
  - detach()

```html
<button id="test1">test1</button>
<button id="test2">test2</button>
<div class="class1" id="div1">
    <button id="btn1">btn1</button>
    <button id="btn2">btn2</button>
</div>
<script>
    $(function(){
        let $btn1 = $("#btn1")
        $("#btn1").click(function(){
            console.log("test")
        })

        $("#test1").click(function(){
            // $("#div1").empty()
            // $("#btn1").remove()
            $("#btn1").detach()
        })
        $("#test2").click(function(){
            $("#div1").append($btn1)
        })
    })
</script>
```

### 容器操作

- 删除外层容器
  - unwrap()
- 为当前元素添加容器
  - wrap()
- 为当前元素统一添加容器
  - wrapAll()
- 为当前元素添加内部容器
  - wrapInner()

```html
<button id="btn">btn</button>
<div class="class1" id="div1">
    <button id="btn1">btn1</button>
    <button id="btn2">btn2</button>
</div>
<script>
    $(function(){
        $("#btn").click(function(){
            $("#btn1").unwrap()
            // $("button").wrap("<div>")
            // $("button").wrapAll("<div>")
            // $("#btn1").wrapInner("<div>")
        })
    })
</script>
```

### 获取/设置内容

- 获取/设置文本内容
  - text()
- 获取/设置HTML代码
  - html()

```html
<div class="class1" id="div1">
    <button id="btn1">btn1</button>
    <button id="btn2">btn2</button>
</div>
<script>
    $(function(){
        $("#div1").click(function(){
            console.log($(this).text())
            console.log($(this).html())
        })
    })
</script>
```

### Class操作

- 添加一个或多个类
  - addClass()
- 移除一个或多个类
  - removeClass()

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
    <script src="https://cdn.staticfile.org/jquery/3.6.0/jquery.js"></script>
    <style>
        .class1 {
            height: 100px;
            width: 150px;
            background-color: hsl(211, 57%, 70%);
        }
        .class2 {
            border-radius: 15px;
        }
        .class3 {
            height: 200px;
            width: 300px;
            background-color: hsl(81, 82%, 53%);
        }
    </style>
</head>
<body>
    <button id="btn1">btn1</button>
    <button id="btn2">btn2</button>
    <div class="class1" id="div1">
    </div>
    <script>
        $(function(){
            $("#btn1").click(function(){
                $("#div1").addClass(["class2","class3"])
            })
            $("#btn2").click(function(){
                $("#div1").removeClass(["class1","class2"])
            })
        })
    </script>
</body>
</html>
```

### CSS样式操作

- 获取或修改样式
  - css()

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
    <script src="https://cdn.staticfile.org/jquery/3.6.0/jquery.js"></script>
    <style>
        .class1 {
            height: 100px;
            width: 150px;
            background-color: hsl(211, 57%, 70%);
        }
    </style>
</head>
<body>
    <button id="test">test</button>
    <div class="class1" id="div1">
    </div>
    <script>
        $(function(){
            $("#test").click(function(){
                console.log($("#div1").css("height"))
                $("#div1").css("background-color","hsl(81, 82%, 53%)")
                $("#div1").css({height:200,width:300})
            })
        })
    </script>
</body>
</html>
```

### 复制jQuery对象

- clone()

```html
<button id="btn">btn</button>
<div class="class1" id="div1">
    <button id="btn1">btn1</button>
    <button id="btn2">btn2</button>
</div>
<script>
    $(function(){
        $("#btn").click(function(){
            let $btn3 = $("#btn1").clone(true)
            $("#div1").append($btn3)
        })
    })
</script>
```
