## **Django的数据库操作**

- demo/urls.py

```python
from django.urls import path
from . import views,dboperate

urlpatterns = [
    path('', views.test),
    path('templatestest/', views.templatestest),
    path('dbinsert/', dboperate.insert),
    path('dbselect/', dboperate.select),
    path('dbupdate/', dboperate.update),
    path('dbdelete/', dboperate.delete),
]
```

- demo/dboperate.py

```python
from django.http import HttpResponse
from ModelTest.models import PRD_PD_INST
 
def insert(request):
    insert1 = PRD_PD_INST(PROD_INST_ID='00001')
    insert1.save()
    return HttpResponse("<p>Insert Completed</p>")

def select(request):
    # 获取全部
    list = PRD_PD_INST.objects.all()
        
    # 查询符合条件的数据
    # list = PRD_PD_INST.objects.filter(PROD_INST_ID='00001')

    # 查询只有一条的数据，若有多条会报错
    # list = PRD_PD_INST.objects.get(PROD_INST_ID='00001') 
    
    # 限制返回的数据，返回五条再跳过前两条
    # list = PRD_PD_INST.objects.order_by('id')[2:5]
    
    #数据排序
    # list = PRD_PD_INST.objects.order_by("PROD_INST_ID")
    
    response = ""
    tmp = ""
    for var in list:
        tmp += var.PROD_INST_ID + " "
    response = tmp
    return HttpResponse("<p>" + response + "</p>")

def update(request):
    # 更新符合条件的数据
    PRD_PD_INST.objects.filter(PROD_INST_ID='00001').update(PROD_INST_ID='00002')

    # 更新只有一条的数据，若有多条会报错
    # update1 = PRD_PD_INST.objects.get(PROD_INST_ID='00001')
    # update1.name = '00002'
    # update1.save()
    
    # 修改全部
    # PRD_PD_INST.objects.all().update(PROD_INST_ID='00002')
    return HttpResponse("<p>Update Completed</p>")

def delete(request):
    # 删除符合条件的数据
    PRD_PD_INST.objects.filter(PROD_INST_ID='00001').delete()

    # 删除只有一条的数据，若有多条会报错
    # delete1 = PRD_PD_INST.objects.get(PROD_INST_ID='00001')
    # delete1.delete()
    
    # 删除全部
    # PRD_PD_INST.objects.all().delete()
    return HttpResponse("<p>Delete Completed</p>")
```