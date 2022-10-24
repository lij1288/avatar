## **Django的应用创建**

### 创建应用

> python3 manage.py startapp demo

### 创建视图

- demo/views.py

```python
# from django.shortcuts import render
from django.http import HttpResponse

def test(request):
    return HttpResponse("Test App")
```

### 映射配置

- demo/urls.py

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.test),
]
```

- avatar/urls.py

```python
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('apptest/', include('demo.urls')),
]
```

- path()的参数
  - 必须参数
    - route：URL
    - view：视图函数
  - 可选参数
    - kwargs：传递给视图函数的字典类型参数
    - name：引用URL时的名称

### 访问应用

- 127.0.0.1:8000/demo