## **Docker安装部署记录**

### 卸载旧版本

```
sudo yum remove docker \
                   docker-client \
                   docker-client-latest \
                   docker-common \
                   docker-latest \
                   docker-latest-logrotate \
                   docker-logrotate \
                   docker-engine
```

### 安装依赖包

> sudo yum install -y yum-utils

### 配置Docker仓库

```
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

```shell
[root@avatar ~]# sudo yum-config-manager \
>     --add-repo \
>     https://download.docker.com/linux/centos/docker-ce.repo
已加载插件：fastestmirror, langpacks, product-id, subscription-manager

This system is not registered with an entitlement server. You can use subscription-manager to register.

adding repo from: https://download.docker.com/linux/centos/docker-ce.repo
grabbing file https://download.docker.com/linux/centos/docker-ce.repo to /etc/yum.repos.d/docker-ce.repo
repo saved to /etc/yum.repos.d/docker-ce.repo

```

### 安装Docker

> sudo yum install docker-ce docker-ce-cli containerd.io

### 设置开机启动

> sudo systemctl enable docker

### 启动Docker

> sudo systemctl start docker

### Hello-World

> sudo docker run hello-world

```shell
[root@avatar ~]# sudo docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
Digest: sha256:cc15c5b292d8525effc0f89cb299f1804f3a725c8d05e158653a563f15e4f685
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/

```