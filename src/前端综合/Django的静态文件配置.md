## **Django的静态文件配置**

- 项目根目录下创建statics
- 创建目录
  - css
  - js
  - images
  - plugins

- avatar/settings.py

```python
# STATIC_URL = 'static/'
STATIC_URL = '/static/'
STATICFILES_DIRS = [ 
    Path(BASE_DIR, "statics"), 
]
```

- 引用静态文件
  - 使用别名static进行引用

```html
<img src="/static/images/test.jpg" alt="test">
{% load static %}
<img src="{% static 'images/test.jpg' %}" alt="test">
```
