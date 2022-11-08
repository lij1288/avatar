## **HTML DOM的节点操作**

### 元素节点

- DOM
  - Document Object Model 文档对象模型
  - 一种与平台和语言无关的应用程序接口

- document对象
  - 表示整个网页

- 创建元素
  - document.createElement()

```html
<body>
    <div id="div1">
    </div>
    <script>
        let d = document.getElementById("div1")
        let s = document.createElement("span")
        s.textContent = "test"
        d.appendChild(s)
    </script>
</body>
```

- 根据id获取元素
  - document.getElementById()

- 根据class获取元素
  - document.getElementsByClassName()
- 根据tag获取元素
  - document.getElementsByTagName()
- 根据name获取元素
  - document.getElementsByName()
- 根据选择器获取第一个符合的元素
  - document.querySelector()
- 根据选择器获取全部符合的元素
  - document.querySelectorAll()

```html
<body>
    <div id="div1">
        <label>CTPHER:</label>
        <textarea rows="1" cols=47 id="cypher"></textarea>
        <input type="submit" value="提交" id="reload" class="class1" name="name1">
        <input type="submit" value="返回" id="initialize" class="class1" name="name2">
        <input type="submit" value="锁定" id="stabilize" class="class1" name="name3">
    </div>
    <div id="div2">
        <label>IDCARD1:</label>
        <input type="text" name="search_target" maxlength="100" required="" id="cardno1">
        <label>IDCARD2:</label>
        <input type="text" name="search_target" maxlength="100" required="" id="cardno2">
        <input type="submit" value="查询" id="reload1">
    </div>
    <script>
        console.log(document.getElementById("reload"))

        console.log(document.getElementsByClassName("class1"))

        console.log(document.getElementsByName("name1"))

        console.log(document.getElementsByTagName("input"))
        console.log(document.getElementsByTagName("*"))

        console.log(document.querySelectorAll(".class1"))
        console.log(document.querySelector("[name=name1]"))
        console.log(document.querySelector("input"))
        console.log(document.querySelectorAll("input"))
    </script>
</body>
```

- 获取元素的子节点
  - 包括空白子节点
  - element.childNodes
- 获取元素的子元素
  - element.children
- 获取元素的第一个子元素
  - element.firstElementChild
- 获取元素的最后一个子元素
  - element.lastElementChild
- 获取元素的下一个兄弟元素
  - element.nextElementSibling
- 获取元素的前一个兄弟元素
  - element.previousElementSibling
- 获取元素的父节点
  - element.parentNode
- 获取元素的标签名
  - element.tagName

```html
<body>
    <div id="div1">
        <label>CTPHER:</label>
        <textarea rows="1" cols=47 id="cypher"></textarea>
        <input type="submit" value="提交" id="reload" class="class1" name="name1">
        <input type="submit" value="返回" id="initialize" class="class1" name="name2">
        <input type="submit" value="锁定" id="stabilize" class="class1" name="name3">
    </div>
    <div id="div2">
        <label>IDCARD1:</label>
        <input type="text" name="search_target" maxlength="100" required="" id="cardno1">
        <label>IDCARD2:</label>
        <input type="text" name="search_target" maxlength="100" required="" id="cardno2">
        <input type="submit" value="查询" id="reload1">
    </div>
    <script>
        let e = document.getElementById("div1")
        console.log(e)

        console.log(e.childNodes)

        console.log(e.children)

        console.log(e.firstElementChild)

        console.log(e.lastElementChild)

        console.log(e.nextElementSibling)

        console.log(e.parentElement)

        console.log(e.tagName)
    </script>
</body>
```

### 文本节点

- 获取或修改元素的文本内容，获取内容不考虑CSS样式
  - e.textContent
- 获取或修改元素的文本内容，获取内容考虑CSS样式
  - e.innerText
- 获取或修改元素的HTML内容
  - e.innerHTML

```html
<body>
    <div id="div1">
        <span style="text-transform:uppercase" id='span1'>div1</span>
    </div>
    <script>
        let e = document.getElementById("span1")
        console.log(e.textContent) // div1
        console.log(e.innerText) // DIV1
        console.log(e.innerHTML) // div1

        e.textContent = "test1"
        console.log(e.textContent) // test1
        console.log(e.innerText) // TEST1

        e.innerText = "test2"
        console.log(e.textContent) // test2
        console.log(e.innerText) //TEST2

        e.innerHTML = "<label style='text-transform:none'>test</label>"
        console.log(e.textContent) // test
        console.log(e.innerText) //test
        console.log(e.innerHTML) // <label style="text-transform:none">test</label>
    </script>
</body>
```

### 属性节点

- 直接操作属性
  - 元素.属性名

```html
<body>
    <div id="div1">
        <span style="text-transform:uppercase" id='span1' class = 'class1'>div1</span>
    </div>
    <script>
        let e = document.getElementById("span1")
        console.log(e.id)
        
        e.id = "test"
        console.log(e.id)

        console.log(e.className)
    </script>
</body>
```

- 通过方法操作属性
  - 获取属性
    - element.getAttribute()
  - 修改属性
    - element.setAttribute()
  - 删除属性
    - element.removeAttribute()

```html
<body>
    <div id="div1">
        <span style="text-transform:uppercase" id='span1' class = 'class1'>div1</span>
    </div>
    <script>
        let e = document.getElementById("span1")
        console.log(e.getAttribute("id"))
        
        e.setAttribute("id","test")
        console.log(e.getAttribute("id"))

        e.removeAttribute("id")
        console.log(e)
    </script>
</body>
```

事件绑定

- 直接在属性中设置

```html
<body>
    <input type="submit" value="提交" id="id1" onclick="alert('test')">
</body>
```

- 为指定属性设置回调函数
  - 只能绑定一个事件

```html
<body>
    <input type="submit" value="提交" id="id1">
    <script>
        let e = document.getElementById("id1")
        e.onclick = function(){
            alert("test")
        }
    </script>
</body>
```

- 通过方法绑定事件

```html
<body>
    <input type="submit" value="提交" id="id1">
    <script>
        let e = document.getElementById("id1")
        e.addEventListener("click",function(){
            alert("test1")
        })
        e.addEventListener("click",function(){
            alert("test2")
        })
    </script>
</body>
```
