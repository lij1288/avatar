## **Django的表单使用**

### 创建表单类

- dmeo/forms.py

```python
from django import forms

class SearchForm(forms.Form):
    search_target = forms.CharField(label='搜索项', max_length=100)
```

### 创建视图

- dmeo/formviews.py

```python
from django.http import HttpResponse
from django.shortcuts import render,redirect

from .forms import SearchForm

def post_search(request):
    if request.method == 'POST':
        form = SearchForm(request.POST)

        if form.is_valid():
            return HttpResponse('搜索的内容为: ' + form.cleaned_data.get('search_target'))
            # return HttpResponse(form.cleaned_data.get('search_target'))
    else:
        form = SearchForm()

    return render(request, 'forms.html', {'form': form})
```

### 创建模板

- templates/forms.html
  - POST方式提交表单必须要csrf标签（跨站请求伪造保护）
  - 表单渲染选项
    - {{ form.as_table }} will render them as table cells wrapped in <tr> tags
    - {{ form.as_p }} will render them wrapped in <p> tags
    - {{ form.as_ul }} will render them wrapped in <li> tags

```html
<form action="/demo/search/" method="post">
    {% csrf_token %}
    {{ form }}
    <input type="submit" value="搜索">
</form>
```

- Django渲染的表单

```html
<form action="/demo/search/" method="post">
    <input type="hidden" name="csrfmiddlewaretoken" value="CJRbcjxLa71zKlHXGsRlBmHSlufHFd7llv7cdOOzPJ584dk5jkbqUmwBYjOHDQKs">
    <label for="id_search_target">搜索项:</label>
    <input type="text" name="search_target" maxlength="100" required="" id="id_search_target">
    <input type="submit" value="搜索">
</form>
```

### 映射配置

- demo/uls.py

```python
from django.urls import path
from . import views,dboperate,formviews

urlpatterns = [
    path('', views.test),
    path('templatestest/', views.templatestest),
    path('dbinsert/', dboperate.insert),
    path('dbselect/', dboperate.select),
    path('dbupdate/', dboperate.update),
    path('dbdelete/', dboperate.delete),
    path('search/', formviews.post_search),
]
```