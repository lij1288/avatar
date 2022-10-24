## Shell的函数

### 系统函数

#### basename

- 功能：打印目录或者文件的基本名称，显示最后的目录名或文件名
- 如果指定后缀, 则也会将后缀去掉

> [root@linux01 ~]# basename /tmp/test/
>
> phoenixera
>
> [root@linux01 ~]# basename /tmp/test/demo.txt
>
> demo.txt
>
> [root@linux01 ~]# basename /tmp/test/demo.txt .txt
>
> demo

#### dirname

- 功能：去除文件名中的非目录部分

> [root@linux01 ~]# dirname /tmp/test/
>
> /tmp
>
> [root@linux01 ~]# dirname /tmp/test/demo.txt
>
> /tmp/test
>
> [root@linux01 ~]# 

### 自定义函数

#### 定义格式

```shell
[ function ] funname [()]

{
    action;
    [return int;]
}
```

#### 参数及返回值

- 使用return指定返回值，如果不使用，将以最后一条命令的运行结果作为返回值
- 函数返回值在调用该函数后通过$?来获得
- 调用函数时可以向其传递参数，在函数体内部，通过$n的形式来获取参数的值