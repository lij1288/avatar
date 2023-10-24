## **Docker-Compose安装部署记录**

### 下载上传安装包

- [Releases · docker/compose (github.com)](https://github.com/docker/compose/releases/)

### 添加可执行权限

> chmod +x docker-compose-linux-x86_64

### 添加软链接

> ln -s /opt/app/docker-compose-linux-x86_64 /usr/bin/docker-compose

### 验证安装

> docker-compose version