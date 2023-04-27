## **Python的序列**

### 列表

#### 基本使用

- 通过[]来创建列表
- 列表中可以保存不同类型对象
- 可通过索引获取列表中的元素，索引可以是负数，从后向前获取

```python
l = [1,3,5,8,9]

print(l,type(l)) #[1, 3, 5, 8, 9] <class 'list'>

print(l[0]) #1

print(l[-3]) #5

print(len(l)) #5
```

#### 列表切片

- 从现有列表中，获取一个子列表，不影响原表
- 语法：列表[起始:结束]
  - 包括起始，不包括结束
  - 省略起始位置，从第一个元素开始截取
  - 省略结束位置，截取到最后

```python
nums = [1,3,5,8,9]

print(nums[1:3]) #[3, 5]
print(nums[2:]) #[5, 8, 9]
print(nums[:2]) #[1, 3]
print(nums[:3]) #[1, 3, 5]
print(nums[:]) #[1, 3, 5, 8, 9]
print(nums) #[1, 3, 5, 8, 9]
```

- 语法：列表[起始:结束:步长]
  - 步长表示获取元素的间隔，默认为1
  - 步长可以是负数，从后向前获取

```python
print(nums[0:5:2]) #[1, 5, 9]
print(nums[::-2]) #[9, 5, 1]
```

#### 相关操作

- 列表拼接

```python
print([1,2,3] + [4,5,6])
```

- 列表重复

```python
print([1,2,3] * 3)
```

- 检查元素是否存在

```python
nums = [1,3,5,3,8,9]
print(3 in nums) #True
print(5 not in nums) #False
```

- 最值

```python
print(min(nums),max(nums)) #1 9
```

- 获取元素第一次出现时索引
  - 后两个参数分别为查找起始位置，不包含结束位置
  - 元素不存在会报错

```python
print(nums.index(3)) #1
print(nums.index(3,1,5)) #1
print(nums.index(3,2,5)) #3
print(nums.index(3,2)) #3
print(nums.index(3,2,9)) #3
print(nums.index(7)) #ValueError: 7 is not in list
```

- 统计元素出现次数

```python
print(nums.count(3)) #2
```

#### 修改元素

- 通过索引修改元素

```python
nums = [1,3,5,3,8,9]
nums[0] = 7
print(nums) #[7, 3, 5, 3, 8, 9]
```

- 删除元素

```python
nums = [1,3,5,3,8,9]
del nums[0]
print(nums) #[3, 5, 3, 8, 9]
```

- 通过切片修改列表

  - 给切片进行赋值时，只能使用序列

  - 设置了步长时，序列中元素个数必须与切片中元素个数一致

```python
nums = [1,3,5,3,8,9]
nums[0:1] = [7,7,7]
print(nums) #[7, 7, 7, 3, 5, 3, 8, 9]

nums = [1,3,5,3,8,9]
nums[0:0] = [7,7,7]
print(nums) #[7, 7, 7, 1, 3, 5, 3, 8, 9]

nums = [1,3,5,3,8,9]
#nums[::2] = [7,7] #ValueError: attempt to assign sequence of size 2 to extended slice of size 3
nums[::2] = [7,7,7]
print(nums) #[7, 3, 7, 3, 7, 9]
```

- 通过切片删除元素

```python
nums = [1,3,5,3,8,9]
del nums[0:2]
print(nums) #[5, 3, 8, 9]

nums = [1,3,5,3,8,9]
del nums[::2]
print(nums) #[3, 3, 9]

nums = [1,3,5,3,8,9]
nums[0:2] = []
print(nums) #[5, 3, 8, 9]
```

- 以上操作只适用于可变序列
  - 可用给list()函数将其他序列转换为list

```python
s = 'abc'
#s[1] = 'a' #TypeError: 'str' object does not support item assignment

s = list(s)
print(s) #['a', 'b', 'c']
```

#### 列表方法

- append()
  - 向列表最后添加一个元素

```python
nums = [1,3,5,3,8,9]
nums.append(7)
print(nums) #[1, 3, 5, 3, 8, 9, 7]
```

- insert()
  - 向列表指定位置插入一个元素

```python
nums = [1,3,5,3,8,9]
nums.insert(2,7)
print(nums) #[1, 3, 7, 5, 3, 8, 9]
```

- extend()
  - 使用新序列扩展当前序列

```python
nums = [1,3,5,3,8,9]
nums.extend([7,7])
print(nums) #[1, 3, 5, 3, 8, 9, 7, 7]
```

- clear()
  - 清空序列

```python
nums = [1,3,5,3,8,9]
nums.clear()
print(nums) #[]
```

- pop()
  - 根据索引删除元素并返回被删除的元素
  - 无参为删除最后一个元素

```python
nums = [1,3,5,3,8,9]
nums.pop(2) #5
print(nums) #[1, 3, 3, 8, 9]

nums = [1,3,5,3,8,9]
nums.pop() #9
print(nums) #[1, 3, 5, 3, 8]
```

- remove()
  - 删除指定值的元素
  - 如果存在多个，只删除第一个

```python
nums = [1,3,5,3,8,9]
nums.remove(3)
print(nums) #[1, 5, 3, 8, 9]
```

- reverse()
  - 反转列表

```python
nums = [1,3,5,3,8,9]
nums.reverse()
print(nums) #[9, 8, 3, 5, 3, 1]
```

- sort()
  - 排序，默认为升序排序
  - 降序排序需传参reverse=True

```python
nums = [1,3,5,3,8,9]
nums.sort()
print(nums) #[1, 3, 3, 5, 8, 9]
nums.sort(reverse=True)
print(nums) #[9, 8, 5, 3, 3, 1]
```

#### 列表遍历

- while

```python
nums = [1,3,5]
i = 0
while i < len(nums):
    print(nums[i])
    i += 1
```

- for

```python
nums = [1,3,5]
for n in nums:
    print(n)
```

#### 补充内容

```python
a = [1,2,3]
print(a,id(a)) #[1, 2, 3] 61739656
a[0] = 7
print(a,id(a)) #[7, 2, 3] 61739656
a = [4,5,6]
print(a,id(a)) #[4, 5, 6] 62060712
```

### 元组

#### 基本使用

- 元组是一个不可变的序列
- 元组不是空元组时，可以省略括号

```python
t = ()
t = (1,2,3)

print(t) #(1, 2, 3) <class 'tuple'>

t = 1,2,3
print(t) #(1, 2, 3)
```

#### 元组解包

- 将元组中每一个元素都赋值给一个变量

```python
nums = 1,2,3
a,b,c = nums
print(a,b,c) #1 2 3
```

- 利用元组进行交换

```python
a = 111
b = 222
print(a,b) #111 222
a,b = b,a
print(a,b) #222 111
```

- 变量的数量必须和元组中的元素数量一致
- 可以再变量前加*，获取元组中所有剩余的元素
- 不能同时出现两个及以上的*变量

```python
nums = 1,2,3,4,5
a,b,*c = nums
print(a,b,c) #1 2 [3, 4, 5]
print(nums) #(1, 2, 3, 4, 5)
a,*b,c = nums
print(a,b,c) #1 [2, 3, 4] 5
a,b,*c = 'abcde'
print(a,b,c) #a b ['c', 'd', 'e']
a,b,*c=1,2
print(a,b,c) #1 2 []
#a,b,*c=1 #TypeError: cannot unpack non-iterable int object
```

### 字典

#### 基本使用

- 字典的键可以时任意不可变对象（int、str、bool、tupe ...），一般使用str
- 字典的值可以是任意对象
- 字典的键不能重复，如果重复后边的会替换前边的

```python
d = {}
d = {'a':1,'b':2,'c':3,'a':7}

print(d,type(d)) #{'a': 7, 'b': 2, 'c': 3} <class 'dict'>

print(d['a'],d['b'],d['c']) #7 2 3
```

- 使用键值对创建字典

```python
d = dict(a=1,b=2,c=3)
print(d) #{'a': 1, 'b': 2, 'c': 3}
```

- 将包含双值子序列的序列转换为字典

```python
d = dict(a=1,b=2,c=3)
print(d) #{'a': 1, 'b': 2, 'c': 3}
```

#### 相关操作

- 获取键值对个数

```python
d = dict(a=1,b=2,c=3)
print(len(d)) #3
```

#### 字典取值

- 检查是否包含指定键

```python
d = dict(a=1,b=2,c=3)
print('a' in d) #True
print('a' not in d) #False
```

- 根据键获取对应值
  - 通过[]取值，如果键不存在，会抛出异常
  - 通过get()取值，如果键不存在，返回None，可以传第二个参数作为默认值

```python
d = dict(a=1,b=2,c=3)

print(d['a']) #1
#print(d['d']) #KeyError: 'd'

print(d.get('a')) #1
print(d.get('d')) #None
print(d.get('d','Default')) #Default
```

#### 字典修改

- d[key] = value
  - 如果key存在则覆盖，不存在则添加

```python
d = dict(a=1,b=2,c=3)
d['a'] = 7
d['d'] = 4
print(d) #{'a': 7, 'b': 2, 'c': 3, 'd': 4}
```

- setdefault(key[, default])
  - 如果key存在则返回key值，但不对字典进行操作，如果不存在则进行添加

```python
d = dict(a=1,b=2,c=3)
d.setdefault('a',1) #1
d.setdefault('d',4) #4
print(d) #{'a': 1, 'b': 2, 'c': 3, 'd': 4}
```

- update([other])
  - 将其他字典中的key-value添加到当前字典，如果key存在则进行覆盖

```python
d = dict(a=1,b=2,c=3)
>>> d2 = dict(c=33,d=44,e=55)
>>> d.update(d2)
>>> print(d)
{'a': 1, 'b': 2, 'c': 33, 'd': 44, 'e': 55}
```

#### 字典删除

- del

```python
d = dict(a=1,b=2,c=3)
del d['a']
print(d) #{'b': 2, 'c': 3}
```

- popitem()
  - 任意删除字典中的一个键值对（最后一个）
  - 将删除的key-vlaue返回
  - 使用popitem()删除一个空字典时会抛出异常

```python
d = dict(a=1,b=2,c=3)
d.popitem() #('c', 3)
print(d) #{'a': 1, 'b': 2}
```

- pop(key[, default])
  - 根据key进行删除
  - 将删除的vlaue返回
  - 如果删除不存在的key则抛出异常
  - 指定默认值后，删除不存在的key则返回默认值

```python
d = dict(a=1,b=2,c=3)

d.pop('a') #1
print(d) #{'b': 2, 'c': 3}

#d.pop('d') #KeyError: 'd'

d.pop('d','Default') #'Default'
```

- clear()
  - 清空字典

```python
d = dict(a=1,b=2,c=3)
d.clear()
print(d) #{}
```

#### 字典拷贝

- copy()
  - 字典浅拷贝
  - 简单复制对象内部的值，如果值是一个可变对象，不会被复制，还是引用

```python
d = dict(a={'m':1,'n':2},b=2,c=3)
print(d) #{'a': {'m': 1, 'n': 2}, 'b': 2, 'c': 3}
d2 = d.copy()
print(d2) #{'a': {'m': 1, 'n': 2}, 'b': 2, 'c': 3}

d2['a']['m'] = 7
print(d2) #{'a': {'m': 7, 'n': 2}, 'b': 2, 'c': 3}
print(d)  #{'a': {'m': 7, 'n': 2}, 'b': 2, 'c': 3}

print(id(d['a']))  #61744984
print(id(d2['a'])) #61744984
```

#### 字典遍历

- keys()

```python
d = dict(a=1,b=2,c=3)
for k in d.keys():
    print(k)
```

- vlaues()

```python
d = dict(a=1,b=2,c=3)
for v in d.values():
    print(v)
```

- items()

```python
d = dict(a=1,b=2,c=3)
for k,v in d.items():
    print(k,'=',v)
```

### 集合

#### 基本使用

```python
s = {1,3,5,3,8,9}
s = set([1,3,5,3,8,9])
s = set()
print(s,type(s)) #{1, 3, 5, 8, 9} <class 'set'>

s = set('abc')
print(s) #{'a', 'c', 'b'}

s = set({'a':1,'b':2,'c':3})
print(s) #{'a', 'c', 'b'}
```

#### 相关操作

- 是否包含

```python
s = set('abc')
print('a' in s) #True
print('a' not in s) #False
```

- 

#### 添加操作

- add()添加一个元素

```python
s ={1,3,5}
s.add(7)
```

- update()将一个集合中的元素添加到当前集合
  - 可以传递序列或字典作为参数，字典只使用键

```python
s ={1,3,5}
s.update((3,8,9)
```

#### 集合删除

- pop()随机删除并返回一个元素

```python
s = {1,3,5,3,8,9}
print(s) #{1, 3, 5, 8, 9}
s.pop() #1
```

- remove()删除集合中的指定元素 

```python
s = {1,3,5,3,8,9}
s.remove(9)
print(s) #{1, 3, 5, 8}
```

- clear()清空集合

```python
s.clear()
print(s) set()
```



#### 集合拷贝

- copy()对集合进行浅复制

```python
s2 = s.copy()
```

#### 集合运算

- & 交集
- | 并集
- \- 差集
- ^ 异或集，只在一个集合中出现的元素

```python
s1 = {1,2,3,4,5}
s2 = {3,4,5,6,7}
print(s1 & s2) #{3, 4, 5}

print(s1 | s2) #{1, 2, 3, 4, 5, 6, 7}

print(s1 - s2) #{1, 2}

print(s1 ^ s2) #{1, 2, 6, 7}
```

- <= 检查一个集合是否是另一个集合的子集

  < 检查一个集合是否是另一个集合的真子集

- \>= 检查一个集合是否是另一个集合的超集

  \> 检查一个集合是否是另一个集合的真超集

```python
print({1,2,3} <= {1,2,3,4,5}) #True

print({1,2,3} <= {1,2,3}) #True

print({1,2,3} < {1,2,3,4,5}) #True

print({1,2,3} < {1,2,3}) #False
```
