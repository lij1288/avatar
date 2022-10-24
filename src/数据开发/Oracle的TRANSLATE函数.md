## **Oracle的TRANSLATE函数**

### translate(str,from,to)

- 将str的在from中的字符一一对应替换为to中的字符

```sql
select translate('a1b2c3','123','456') from dual -- a4b5c6
```

- 若from长度大于to，from中多出的字符被删除

```sql
select translate('a1b2c3','123','45') from dual -- a4b5c
```

- 若from长度小于to，一一对应替换from中有的字符

```sql
select translate('a1b2c3','12','456') from dual -- a4b5c3
```

- 三个参数中任意一个为null或''，则结果为null

```sql
select translate(null,'123','456') from dual  -- null
select translate('','123','456') from dual  -- null
select translate('a1b2c3',null,'456') from dual -- null
select translate('a1b2c3','','456') from dual -- null
select translate('a1b2c3','123',null) from dual -- null
select translate('a1b2c3','123','') from dual -- null
```

### 判断字段是否为数值

```sql
-- 方法一
select /*+parallel(t,8)+*/count(1) from DMID.BWT_DIM_PO_RFR_D_V partition(p20201215) t
where rfr_code = '100010002' and trim(translate(rfr_value,'0123456789',' ')) is null

-- 方法二
select /*+parallel(t,8)+*/count(1) from DMID.BWT_DIM_PO_RFR_D_V partition(p20201215) t
where rfr_code = '100010002' and regexp_like(rfr_value,'^[0-9]*$')
```