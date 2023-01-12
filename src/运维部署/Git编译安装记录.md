## **Git编译安装记录**

### 上传解压安装包

- https://mirrors.edge.kernel.org/pub/software/scm/git/

> tar -zxvf git-2.26.2.tar.gz

### 安装所需依赖

> yum -y install curl-devel expat-devel gettext-devel openssl-devel zlib-devel gcc-c++ perl-ExtUtils-MakeMaker

### 卸载自动安装的Git

> yum remove git

### 编译安装

> cd git-2.26.2

> ./configure prefix=/opt/app/git

> make && make install

### 配置环境变量

> vi /etc/profile

```shell
export GIT_HOME=/opt/app/git
export PATH=$PATH:$GIT_HOME/bin
```

> source /etc/profile

### 查看安装结果

> git --version