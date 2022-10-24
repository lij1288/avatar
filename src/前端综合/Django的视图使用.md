## **Django的视图使用**

- 视图函数接收Web请求并返回Web响应

### HttpRequest对象

- GET
  - QueryDict，包含HTTP GET的所有参数
  - get()：返回字符串，若该键对应多个值，返回最后一个

- POST
  - QueryDict，包含HTTP POST的所有参数
  - get()：返回字符串，若该键对应多个值，返回最后一个

- body
  - 二进制字节流，请求体，用于POST

- path
  - 字符串，获取URL中的路径部分

- method
  - 字符串，获取当前请求的方式，结果为大写

### HttpResponse对象

- HttpResponse()
  - 返回文本
  - 参数为字符串，可通过参数中的html标签进行渲染
  - from django.http import HttpResponse

```py
return HttpResponse('提交成功')
```

- render()
  - 返回文本
  - 第一个参数：request
  - 第二个参数：字符串，页面名称
  - 第三个参数：字典，可选参数
  - from django.shortcuts import render,redirect

```python
return render(request, 'index.html', ctx)
```

- redirect()
  - 重定向，跳转到新页面
  - 参数为字符串，页面路径
  - from django.shortcuts import redirect

```python
return redirect('/index/')
```