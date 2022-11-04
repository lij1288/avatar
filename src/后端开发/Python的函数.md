## **Python的函数**

### 基本使用

- fn是函数对象，fn()是调用函数

```python
def fn(a,b):
	print(a,'+',b,'=',a + b)

print(fn,type(fn)) #<function fn at 0x03EF6F10> <class 'function'>

fn(1,2) #1 + 2 = 3
```

### 参数

#### 参数默认值

```python
def fn(a = 1,b = 2):
	print(a,'+',b,'=',a + b)

fn(10) #10 + 2 = 12
fn() #1 + 2 = 3
```

#### 参数传递

- 位置参数
- 关键字参数

```python
def fn(a,b,c):
	print(a,b,c)

fn(1,2,3) #1 2 3
fn(c = 3,a = 1,b = 2) #1 2 3

fn(1,c = 3,b = 2) #1 2 3
```

#### 实参类型

- 函数在调用时，解析器不会检查实参的类型
- 实参可以传递任意类型的对象

#### 不定长参数

```python
def sum(*nums):
    result = 0
    for n in nums:
        result += n
    print(result)
```

- 带*号的形参可以接收多个实参并保存到一个元组中

  - *形参只能有一个
  - *形参后的所有参数必须以关键字参数的形式传递

  - *后的所有参数必须以关键字参数的形式传递
  - *形参只能接收位置参数，不能接收关键字参数

```python
def fn(a,*b,c):
    print(a)
    print(b)
    print(c)

fn(1,2,3,4,c = 5)
#1
#(2, 3, 4)
#5
```

```python
def fn(a,*,b,c):
    print(a)
    print(b)
    print(c)

fn(1,b = 2,c = 3)
```

#### 参数拆包

- 传递实参时，在序列类型的参数前添加星号，会自动给将序列中的元素作为参数传递，个数必须一致
- 通过两个星号对字典进行拆包

```python
def fn(a,b,c):
    print(a)
    print(b)
    print(c)

t = (1,2,3)
fn(*t)

d = {'a':1,'b':2,'c':3}
fn(**d)
```

### 返回值

- 可以通过return指定返回值
  - 只写return或不写return相当于return None
  - return一旦执行函数自动结束

### 文档字符串

- 通过help(函数对象)查看函数的使用说明
- 在定义函数时，可在函数内部编写文档字符串，作为使用说明

```python
def fn():
    "文档字符串示例"
    
def fn():
    '''
    文档字符串示例
    函数作用
    参数说明
    '''
```

### 作用域

- 全局作用域

  - 全局作用域在程序执行时创建，在程序执行结束时销毁
  - 所有函数外的区域都是全局作用域
  - 在全局作用域中定义的变量都属于全局变量，全局变量可以在程序的任意位置被访问

- 函数作用域

  - 函数作用域在函数调用时创建，在调用结束时销毁
  - 函数每调用一次就会产生一个新的函数作用域
  - 在函数作用域中定义的变量，都是局部变量，只能在函数内部被访问

- 变量的查找

  - 使用变量时，会优先在当前作用域中寻找该变量，如果有则使用
  - 如果没有则继续取上一级作用域中寻找，以此类推
  - 直到找到全局作用域，仍未找到则抛出异常NameError

- 在函数中为变量赋值时，默认为局部变量赋值

  在函数内部修改全局变量，需使用global关键字声明变量

```python
a = 1
def fn():
    a = 7
    print('函数内部:','a=',a) #7

fn()
print('函数外部:','a=',a) #1
```

```python
a = 1
def fn():
    global a
    a = 7
    print('函数内部:','a=',a) #7

fn()
print('函数外部:','a=',a) #7
```

### 命名空间

- 命名空间指变量的存储位置
- 每一个作用域都有一个对应的命名空间
- 全局命名空间保存全局变量，函数命名空间保存函数中的变量
- 命名空间实际上是一个用来存储变量的字典
- locals()获取当前作用域的命名空间
- globals()在任意位置获取全局命名空间

```python
print(locals())
print(type(locals())) #<class 'dict'>
```

### 高阶函数

#### 基本概念

- 接收函数作为参数，或将函数作为返回值的函数是高阶函数
- 使用一个函数作为参数时，实际上是将指定的代码传递给目标函数

```python
def iseven(i):
    if i % 2 == 0:
        return True
    return False

def fn(func,lst):
    '将指定列表偶数取出保存到新列表返回'
    new_list = []
    for n in lst:
        if func(n):
            new_list.append(n)
    return new_list

print(fn(iseven,[1,2,3,4,5,6])) #[2, 4, 6]
```

#### filter

- 从序列中过滤符合条件的元素，保存到新序列
- 参数：
  1. 函数，根据该函数过来序列
  2. 需要过滤的序列
- 返回值：
  1. 过滤后的新序列

```python
def iseven(i):
    return i % 2 == 0

r = filter(iseven,[1,2,3,4,5,6])
print(list(r)) #[2, 4, 6]
```

- 匿名函数lambda表达式
  - 语法：lambda 参数列表 : 返回值

```python
r = filter(lambda i : i > 3, [1,2,3,4,5,6])
print(list(r)) #[4, 5, 6]
```

#### map

- 对迭代对象中的所有元素做指定操作，然后添加到新对象中返回

```python
r = map(lambda i : i ** 2,[1,2,3,4,5,6])
print(list(r)) #[1, 4, 9, 16, 25, 36]
```

#### sort和sorted

- sort对列表中元素排序，默认直接比较列表中元素大小，可以接收一个关键字参数key，每次以列表中一个元素为参数调用函数，比较函数的返回值
- sorted可以对任意可迭代对象排序，并且不影响原来的对象，而是返回一个新对象

```python
l = ['aaa','b','cc']

l.sort()
print(l) #['aaa', 'b', 'cc']

l.sort(key = len,reverse = True)
print(l) #['aaa', 'cc', 'b']
```

```python
l = '1753721288'

print(l) #1753721288
print('排序前：',l) #排序前： 1753721288

print(sorted(l,key = int)) #['1', '1', '2', '2', '3', '5', '7', '7', '8', '8']

print('排序后：',l) #排序后： 1753721288
```

### 闭包

- 将函数作为返回值返回也是一种高阶函数，称为闭包
- 通过闭包可以创建一些只有当前函数能访问的变量，可以将私有数据藏到闭包中

```python
def fn():
    a = 1
    def inner():
        print('inner','a=',a)
    return inner

r = fn() #inner a= 1
#r是调用fn()后返回的函数，总是能访问到fn()函数内的变量
```

- 形成闭包的条件
  1. 函数嵌套
  2. 将内部函数作为返回值返回
  3. 内部函数必须使用到外部函数的变量

```python
def make_averager():
    nums = []
    def averager(n):
        nums.append(n)
        return sum(nums)/len(nums)
    return averager

averager = make_averager()

print(averager(1)) #1.0
print(averager(2)) #1.5
```

### 装饰器

- 通过装饰器可以在不修改原来函数的情况下对函数进行扩展
- 在定义函数时可以通过@装饰器来使用指定的装饰器，多个装饰器按照从内向外的顺序被装饰

```python
def add(a,b):
    return a + b

def begin_finish(old):
    def func(*args,**kwargs):
        print('begin.....')
        result = old(*args,**kwargs)
        print('finish.....')
        return result
    return func

def start_end(old):
    def func(*args,**kwargs):
        print('start.....')
        result = old(*args,**kwargs)
        print('end.....')
        return result
    return func

f = begin_finish(add)
print(f(1,2))
#begin.....
#finish.....
#3


@start_end
@begin_finish
def mul(a,b):
    return a * b

print(mul(2,3))
#start.....
#begin.....
#finish.....
#end.....
#6
```
