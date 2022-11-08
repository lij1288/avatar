## **HTML DOM的文档加载**

网页是自上向下加载的，如果JS代码执行时，网页还没有加载完毕，则无法获取到DOM对象

- 将script标签编写在body的最后

- 将代码编写在window.onload的回调函数中
  - window的load事件在窗口中的内容加载完毕后触发（嵌套网页加载后）

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
    <script>
        window.onload = function(){
            console.log(document.getElementById("span1"))
        }
    </script>
</head>
<body>
    <div id="div1">
        <span style="text-transform:uppercase" id='span1' class = 'class1'>div1</span>
    </div>
</body>
</html>
```

- 将代码编写在document对象的DOMContentLoaded的回调函数中
  - document的DOMContentLoaded事件在当前文档加载完毕后触发（嵌套网页加载前）

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
    <script>
        document.addEventListener("DOMContentLoaded",function(){
            console.log(document.getElementById("span1"))
        })
    </script>
</head>
<body>
    <div id="div1">
        <span style="text-transform:uppercase" id='span1' class = 'class1'>div1</span>
    </div>
</body>
</html>
```

- 以defer形式引入外部JS文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
    <script defer src="./test.js"></script>
</head>
<body>
    <div id="div1">
        <span style="text-transform:uppercase" id='span1' class = 'class1'>div1</span>
    </div>
</body>
</html>
```
