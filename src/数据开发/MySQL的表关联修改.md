## **MySQL的表关联修改**

- 表关联删除

```sql
delete t1
from tmp t1
join rel_water_object_code t2
on trim(t1.stnm) = t2.stnm and trim(t1.type) = t2.type
```

- 表关联更新

```sql
update tmp t1
join nt_gis_info t2
on t1.xzqh is null
and t1.jd is not null and t1.wd is not null and t1.jd <> '' and t1.wd <> ''
and ST_Intersects(ST_GeomFromText(t2.Coordinate),ST_GeomFromText(concat('POINT(',t1.jd,' ',t1.wd,')'))) = 1
set t1.xzqh = t2.adcode
```

