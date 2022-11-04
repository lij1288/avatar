## **Python的文件操作**

```python
file_name = 'demo.txt'
file_obj = open(file_name)
print(file_obj) #<_io.TextIOWrapper name='demo.txt' mode='r' encoding='cp936'>
```

```python
# \或r防止字符转义
file_name = '..\\tdemo.txt'
file_name = r'..\tdemo.txt'
file_name = '../tdemo.txt'

file_name = r'C:\Users\lij12\Desktop\demo.txt'
```
