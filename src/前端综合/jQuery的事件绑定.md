## **jQuery的事件绑定**

- 绑定事件
  - on()
- 绑定一次性事件
  - one()
- 取消绑定
  - off()
- 取消默认行为和事件传递
  - return flase

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
    <div id="div1" class='class1'>
        <button id="btn1">btn1</button>
        <button id="btn2">btn2</button>
        <button id="btn3">btn3</button>
    </div>
    <script>
        $(function(){
            $("#div1").click(function(){
                console.log("div")
            })
            $("#btn2").on("click.a",function(){
                console.log("test1")
                return false
            })
            $("#btn2").on("click.b",function(){
                console.log("test2")
                return false
            })
            $("#btn3").on("click",function(){
                $("#btn2").off("click.b")
            })
            $("#test").one("click",function(){
                console.log("test")
            })
        })
    </script>
</body>
</html>
```
