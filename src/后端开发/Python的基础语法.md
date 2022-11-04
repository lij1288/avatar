## **Python的基础语法**

### 基本使用

```python
print(123)

print('abc')

x = 1
print(x)

print('a\
b')
```

### 变量

- 使用变量不需要声明，直接为变量赋值即可
- 不能使用没有进行赋值的变量
- Python是一个动态类型的语言，可以为变量赋任意类型的值，也可以任意修改变量的值

```python
x = 1
x = 'a'
```

### 标识符

- 所有可以自主命名的内容都属于标识符
- 标识符可以含有字母、数字、_，但不能使用数字开头
- 标识符不能是关键字和保留字

```python
v_serial_no
```

### 数据类型

#### 数值

- 数值分为：整数、浮点数、复数

- 所有整数都是int类型
- 整数大小没有限制，可以是无限大整数
- 如果长度过大，可以使用下划线分隔

```python
a = 123_456_789
```

- 十进制数字不能以0开头
- 其他进制整数，打印时以十进制显示

```python
print(0b10) #2
```

- 所有浮点数都是float类型
- 浮点数运算可能有误差

```python
print(0.1+0.2) #0.30000000000000004
```

#### 字符串

- 相同引号之间不能嵌套
- 单引号和双引号不能跨行使用
- 三重引号可以换行，并会保留字符串中的格式

```python
print('a:"123"')

print('''a\
b
c''')
#ab
#c
```

- 字符串之间可以进行加法运算，字符串不能和其他类型进行加法运算

```python
print('a=' + a) #a=123

print('a=',a) #a= 123
```

- 可以在字符串中指定占位符
  - %s 任意字符
  - %f 浮点数占位符
  - %d 整数占位符

```python
print('hello %s '%'a') #hello a

print('hello %s and %s'%('a','b')) #hello a and b

# $3.5s---字符串长度限制为3-5
print('hello %3.5s'%'abcdefg') #hello abcde
print('hello %3.5s'%'a') #hello   a

print('hello %s'%123.456) #hello 123.456

print('hello %.2f'%123.456) #hello 123.46

print('hello %d'%123.456) #hello 123

print('a = %s'%a) #a = 123
```

- 格式化字符串中可以直接嵌入变量

```python
print(f'a = {a}') #a = 123
```

- 输出方式

```python
print('hello '+a+' !')

print('hello',a,'!')

print('hello %s !'%a)

print(f'hello {a} !')
```

- 字符串复制

```python
a = 'abc' * 5
```

#### 布尔值

- 布尔值实际上属于整形，True为1，False为0

```python
print(True) #True
print(False) #False
print(True + 1) #2
```

#### 空值

```python
print(None) #None
```

#### 类型检查

- type()用来检查值或变量类型，将检查结果作为返回值返回，可以通过变量接收

```python
print(type(1)) #<class 'int'>
print(type(0.1)) #<class 'float'>
print(type(True)) #<class 'bool'>
print(type('abc')) #<class 'str'>
print(type(None)) #<class 'NoneType'>
print(type(type(1))) #<class 'type'>
```

#### 类型转换

- 类型转换函数：int()、float()、str()、bool()
- 根据当前对象值返回新对象，不改变对象本身类型
- int()

```python
print(int(True)) #1

print(int(123.456)) #123

print(int('123')) #123

#print(int('123.456')) # ValueError
```

- float()

```python
print(float(True)) #1.0

print(float(123)) #123.0

print(float('123.456')) #123.456
```

- bool()
  - 任何对象都可以转换成布尔值，表示空的对象转换成False(0、None、‘‘)，其他转换成True

```python
print(bool(0)) #False

print(bool(0.0)) #False

print(bool('')) #False

print(bool(' '))  #True
```

- str()

```python
print(str(123)) #123

print(str(123.456)) #123.456

print(str('True')) #True
```

### 运算符

#### 算数运算符

- \+ / - 加/减

```python
print(1 + 1) #2
print('hello' + 'world') #helloworld
print(2 - True) #1
```

- \* 乘，字符串和数字相乘复制指定次数

```python
print(2 * 3) #6
print('a' * 3) #aaa
```

- / 除，返回一个浮点类型

```python
print(6 / 2) #3.0
```

- // 整除，保留整数位

```python
print(3 // 2) #1
```

- ** 幂

```python
print(2 ** 2) #4
print(4 ** 0.5) #2.0
print(2 ** 2.0) #4.0
print(2.0 ** 2) #4.0
```

- % 取模

```python
print(3 % 2) #1
print(3 % 2.0) #1.0
```

#### 赋值运算符

- =、+=、-=、*=、**=、/=、//=、%=

#### 关系运算符

- 返回布尔值

- \>、>=、<、<=、==、!=，比较对象的值
- is、is not，比较对象的id

```python
print(1 == True) #True
print(1 is True) #False
print(1 is not True) #True
print(id(1),id(True)) #1444607920 1444483392
```

- 对字符串比较时，是逐位比较Unicode编码

```python
print('2' > '1') #True
print('2' > '11') #True
```

#### 逻辑运算符

- not
  - 对非布尔值，非运算会先将其转为布尔值，再取反

```python
print(not True) #False
print(not 1) #False
print(not '') #True
```

- and
  - 为短路与运算，第一个值为False，不再看第二个值

```python
True and print('helloworld') #helloworld
False and print('helloworld') #False
```

- or
  - 为短路或运算，第一个值为True，不再看第二个值

- 非布尔值的与或运算

  - 非布尔值的与或运算，Python会将其当作布尔值运算，返回原值
  - 与运算，如果第一个值是False，则直接返回第一个值，否则返回第二个值

  - 或运算，如果第一个值是True，则直接返回第一个值，否则返回第二个值

```python
print(1 and 2) #2
print(1 and 0) #0
print(0 and None) #0
```

#### 条件运算符

```python
a = 3
b = 5
print('a') if a > b else print('b')

max = a if a > b else b
print(max)
```

### 流程控制语句

#### 条件判断语句

- if

  - 默认情况下，if值控制紧随其后的语句

  - if控制多条语句，需使用代码块，代码块以缩进开始，直到代码恢复之前缩进级别时结束

```python
if True : print('helloworld')

if False :
    print(1)
    print(3)
print(5)
# 5
```

- if else

```python
if False :
    print(1)
else :
    print(3)
# 3
```

- if elif else

```python
if False :
    print(1)
elif True :
    print(3)
else :
    print(5)
# 3
```

#### 循环语句

- while

```python
i = 0
while i < 3 :
    i += 1
    print(i)
else :
    print('end')
```

- for

```python
for letter in 'abc' :
    print(letter)
```

#### 中断流程控制语句

##### break

- 退出循环，包括else

##### continue

- 跳过当次循环

##### pass

- 用于在判断或循环语句中占位

```python
if True :
    pass
```
