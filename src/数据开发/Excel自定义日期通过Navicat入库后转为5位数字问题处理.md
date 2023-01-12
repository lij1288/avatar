## **Excel自定义日期通过Navicat入库后转为5位数字问题处理**

### 问题记录

- Excel中的自定义类型日期在通过Navicat入库时，会转为常规类型的5位数字

![](assets/Excel自定义日期通过Navicat入库后转为5位数字问题处理/Excel自定义日期入库问题记录.jpg)



### 解决过程

```sql
select date_add('1899-12-30', interval 44631 day)
```