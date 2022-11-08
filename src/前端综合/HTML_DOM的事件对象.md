## **HTML DOM的事件对象**

- 事件对象是浏览器在事件触发时所创建的对象，通过事件对象可以获取到事件的详细信息
- 浏览器在创建事件对象后，会将事件对象作为回调函数的参数传递

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
    </style>
</head>
<body>
    <div class="class1" id="div1"></div>
    <script>
        let d1 = document.getElementById("div1")
        d1.addEventListener("mousemove",event=>{
            console.log(event)
            d1.textContent = event.clientX + "," + event.clientY
        })
    </script>
</body>
</html>
```

### 事件的冒泡

- 当元素上的某个事件触发后，其祖先元素上的相同事件会同时触发
- 可通过事件对象停止事件的传导

### 事件的属性和方法

- 触发事件的对象
  - event.target
- 绑定事件的对象
  - 同this
  - event.currentTarget
- 停止事件的传导
  - event.stopPropagation()

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
    <style>
        #div1 {
            width: 200px;
            height: 150px;
            background-color: rgb(216, 255, 214);
        }
        #div2 {
            width: 160px;
            height: 120px;
            background-color: rgb(209, 246, 255);
        }
        #div3 {
            width: 120px;
            height: 90px;
            background-color: rgb(229, 191, 255);
        }
    </style>
</head>
<body>
    <div id="div1">
        <div id="div2">
            <div id="div3">
            </div>
        </div>
    </div>
    <script>
        let d1 = document.getElementById("div1")
        let d2 = document.getElementById("div2")
        let d3 = document.getElementById("div3")
        
        // click d3
        d1.addEventListener("click",function(event){
            console.log(event)
            console.log(event.target) // div3
            console.log(this) // div1
            console.log(event.currentTarget) // div1
        })
        // d1.addEventListener("click",event=>{
        //     console.log(event)
        //     console.log(event.target) // div3
        //     console.log(event.currentTarget) // div1
        // })

        d2.addEventListener("click",function(event){
            event.stopPropagation()
        })

        // d3.addEventListener("click",function(event){
        //     event.stopPropagation()
        // })
    </script>
</body>
</html>
```

- 取消默认行为
  - event.preventDefault()

```html
<body>
    <a id="test" href="https://www.baidu.com">test</a>
    <script>
        let test = document.getElementById("test")
        test.addEventListener("click",event=>{
            event.preventDefault()
            alert("test")
        })
    </script>
</body>
```

### 事件的委派

- 通过事件的传递批量绑定事件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
    <style>
        div {
            width: 100px;
            height: 50px;
        }
        #div1 {
            background-color: rgb(216, 255, 214);
        }
        #div2 {
            background-color: rgb(209, 246, 255);
        }
        #div3 {
            background-color: rgb(229, 191, 255);
        }
    </style>
</head>
<body>
    <div class="class1" id="div1">DIV1</div>
    <div class="class1" id="div2">DIV2</div>
    <div class="class2" id="div3">DIV3</div>
    <script>
        let class1 = document.getElementsByClassName("class1")
        document.addEventListener("click",event=>{
            if([...class1].includes(event.target)){
                console.log(event.target.textContent)
            }
        })
    </script>
</body>
</html>
```
