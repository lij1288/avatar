## **Python环境安装记录**

### 下载并解压安装包

- 下载地址：https://www.python.org/downloads/release/python-383/
- Version：Gzipped source tarball  
- Operating System：Source release

> tar zxvf Python-3.8.3.tgz

### 安装相关预备环境

> yum install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gcc make

### 编译并安装

> cd Python-3.8.3

> ./configure prefix=/opt/app/python3

> make && make install

### 添加软链接

> ln -s /opt/app/python3/bin/python3 /usr/bin/python3

> ln -s /opt/app/python3/bin/pip3 /usr/bin/pip3

### 验证安装

> python3