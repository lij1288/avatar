## **HDFS的命令行操作**

### 命令查看

> hdfs dfs

### 配置查看

> hdfs getconf 

### 参数查看

> hdfs getconf -confkey 参数

### 修改指定文件的副本数量

> hdfs dfs -setrep 2 /test.dat

### 读取文件内容

> hdfs dfs -cat /test.dat

- 若文件过大, cat不能全部显示, 使用linux管道命令：

> hsfs dfs -cat test.dat | less

### 实时监控文件末尾新增内容

> hdfs dfs -tail -f /test.dat

### 追加内容到已存在文件

> hdfs dfs -appendToFile ./2.txt /1.txt

### 下载多个文件并在本地合并成一个文件

> hdfs dfs -getmerge /*.txt ./merged.txt

### 查看目录

> hdfs dfs -ls /

### 创建文件夹

> hdfs dfs -mkdir /a
>
> hdfs dfs -mkdir -p /a/b

### 删除文件夹

> hdfs dfs -rm -r /a

### 上传文件

> hdfs dfs -put [本地路径] [hdfs路径]

### 下载文件

> hdfs dfs -get [hdfs路径] [本地路径]

### 移动文件

> hdfs dfs -mv /a/b/test.dat /

### 拷贝文件

> hdfs dfs -cp /test.dat /a/test.dat