## **Shell的条件判断**

- [ expression ]（**expression前后要加空格**）
- test expression

### 字符串

```powershell
test str1 == str2	#判断字符串是否相等
test str1 != str2	#判断字符串是否不相等
test str1	#判断字符串是否为空
test -n str1	#判断字符串长度是否不为0
test -z str1	#判断字符串长度是否为0
```

### 整数

```shell
test int1 -eq int2	#等于
test int1 -ne int2	#不等于
test int1 -gt int2	#大于
test int1 -lt int2	#小于
test int1 -ge int2	#大于等于
test int1 -le int2	#小于等于
```

### 文件

```shell
test -e file	#是否存在
test -d file	#是否为目录
test -f file	#是否为文件
test -L file	#是否为软链接
test -r file	#是否可读
test -w file	#是否可写
test -x file	#是否可执行
```

