## **Shell的流程控制**

### if

- 注意事项

  1. [ 条件判断表达式 ]，中括号和条件判断式之间必须有空格
  2. if后要有空格


#### if

```shell
if condition
then
    command1 
    command2
    ...
    commandN 
fi
```

#### if else

```shell
if condition
then
    command1 
    command2
    ...
    commandN
else
    command
fi
```

#### if else-if else

```shell
if condition1
then
    command1
elif condition2 
then 
    command2
else
    commandN
fi
```

### for

- 语法

  ```shell
  for ((初始值;循环控制条件;变量变化))
  do
  	command
  done
  ```

```shell
for i in 1 2 3
do
	echo $i
done
#或
for i in 1 2 3;do echo $i;done
#或
for i in (1..3);do echo $i;done
```

```shell
for str in 'This is a string'
do
    echo $str
done
# This is a string
```

### while

- 语法

  ```shell
  while condition
  do
      command
  done
  ```

```shell
#!/bin/bash
int=1
while(( $int<=5 ))
do
    echo $int
    let "int++"
done
```

- 读取键盘信息

```shell
echo '按下 <CTRL-D> 退出'
echo -n '输入你最喜欢的网站名: '
while read FILM
do
    echo "是的！$FILM 是一个好网站"
done
```

- 死循环

```shell
while :
do
    command
done
```

```shell
while true
do
    command
done
```

```shell
for (( ; ; ))
```

### until

- 语法

  ```shell
  until condition
  do
      command
  done
  ```

### case

- 语法

  ```shell
  case ${变量名} in
  	值1)
  	如果变量的值等于值1, 则执行程序1
  	;;
  	值2)
  	如果变量的值等于值2, 则执行程序2
  	;;
  	...
  	;;
  	*)
  	如果变量的值都不是以上的值, 则执行此程序
  	;;
  esac
  ```

  
