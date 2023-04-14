## **MySQL空间函数的使用**

- ST_GeomFromText
  - 从WKT返回几何

- ST_Intersects
  - 判断几何是否相交

```mysql
select ST_Intersects(ST_GeomFromText('MULTIPOLYGON (((120.732568 32.016879, 120.761572 32.020452, 120.770756 32.020605, 120.732568 32.016879)))'),ST_GeomFromText('POINT(120.732568 32.016879)'))
```

- 根据坐标更新行政区划编码
```sql
update tmp t1
join nt_gis_info t2
on t1.xzqh is null
and t1.jd is not null and t1.wd is not null and t1.jd <> '' and t1.wd <> ''
and ST_Intersects(ST_GeomFromText(t2.Coordinate),ST_GeomFromText(concat('POINT(',t1.jd,' ',t1.wd,')'))) = 1
set t1.xzqh = t2.adcode
```

