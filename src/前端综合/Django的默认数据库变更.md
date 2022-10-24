## **Django默认数据库变更**

### 创建数据库

```sql
create database djangodb;
```

### 修改配置文件

- avatar/settings.py

```python
DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': BASE_DIR / 'db.sqlite3',
    # }
    'default': 
    { 
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'djangodb',
        'HOST': '127.0.0.1',
        'PORT': 3306,
        'USER': 'root',
        'PASSWORD': '******',
    }  
}
```

### 指定MySQL引擎

- avatar/\__init__.py

```python
import pymysql
pymysql.install_as_MySQLdb()
```

### 进行数据库迁移

> python3 manage.py migrate