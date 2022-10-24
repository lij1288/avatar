## **Django的模板创建**

### 创建模板目录

- 项目根目录下创建templates

### 创建模板

- templates/demo.html

```html
<h1>{{var}}</h1>
```

### 设置模板文件路径

- avatar/settings.py
  - 设置DIRS

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [Path(BASE_DIR,'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

### 创建视图

- 模板语法
  - html：{{html变量名}}
  - view：{'html变量名':'view变量名'}

- demo/views.py

```python
from django.shortcuts import render

def templatestest(request):
    context = {}
    context['var'] = 'Test template'
    return render(request, 'demo.html', context)

# def test(request):
#   views_var = 'Test template'
#   return render(request, 'demo.html', {'var':views_var})
```

- 列表

```python
def test(request):
  views_list = ['var1', 'var2', 'var3']
  return render(request, 'demo.html', {'var':views_list})
<h1>{{var}}</h1>
<h1>{{var.0}}</h1>
```

> ['var1', 'var2', 'var3']
>
> var1

- 字典

```python
def test(request):
  views_dict = {'key1':'var1', 'key2':'var2'}
  return render(request, 'demo.html', {'var':views_dict})
<h1>{{var}}</h1>
<h1>{{var.key1}}</h1>
```

> {'key1': 'var1', 'key2': 'var2'}
>
> var1



### 映射配置

- demo/urls.py

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.test),
    path('templatestest', views.templatestest),
]
```

### 访问应用

- 10.0.43.108:8000/templatetest

### 模板的继承

- templates/base.html

```html
<h1>Template Inheritance</h1>
{% block content %}
父模板内容
{% endblock %}
```

- templates/demo.html

```html
{%extends "base.html" %}
{% block content %}
子模板内容
{% endblock %}
```