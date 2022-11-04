## **Python的异常处理**

### 基本使用

```python
try:
    print(1/0)
except:
    print('Exception')
else:
    print('Success')
print('出现异常后')
```

### 对象

- except后不跟任何内容，则捕获到所有异常
- except后跟异常类型，则只捕获该类型异常
- except后跟Exception所有异常类的父类，则捕获所有异常
- 可以在异常类后跟as xx即异常对象

```python
try:
    print(a)
except ZeroDivisionError:
    print('ZeroDivisionError')
except Exception as e:
    print(e,type(e))
else:
    print('Success')
finally:
    print('无论是否出现异常都执行')
print('出现异常后')

#name 'a' is not defined <class 'NameError'>
#无论是否出现异常都执行
#出现异常后
```

### 抛出异常

- 继承Exception自定义异常
- raise用于抛出异常，后边跟异常类或异常类的实例

```python
class MyError(Exception):
    pass

def test(a):
    if a == 1:
        raise MyError('a=1')
    return a

#test(1)
#Traceback (most recent call last):
#  File "<pyshell#3>", line 1, in <module>
#    test(1)
#  File "D:\develop\Python\test.py", line 6, in test
#    raise MyError('a=1')
#MyError: a=1
```
