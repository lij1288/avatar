## **Django的模型使用**

### 创建应用

> python3 manage.py startapp ModelTest

### 编辑模型文件

- TestModel/models.py

```python
from django.db import models

class PRD_PD_INST(models.Model):
    PROD_INST_ID = models.CharField(max_length=30)
    ACCS_NBR = models.CharField(max_length=30,null=True)
```

### 添加到应用程序

- avatar/settings.py

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'ModelTest',
]
```

### 生成迁移文件

> python3 manage.py makemigrations ModelTest

```
Migrations for 'ModelTest':
  ModelTest\migrations\0001_initial.py
    - Create model PRD_PD_INST
```

- 通过makemigrations命令，Django检测对模型的修改，并生成迁移文件

```python
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PRD_PD_INST',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('PROD_INST_ID', models.CharField(max_length=30)),
            ],
        ),
    ]
```

- 查看迁移文件对应的SQL
  - 主键id会被自动创建

> python3 manage.py sqlmigrate ModelTest 0001

```
--
-- Create model PRD_PD_INST
--
CREATE TABLE `ModelTest_prd_pd_inst` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `PROD_INST_ID` varchar(30) NOT NULL);
```

### 应用数据库迁移

> python3 manage.py migrate ModelTest

```
Operations to perform:
Apply all migrations: ModelTest
Running migrations:
Applying ModelTest.0001_initial... OK
```

### 撤销迁移

- 通过上一次迁移的编号撤销迁移

> python3 manage.py migrate ModelTest 0001

```
Operations to perform:
  Target specific migration: 0001_initial, from ModelTest
Running migrations:
  Rendering model states... DONE
  Unapplying ModelTest.0002_prd_pd_inst_accs_nbr... OK
```

- 撤销一个应用的所有迁移

> python3 manage.py migrate ModelTest zero