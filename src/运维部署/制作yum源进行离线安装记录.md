## **制作yum源进行离线安装记录**

### 安装工具

> yum install -y createrepo

### 下载全量依赖

> repotrack lftp -p /opt/tmp/lftp

### 制作yum源

> createrepo /opt/tmp/lftp

### 上传yum源

- 上传文件夹lftp到目标服务器

### 配置yum源

- 进行备份

> cd /etc/yum.repos.d/
>
> rename .repo .repo.bak *

- vi /etc/yum.repos.d/lftp.repo

```
[lftp]
name=lftp
baseurl=file:///opt/app/lftp
gpgcheck=0
enabled=1
```

### 进行安装

- 安装前可进行依赖关系缓存

> yum clean all
>
> yum makecache

> yum install lftp

### 还原备份

> rename .repo.bak .repo *