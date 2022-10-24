## **Linux的高级文本命令**

### grep

#### 功能

- 按行查找字符, 输出包含字符的行

#### 语法

- 从文件查找

  > grep 'word' file.txt

- 从管道的输入查找

  > cat file.txt|grep 'word'

- 选项和参数

  > -c	统计匹配的行数
  >
  > -n	输出结果加行号
  >
  > -i	关键字匹配时忽略关键字大小写
  >
  > -v	反向查找, 即输出不包含关键字的行
  >
  > --color=auto	匹配的关键字高亮显示
  >
  > -An	同时输出匹配行的后n行
  >
  > -Bn	同时输出匹配行的前n行
  >
  > -Cn	(context) 同时输出匹配行的前后各n行

#### 使用

```shell
grep -v '^#' a.txt | grep -v '^$'	#查找不是以#开头的行, 去除空行
```

### cut

#### 功能

- 从一个文本文件/文本流中提取文本列

#### 语法

- 用于有特定分割字符

  > cut -d '分割字符' -f fields

- 用于排列整齐的信息

  > cut -c 字符区间

- 选项和参数

  > -d	后面接分隔字符, 与-f一起使用
  >
  > -f	依据 -d 的分隔字符将一段信息分割成为数段，用 -f 取出第几段的意思
  >
  > -c	以字符的单位取出固定字符区间

#### 使用

```shell
echo $PATH
/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/usr/apps/jdk1.8.0_141/bin:/usr/apps/hadoop-2.8.5/sbin:/usr/apps/hadoop-2.8.5/bin:/root/bin
#-----
echo $PATH | cut -d ':' -f 3	#找出第3个路径
/sbin

echo $PATH | cut -d ':' -f -5	#找出前5个路径
/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin

echo $PATH | cut -d ':' -f 8-	#找出第8个到最后一个路径
/usr/apps/hadoop-2.8.5/sbin:/usr/apps/hadoop-2.8.5/bin:/root/bin
```

```shell
cat demo.txt
id1 name1 age1
id2 name2 age2
id3 name3 age3 
#-----
cut -d ' ' -f 2 demo.txt	#找出分隔后的第2段
name1
name2
name3

cut -c 5-9 demo.txt	#找出第5个字符到第9个字符之间的
name1
name2
name3
```

### sed

#### 功能

- 行删除, 行新增, 行选取, 行替换和字符串替换
- 解决的问题:
  1. 处理文本文件
  2. 分析日志文件
  3. 修改配置文件
- 原则:
  1.  一次只处理一行内容
  2.  默认不可以改变文件内容 (除非重定向或者用 -i 参数)
  3.  可以对所有行进行操作, 也可以根据正则选定行

#### 语法

- 命令行格式

  > sed [options] 'command' file

- 选项和参数

  > -e 执行多条sed命令
  >
  > -n 忽略默认输出, 仅显示script处理后的结果
  >
  > -i 修改文件
  >
  > command: 行定位/正则定位 + sed命令

- 脚本格式

  > sed -f scriptfile file

- 动作:

  > d: 删除行
  >
  > a: 在行下追加
  >
  > i: 在行上插入
  >
  > c: 行替换
  >
  > s: 字符串替换
  >
  > p: 选取打印, 通常和-n一起使用
  >
  > r: 读取文件
  >
  > w: 写入文件
  >
  > q: 退出

#### 使用

```shell
cat demo.txt
id1 name1 age1
id2 name2 age2
id3 name3 age3

id5 name5 age5
```

- 行删除

```shell
#----------删除第2行
cat demo.txt|sed 2d
id1 name1 age1
id3 name3 age3

id5 name5 age5
#----------删除第2-4行
cat demo.txt|sed 2,4d
id1 name1 age1
id5 name5 age5
#----------删除第3行到最后一行
sed '3,$d' demo.txt
id1 name1 age1
id2 name2 age2
#----------删除空行
sed '/^$/d' demo.txt
id1 name1 age1
id2 name2 age2
id3 name3 age3
id5 name5 age5
#----------删除包含name3的行
sed '/name3/d' demo.txt
id1 name1 age1
id2 name2 age2

id5 name5 age5
```

- 行新增

```shell
#----------在第3行下追加
cat demo.txt|sed '3a id4 name4 age4'
id1 name1 age1
id2 name2 age2
id3 name3 age3
id4 name4 age4

id5 name5 age5
#----------在第5行上插入
 cat demo.txt|sed '5i id4 name4 age4'  
id1 name1 age1
id2 name2 age2
id3 name3 age3

id4 name4 age4
id5 name5 age5
```

- 行选取

```shell
#----------选取打印1-3行
cat demo.txt|sed -n 1,3p
id1 name1 age1
id2 name2 age2
id3 name3 age3
#----------选取打印以id3开头行
sed -n '/^id3/p' demo.txt
id3 name3 age3
#----------选取打印包含name3的行到name5的行
sed -n '/name3/,/name5/p' demo.txt
id3 name3 age3

id5 name5 age5
#----------不显示2-4行
sed -n '2,4!p' demo.txt
id1 name1 age1
id5 name5 age5
#----------从第1行开始, 每2行打印一次
sed -n '1~2p' demo.txt     
id1 name1 age1
id3 name3 age3
id5 name5 age5
```

- 行替换

```shell
#----------替换2-4行
cat demo.txt|sed '2,4c No 2~4 lines' 
id1 name1 age1
No 2~4 lines
id5 name5 age5
```

- 字符串替换

```shell
#----------替换所有name3
cat demo.txt|sed 's/name3/Tom/g'
#或
cat demo.txt|sed 's#name3#Tom#g'#紧跟s的字符被认为是新的分隔符
id1 name1 age1
id2 name2 age2
id3 Tom age3

id5 name5 age5
#----------替换每行的第一个1
sed 's/1/0/' demo.txt
id0 name1 age1
id2 name2 age2
id3 name3 age3

id5 name5 age5
#----------&表示追加一个串在找到的串后
sed 's/id1/&gender1/g' demo.txt
id1gender1 name1 age1
id2 name2 age2
id3 name3 age3

id5 name5 age5
```

- 修改文件

```shell
#----------修改原文件
cat demo.txt|sed -i '2,4c No 2~4 lines' demo.txt

#----------写入新文件
cat demo.txt|sed '2,4c No 2~4 lines'>demo2.txt

#----------会将源文件清空
#cat demo.txt|sed '2,4c No 2~4 lines'>demo.txt
```

- 多点编辑

```shell
#----------多点编辑
sed -e 1d -e 's/name3/Jerry/g' demo.txt
id2 name2 age2
id3 Jerry age3

id5 name5 age5
```

- 读取文件

```shell
#----------读取文件内容, 显示在所有匹配的行下
sed '/name5/r demo2.txt' demo.txt
id1 name1 age1
id2 name2 age2
id3 name3 age3

id5 name5 age5
id6 name6 age6
```

- 写入文件

```shell
#----------将demo.txt中所有包含name的行写入demo2.txt
sed -n '/name/w demo2.txt' demo.txt
cat demo2.txt
id1 name1 age1
id2 name2 age2
id3 name3 age3
id5 name5 age5
```

- 退出命令

```shell
#----------输入3行后退出sed
sed 3q demo.txt
id1 name1 age1
id2 name2 age2
id3 name3 age3
#----------输入name2后退出sed
sed '/name2/q' demo.txt 
id1 name1 age1
id2 name2 age2
```

### awk

#### 功能

- 文本处理工具
- 解决的问题
  1. 一堆文本要分析
  2. 一堆数据要处理
  3. 分析服务器日志

#### 语法

- 语法

  > awk -F|-f|-v 'BEGIN{ } pattern {comand1;comand2} END{ }' file

- 选项和参数

  > -F 定义列分隔符, 默认为空格和tab
  >
  > -v 定义变量
  >
  > -f 指定调用脚本
  >
  > BEGIN{ } 初始化代码块, 在对每一行进行处理之前, 初始化代码
  >
  > END{ } 结尾代码块
  >
  > { } 命令代码块, 包含一条或多条命令

- 内置变量

  > $0 整个当前行
  >
  > $n 每行的第n个字段
  >
  > NR 每行的行号, 多文件记录递增
  >
  > NF 字段数量 (列)
  >
  > FILENAME 文件名
  >
  > FNR 与NR类似, 不过多文件记录不递增, 每个文件都从1开始
  >
  > FS BEGIN时定义分隔符. BEGIN {FS=':'}等效于-F ':'
  >
  > RS 输入的分隔符, 默认为换行符
  >
  > OFS 输出字段分隔符, 默认为空格
  >
  > ORS 输出记录分隔符, 默认为换行符

- 逻辑判断

  > ~ !~ 匹配正则表达式
  >
  > == != > < 判断逻辑表达式

#### 使用

```shell
cat passwd.txt
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
```

- 打印字段

```shell
#----------
awk -F ':' '{print$1,$3}' passwd.txt
root 0
bin 1
daemon 2
adm 3
lp 4
#----------
awk -F ':' '{print$1,$3}' OFS="\t" passwd.txt
#或
awk -F ':' '{print$1"\t"$3}' passwd.txt
root    0
bin     1
daemon  2
adm     3
lp      4
#----------
awk -F ':' '{printf("Username:%s\tUid=%s\n",$1,$3)}' passwd.txt
#或
awk -F ':' '{print "Username:"$1"\tUid="$3}' passwd.txt
Username:root   Uid=0
Username:bin    Uid=1
Username:daemon Uid=2
Username:adm    Uid=3
Username:lp     Uid=4
```

- 行号, 列数

```shell
#----------输出行号, 列数, 用户名
awk -F ':' '{printf("行号：%s 列数：%s 用户名：%s\n",NR,NF,$1)}' passwd.txt
#或
awk -F ':' '{print"行号：" NR,"列数："NF,"用户名："$1}' passwd.txt
行号：1 列数：7 文件名：root
行号：2 列数：7 文件名：bin
行号：3 列数：7 文件名：daemon
行号：4 列数：7 文件名：adm
行号：5 列数：7 文件名：lp
```

- 逻辑判断

```shell
#----------输出
awk -F ':' '{if($3>1) print $1,$3}' passwd.txt
#或
awk -F ':' '$3>1 {print$1,$3}' passwd.txt
daemon 2
adm 3
lp 4
#----------输出用户名以a开头的
awk -F ':' '$1~/^a.*/{print$1,$3}' passwd.txt
adm 3
```

- BEGIN, END

```shell
#----------制表
awk -F ':' 'BEGIN{print"User\tLine\tCol"}{print $1"\t"NR"\t"NF}END{print"===="FILENAME"===="}' passwd.txt
User    Line    Col
root    1       7
bin     2       7
daemon  3       7
adm     4       7
lp      5       7
====passwd.txt====
#----------统计行数
awk 'BEGIN{count==0}{count++}END{print count}' passwd.txt
5
#----------统计每个用户名出现的次数
awk -F ':' '{arr[$1]++}END{for(key in arr) print key,arr[key]}' passwd.txt
bin 1
adm 1
daemon 1
root 1
lp 1
```

### sort

#### 功能

- 排序工具, 以行为单位排序

#### 语法

- 语法

  > sort [参数] [文件]
  >
  > 默认将文本文件的第一列以ASCII 码的次序排列

- 选项和参数

  > -k (key) 以哪列进行排序
  >
  > -t [分隔符] 指定分隔符
  >
  > -c 检查文件是否已排好序, 如果乱序, 则输出第一个乱序的行的相关信息, 最后返回1
  >
  > -C 检查文件是否已排好序, 如果乱序, 不输出内容, 可以通过退出状态码1判断出文件未排序
  >
  > -f 忽略大小写
  >
  > -n 按数值排序, 默认为字典
  >
  > -r 按降序排序, 默认为升序
  >
  > -o [文件名] 输出到文件, 可修改原文件 (>会清空原文件)
  >
  > -u 只输出重复行的第一行
  >
  > -M 按月份缩写排序
  >
  > -b 忽略每一行前面的所有空白部分, 从第一个可见字符开始比较
  >
  > -m (merge) 对给定的多个已排序文件进行合并, 在合并过程中不做任何排序动作

- -k 的格式

  > [ FStart [ .CStart ] ] [ Modifier ] \[ , \[ FEnd \[ .CEnd ] ][ Modifier ] ]
  >
  > -k1 按第一列排序
  >
  > -k1,1 用逗号分隔字段, 表示从第一个字段开始排序到第一个字段结束
  >
  > -k 1.1,3.3  用点分隔字符, 表示从第一个字段的第一个字符开始排序到第三个字段的第三个字符结束

#### 使用

```shell
cat sort.txt
1 jerry 100 12
2 tom 60 18
3 speike 85 25
6 avatar 99 26
5 xuan 100 28
#----------c
sort -c sort.txt 
sort: sort.txt:5: disorder: 5 xuan 100 28
#----------C
sort -C sort.txt 
echo $?
1
#----------k, r, n
sort -rnk 3 sort.txt
5 xuan 100 28
1 jerry 100 12
6 avatar 99 26
3 speike 85 25
2 tom 60 18
#----------按第2列第2个字符排序
sort -t' ' -k 2.2 sort.txt	#必须有-t
1 jerry 100 12
2 tom 60 18
3 speike 85 25
5 xuan 100 28
6 avatar 99 26
#----------按第3列第2个字符到第4列第2个字符排序, 按数值排序
sort -t' ' -nk 3.2,4.2 sort.txt 
1 jerry 100 12
2 tom 60 18
5 xuan 100 28
3 speike 85 25
6 avatar 99 26
```

