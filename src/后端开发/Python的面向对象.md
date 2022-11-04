## **Python的面向对象**

### 基本使用

- 类的定义

```python
class MyClass():
    pass

print(MyClass,type(MyClass)) #<class '__main__.MyClass'> <class 'type'>
```

- 创建实例

```python
mc = MyClass()
print(mc,type(mc)) #<__main__.MyClass object at 0x04109AF0> <class '__main__.MyClass'>

print(isinstance(mc,MyClass)) #True
```

- 添加属性

```python
mc.field = 'A'
print(mc.field) #A
```

### 特殊方法

- 方法每次被调用时，解析器都会自动传递第一个实参
  - 第一个参数是调用方法的对象本身，一般命名为self

```python
class MyClass:
    field = 'default'
    def func(self):
        print('hello %s' %self.field)
        
mc1 = MyClass()

mc1.func() #hello default

mc1.field = 'a'
mc1.func() #hello a
```

- 特殊方法以\_\_开头，\__结尾

  - 一般在特殊情况下自动执行

  - 创建对象的流程，mc = MyClass()运行流程

    1. 创建一个变量
    2. 在内存中创建一个新对象
    3. \_\_init__（self)方法执行
    4. 将对象的id赋值给变量

  - init汇总对象创建后立刻执行，可以用于向新创建的对象中初始化属性

    调用类创建对象时，类后边的所有参数都会依次传递到init()中

```python
class MyClass:
    
    def __init__(self,field):
        self.field = field
        
    def func(self):
        print('hello %s' %self.field)
        
mc = MyClass('A')
print(mc.field) #A
mc.func() #hello A
```

### 封装

- 可以为对象的属性使用双下划线开头，作为隐藏属性，只能在类的内部访问，无法通过对象访问
  - 实际是Python自动将属性改名为\_类名__属性名，仍可访问

```python
class MyClass:
    
    def __init__(self,field):
        self.__field = field

    def set_field(self,field):
        self.__field1 = field

    def get_field(self):
        return self.__field
    

mc = MyClass('A')
print(mc.field) #AttributeError
print(mc.__field) #AttributeError

print(mc._MyClass__field) #A
mc._MyClass__field = 'B'
print(mc.get_field()) #B
```

- 一般将私有属性以_开头

```python
class MyClass:
    
    def __init__(self,field):
        self._field = field

    def set_field(self,field):
        self._field1 = field

    def get_field(self):
        return self._field
```

- get()的装饰器：property，用来将一个get方法，转换成对象的属性，可以像调用属性一样使用get方法
- set()的装饰器：属性名.setter
- setter装饰器必须在property后面

```python
class MyClass:
    
    def __init__(self,field):
        self._field = field
        
    @property
    def field(self):
        return self._field
    
    @field.setter
    def field(self,field):
        self._field = field
        
mc = MyClass('A')
print(mc.field) #A
mc.field = 'B'
print(mc.field) #B
```

### 继承

- 在定义类时，可以在类名后的括号中指定当前类的父类，继承父类的属性和方法

- 如果省略了父类，则默认父类为object
- issubclass() 检查一个类是否是另一个类的子类
- 特殊方法也可以被重写，可以调用父类的\_\_init__方法来初始化父类中定义的属性
- 可以在类名后的括号添加多个类来实现多重继承，同名方法会先在第一个父类中寻找，前面父类的方法会覆盖后面父类的方法

```python
class SuperClass:
    
    def __init__(self,field1):
        self._field1 = field1

    @property
    def field1(self):
        return self._field1

    @field1.setter
    def field1(self,name):
        self._name = name
        
    def super_func1(self):
        print('super_func1')
        
    def super_func2(self):
        print('super_func2')


        
class SubClass(SuperClass):

    def __init__(self,field1,field2):
        super().__init__(field1)
        self._field2 = field2

    @property
    def field2(self):
        return self._field2

    @field2.setter
    def field2(self,field2):
        self._field2 = field2
        
    def super_func2(self):
        print('overwrite')

        
        
print(issubclass(SubClass,SuperClass)) #True
print(issubclass(SubClass,object)) #True

sub = SubClass('field1','field2')
sub.super_func1() #super_func1
sub.super_func2() #overwrite
```

### 多态

### 属性和方法

#### 类属性

- 直接在类中定义的属性是类属性
- 类属性可以通过类或类的实例访问到
- 类属性只能通过类对象来修改，无法通过实例对象修改

#### 实例属性

- 通过实例对象添加的属性是实例属性
- 实例属性只能通过实例对象来访问和修改，类对象无法访问修改

#### 实例方法

- 在类中定义，以self为第一个参数的方法是实例方法
- 实例方法在调用是，Python会将调用对象作为self传入
- 实例方法可以通过实例和类调用
  - 通过实例调用时，会自动将当前滴哦用对象作为self传入
  - 通过类调用时，不会自动传递self，必须手动传递self
- a.instance_method() 等价于 A.instance_method(a)

#### 类方法

- 在类中使用classmethod修饰的方法是类方法
- 类方法的第一个参数是cls，当前的类对象，也会被自动传递
- 类方法和实例方法的区别，实例方法的第一个参数是self，类方法的第一个参数是cls
- 类方法可以通过类调用，也可以通过实例调用，没有区别
- a.class_method() 等价于 A.class_method()

#### 静态方法

- 在类中使用staticmethod修饰的方法是静态方法
- 静态方法不需要指定任何默认参数，静态方法可以通过类和实例调用

```python
class A(object):

    # 类属性
    class_field = '类属性'

    def __init__(self):
        # 实例属性
        self.instance_field = '实例属性'

    # 实例方法
    def instance_method(self):
        print('实例方法')

    # 类方法
    @classmethod
    def class_method(cls):
        print('类方法')

    # 静态方法
    @staticmethod
    def static_method():
        print('静态方法')
```

### 垃圾回收

- 没有被引用的对象会被自动删除，\_\_del__特殊方法汇总对象被垃圾回收前调用

```python
class A:

    def __init__(self):
        self.name = 'A'

    def __del__(self):
        print('del方法调用')

a = A()
b = a
a = None
b = None #del方法调用

a = A()
del a #del方法调用
```

### 模块

#### 文件

- 一个py文件是一个模块
- 在一个模块中引入外部模块
  - import 模块名（模块名，即python文件名，不要py）
  - import 模块名 as 模块别名
- 可以引入同一个模块多次，但模块的实例只会创建一个
- import可以在程序的任意位置调用，一般在程序开头
- \_\_name\_\_属性值为\_\_main__的模块是主模块，一个程序只有一个主模块，即通过python执行的模块
- 引入模块中的部分内容
  - 语法：from 模块名 import 变量、变量...
  - 也可以为引入的变量使用as别名
  - from 模块名 import * 不会引入添加了_的变量

- demo.py

```python
a = 1

_b = 2

def func():
    print('func')

class MyClass:
    def __init__(self):
        self.field = 'field'

# 测试代码
if __name__ == '__main__':
    print('测试代码')
```

```python
import demo

print(demo.a) #1

print(demo._b) #2

mc = demo.MyClass()
print(mc.field) #field

demo.func() #func
```

```python
from demo import a,_b,MyClass,func

print(a) #1

print(_b) #2

mc = MyClass()
print(mc.field) #field

func() #func
```

```python
from demo import *

print(a) #1

#print(_b) #NameError
```

#### 包

- 包也是一个模块

- 包中要有\_\_init__.py文件，否则是命名空间包

```python
from MyPackage import demo1,demo2

print(demo1.a) #1

print(demo2._b) #2
```

#### 缓存文件

- \_\_pycache__是模块的缓存文件
- 代码在执行前，需要被解析器先转为机器码，然后再执行
- 使用模块时，也需要将模块的代码先转为机器码然后再执行，为了提供程序运行的性能，Python会在编译过一次后，将代码保存到一个缓存文件中，下次加载这个模块时，就可以不再重写编译而是直接加载缓存中编译好的代码即可

#### 标准库

- pprint模块
  - pprint()，对打印的数据进行简单格式化

- sys模块
  - 提供了一些变量和函数，可以获取到解析器的信息或通过函数来操作解析器
  - sys.argv，获取解析代码时命令行中所包含的参数，是一个列表
  - sys.modules，获取当前程序中引入的所有模块，是一个字典，key是模块名，value是模块对象
  - sys.path，获取模块的搜索路径，是一个列表
  - sys.platform，获取当前Python运行的平台
  - sys.exit()，用来退出程序

```python
print(sys.argv)
#['D:\\develop\\Python\\test.py']

pprint.pprint(sys.modules)
#{'__main__': <module '__main__' (built-in)>,
# ...
# 'zipimport': <module 'zipimport' (frozen)>,
# 'zlib': <module 'zlib' (built-in)>}

pprint.pprint(sys.path)
#['D:\\develop\\Python\\Lib\\idlelib',
# 'D:\\develop\\Python\\python38.zip',
# 'D:\\develop\\Python\\DLLs',
# 'D:\\develop\\Python\\lib',
# 'D:\\develop\\Python',
# 'D:\\develop\\Python\\lib\\site-packages']

print(sys.platform)
#win32
```

- os模块
  - 访问操作系统
  - os.environ，获取系统的环境变量
  - os.system()，执行操作系统的命令

```python
pprint.pprint(os.environ['path'])
#('D:\\develop\\Python\\Scripts\\;D:\\develop\\Python\\;C:\\Program Files '
# '(x86)\\Intel\\Intel(R) Management Engine Components\\iCLS\\;C:\\Program '
# ...
# 'IDEA Community Edition 2020.1.2\\bin;')

os.system('notepad')
```
