## **Django的映射配置**

- 根据请求URL判断对应的处理程序，为URL和视图建立映射关系

### 路径转换

- int：匹配0或任何正整数
- str：匹配除'/'外的非空字符串

### 正则匹配

- 分为有命名和无命名模式，无命名模式获取参数时按顺序匹配

### 引用路径

- 引用其他的URL配置模式或文件

### 参数传递

- 可传递额外参数给视图函数
- include中的URLconf会收到父URLconf的参数（捕获的参数和传递的参数）

```python
from django.urls import path,re_path,include
from . import urldemo

extra_patterns = [
    path('include_test/', urldemo.include_test),
]

urlpatterns = [
    # 路径转换
    path('converter_test/<int:year>/', urldemo.converter_test1),
    path('converter_test/<str:name>/<int:year>/', urldemo.converter_test2),
    # 正则匹配
    re_path(r'^regular_test/(?P<year>[0-9]{4})/$', urldemo.regular_test),
    re_path(r'^unnamed_regular_test/([0-9]{4})/$', urldemo.unnamed_regular_test),
    # 引用路径
    path('include_test1/', include('kgdemo.urls')),
    path('include_test2/', include(extra_patterns)),
    # 参数传递
    path('args_test/<str:id>/', urldemo.args_test, {'name':'avatar'}),
]
from django.http import HttpResponse

def converter_test1(request,year):
    print(request.path)
    print(year)
    return HttpResponse("converter_test1")

def converter_test2(request,name,year):
    print(request.path)
    print(name,year)
    return HttpResponse("converter_test2")

def regular_test(request,year):
    print(request.path)
    print(year)
    return HttpResponse("regular_test")

def unnamed_regular_test(request,year):
    print(request.path)
    print(year)
    return HttpResponse("unnamed_regular_test")

def include_test(request):
    print(request.path)
    return HttpResponse("include_test")

def args_test(request,id,name):
    print(request.path)
    print(id,name)
    return HttpResponse("args_test")
```

### 反向解析

- 在映射配置文件中设置别名，在视图和模板中根据别名获取路径

- 普通路径

```python
from django.urls import path
from . import formviews

urlpatterns = [
    path('index/', formviews.index, name='index'),
    path('search/', formviews.post_search, name='search'),
]
from django import forms

class SearchForm(forms.Form):
    search_target = forms.CharField(label='搜索项', max_length=100)
<form action="{% url 'search' %}" method="post">
    {% csrf_token %}
    {{ form }}
    <input type="submit" value="搜索">
</form>
from django.shortcuts import render,redirect
from django.urls import reverse

from .forms import SearchForm

def index(request):
    if request.method == 'POST':
        form = SearchForm(request.POST)
    else:
        form = SearchForm()
    return render(request, 'forms.html', {'form': form})

def post_search(request):
    if request.method == 'POST':
        form = SearchForm(request.POST)
        if form.is_valid():
            print(form.cleaned_data.get('search_target'))
            return redirect(reverse('index'))
    else:
        form = SearchForm()
    return render(request, 'forms.html', {'form': form})
```

- 有命名正则路径

```python
from django.urls import re_path
from . import formviews

urlpatterns = [
    re_path(r'^index/(?P<info>[a-z\u4E00-\u9FA5]+)/$', formviews.index, name='index'),
    re_path(r'^operate/(?P<info>[a-z\u4E00-\u9FA5]+)/$', formviews.operate, name='operate'),
]
from django import forms

class SearchForm(forms.Form):
    search_target = forms.CharField(label='搜索项', max_length=100)
<form action="{% url 'operate' info='传递给operate路径的参数' %}" method="post">
    {% csrf_token %}
    {{ form }}
    <input type="submit" value="搜索">
</form>
from django.shortcuts import render,redirect
from django.urls import reverse

from .forms import SearchForm

def index(request,info):
    if request.method == 'POST':
        form = SearchForm(request.POST)
    else:
        form = SearchForm()
    print('index', info)
    return render(request, 'forms.html', {'form': form})

def operate(request,info):
    if request.method == 'POST':
        form = SearchForm(request.POST)
        if form.is_valid():
            print(form.cleaned_data.get('search_target'))
            print('operate', info)
            return redirect(reverse('index', kwargs={'info':'传递给index路径的参数'}))
    else:
        form = SearchForm()
    return render(request, 'forms.html', {'form': form})
```

- 无命名正则路径

```python
from django.urls import re_path
from . import formviews

urlpatterns = [
    re_path(r'^index/([a-z\u4E00-\u9FA5]+)/$', formviews.index, name='index'),
    re_path(r'^operate/([a-z\u4E00-\u9FA5]+)/$', formviews.operate, name='operate'),
]
from django import forms

class SearchForm(forms.Form):
    search_target = forms.CharField(label='搜索项', max_length=100)
<form action="{% url 'operate' '传递给operate路径的参数' %}" method="post">
    {% csrf_token %}
    {{ form }}
    <input type="submit" value="搜索">
</form>
from django.shortcuts import render,redirect
from django.urls import reverse

from .forms import SearchForm

def index(request,info):
    if request.method == 'POST':
        form = SearchForm(request.POST)
    else:
        form = SearchForm()
    print('index', info)
    return render(request, 'forms.html', {'form': form})

def operate(request,info):
    if request.method == 'POST':
        form = SearchForm(request.POST)
        if form.is_valid():
            print(form.cleaned_data.get('search_target'))
            print('operate', info)
            return redirect(reverse('index', args={'传递给index路径的参数'}))
    else:
        form = SearchForm()
    return render(request, 'forms.html', {'form': form})
```

### 命名空间

- 反向解析的别名没有作用域，若两个应用中的别名相同，解析该别名会得到同一个路径，通过命名空间解决
- 定义命名空间
  - include('app名称.urls', namespace='app名称')
  - app名称.urls中添加app_name = 'app名称'

```python
app_name = 'app名称'
urlpatterns = [
    path('index/', appviews.index, name='index'),
]
```

- 模板使用：{% url 'app名称:路径别名' %}
- 视图使用：reverse('app名称:路径别名')