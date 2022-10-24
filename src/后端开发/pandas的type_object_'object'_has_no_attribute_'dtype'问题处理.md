## **pandas的type object 'object' has no attribute 'dtype'问题处理**

### 问题记录

- 升级numpy后pandas报错

> AttributeError: type object 'object' has no attribute 'dtype'

### 解决过程

> pip install -U pandas

或指定dtype

> result = pandas.DataFrame(columns=df.columns, dtype=object)