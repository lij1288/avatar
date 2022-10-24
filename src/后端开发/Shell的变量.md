## **Shell的变量**

### 系统变量

- **set** 查看系统中的所有变量

> BASH=/bin/bash
>
> HOME=/root
>
> HOSTNAME=linux01
>
> PWD=当前目录
>
> PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/usr/apps/jdk1.8.0_141/bin:/root/bin
>
> USER=root
>
> ...

### 自定义变量

#### 相关语法

- 定义变量

  > 变量=值

- 删除变量

  > unset 变量

- 静态变量（不能重新赋值，不能删除）

  > readonly 变量

#### 变量定义规则

- 命名只能使用英文字母、数字和下划线，不能以数字开头
- 等号两侧不能有空格
- 变量默认类型都是字符串类型，无法直接进行数值运算
- 变量的值如果有空格，需要使用单引号或双引号括起来

#### 变量的取值

- $name
- ${name}

#### export和source关键字

- export 将变量的范围作用在所有的子bash中
- source 将子bash定义的变量作用在当前bash

#### 单引号和双引号

- 单引号
  - 单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的
  - 单引号字串中不能出现单独一个的单引号（对单引号使用转义符后也不行），但可成对出现，作为字符串拼接使用

- 双引号
  - 双引号里可以有变量
  - 双引号里可以出现转义字符

```shell
#!/bin/bash
name=avatar
echo "hello, ${name}!"
echo "hello, "${name}"!"
echo 'hello, ${name}!'
echo 'hello, '${name}'!'

#hello, avatar!
#hello, avatar!
#hello, ${name}!
#hello, avatar!
```

#### 字符串操作

- 字符串长度

```shell
name=avatar

echo ${#name}
```

- 提取子字符串

```shell
name=avatar

#从第4个字符开始, 提取2个 --- ta
echo ${name:3:2}
```

- 查找子字符串

 ```shell
name=avatar

#查找字符r,t或v的位置, 哪个先出现计算哪个 --- 2
echo `expr index $name rtv`
 ```

### 特殊变量

| 参数处理 | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| \$n      | n为数字，\$0为执行的文件名，\$n为第n个参数，10以上的参数要使用大括号 |
| $*       | 代表命令行中的所有参数，把所有的参数看成一个整体，以"\$1 ​\$2 … ​\$n"的形式输出所有参数 |
| $@       | 代表命令行中的所有参数，把每个参数区分对待，以"\$1" "​\$2" … "\$n"的形式输出所有参数 |
| $#       | 传递到脚本的参数个数                                         |
| $?       | 执行上一个命令的返回值，执行成功返回0，执行失败返回非0（具体数字由命令决定） |
| $$       | 当前进程的进程号（PID），即当前脚本执行时生成的进程号        |
| $!       | 后台运行的最后一个进程的进程号（PID），即最近一个被放入后台执行的进程 |
| $-       | 显示Shell使用的当前选项                                      |

- \$*和​\$@的区别
  - \$*和\$@都表示传递给函数或脚本的所有参数，不被双引号" "包含时，都以"\$1" "​\$2" … "​\$n"的形式输出所有参数
  - 当被双引号" "包含时，"\$*"会将所有的参数作为一个整体，以"\$1 \$2 … \$n"的形式输出所有参数，"\$@"会将各个参数分开，以"\$1" "\$2" … "\$n"的形式输出所有参数

### read

- 语法:

  > read [选项] [值]
  >
  > -p [提示语句]
  >
  > -n [字符个数]
  >
  > -t [等待时间]
  >
  > -s 隐藏输入

```shell
read –t 30 –p "please input your name:" NAME
echo $NAME

read –s –p "please input your age :" AGE
echo $AGE

read –n 1 –p "please input your sex [M/F]:" GENDER
echo $GENDER
```
