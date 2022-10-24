## **Docker的常用命令**
### 镜像命令

#### 拉取镜像

```shell
docker pull [选项] [仓库地址[:端口号]/]仓库名[:标签]
```

- 默认仓库地址为Docker Hub
- 仓库名为用户名/软件名，Docker Hub中默认用户名为library（官方镜像）
- 默认标签为latest

- 下载过程为按层下载，并给出每一层ID的前12位，下载结束后会给出该镜像完整的sha256摘要，确保下载一致性

#### 查看镜像

```shell
docker image ls
```

- 显示仓库名、标签、镜像ID、创建时间、所占用空间
- Docker Hub中显示体积为压缩状态体积，与拉取后的不同
- 显示镜像ID

```shell
docker image ls -q
```

- 查看悬虚镜像
  - 悬虚镜像：由于新旧镜像同名，旧镜像名称被取消，仓库名、标签名均为\<none>的镜像

```shell
docker image ls -f dangling=true
```

- 查看中间层镜像在内的所有镜像
  - 中间层镜像：为了加速镜像构建、重复利用资源而产生，显示为无标签镜像

```shell
docker image ls -a
```

- 根据仓库名查看镜像

```shell
docker image ls [仓库名]
```

- 查看某个镜像

```shell
docker image ls [仓库名:标签名]
```

- 根据创建时间过滤镜像

```shell
docker image ls -f since=[镜像名/ID]
docker image ls -f before=[镜像名/ID]
```

- 根据镜像构建时定义的label过滤镜像

```shell
 docker image ls -f label=com.example.version=0.1
```

- 自定义列查看

```shell
docker image ls --format "{{.Repository}}: {{.Size}}"
docker image ls --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
```

#### 删除镜像

```shell
docker image rm [选项] <镜像1> [<镜像2> ...]
```

- 可根据镜像短ID、镜像长ID、镜像名、镜像摘要删除

#### 查看占用空间

```shell
docker system df
```

- 查看镜像、容器、数据卷所占用空间

#### 删除悬虚镜像

```shell
docker image prune
```

#### 定制镜像

##### docker commit

```shell
docker commit [选项] <容器ID或容器名> [<仓库名>[:<标签>]]
```

- 会添加大量无关内容，导致镜像臃肿
- 操作为黑箱操作，维护困难

- 操作记录

```
[root@avatar ~]# docker run --name webserver -d -p 80:80 nginx
```

访问页面：192.168.1.111

修改欢迎文字

```
[root@avatar ~]# docker exec -it webserver bash
root@43d56450dede:/# echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
```

保存镜像

```
[root@avatar ~]# docker commit \
>     -a "Author"\
>     -m "Commit message"\
>     webserver \
>     nginx:v2
sha256:4d42a904c1bf94933bf19ef676d4c04dea047df0d7a4f72a254757612f8e6873
[root@avatar ~]# docker image ls
REPOSITORY               TAG       IMAGE ID       CREATED          SIZE
nginx                    v2        4d42a904c1bf   25 seconds ago   141MB
nginx                    latest    ea335eea17ab   20 hours ago     141MB
wurstmeister/kafka       latest    11142da99906   6 weeks ago      505MB
hello-world              latest    feb5d9fea6a5   7 weeks ago      13.3kB
wurstmeister/zookeeper   latest    3f43f72cb283   2 years ago      510MB
```

查看历史记录

```
[root@avatar ~]# docker history nginx:v2
IMAGE          CREATED              CREATED BY                                      SIZE      COMMENT
4d42a904c1bf   About a minute ago   nginx -g daemon off;                            1.28kB    Commit message
ea335eea17ab   20 hours ago         /bin/sh -c #(nop)  CMD ["nginx" "-g" "daemon…   0B        
<missing>      20 hours ago         /bin/sh -c #(nop)  STOPSIGNAL SIGQUIT           0B        
<missing>      20 hours ago         /bin/sh -c #(nop)  EXPOSE 80                    0B        
<missing>      20 hours ago         /bin/sh -c #(nop)  ENTRYPOINT ["/docker-entr…   0B        
<missing>      20 hours ago         /bin/sh -c #(nop) COPY file:09a214a3e07c919a…   4.61kB    
<missing>      20 hours ago         /bin/sh -c #(nop) COPY file:0fd5fca330dcd6a7…   1.04kB    
<missing>      20 hours ago         /bin/sh -c #(nop) COPY file:0b866ff3fc1ef5b0…   1.96kB    
<missing>      20 hours ago         /bin/sh -c #(nop) COPY file:65504f71f5855ca0…   1.2kB     
<missing>      20 hours ago         /bin/sh -c set -x     && addgroup --system -…   61.1MB    
<missing>      20 hours ago         /bin/sh -c #(nop)  ENV PKG_RELEASE=1~bullseye   0B        
<missing>      20 hours ago         /bin/sh -c #(nop)  ENV NJS_VERSION=0.7.0        0B        
<missing>      20 hours ago         /bin/sh -c #(nop)  ENV NGINX_VERSION=1.21.4     0B        
<missing>      20 hours ago         /bin/sh -c #(nop)  LABEL maintainer=NGINX Do…   0B        
<missing>      28 hours ago         /bin/sh -c #(nop)  CMD ["bash"]                 0B        
<missing>      28 hours ago         /bin/sh -c #(nop) ADD file:a2405ebb9892d98be…   80.4MB  
```

启动新镜像

```
[root@avatar ~]# docker run --name web2 -d -p 81:80 nginx:v2
```

访问页面：192.168.1.111:81

##### docker build

```shell
docker build [选项] <上下文路径/URL/->
```

- 在本机执行的docker功能，是使用远程调用的形式在服务端即Docker引擎完成，上下文是为了在这种客户度/服务端的架构中，让服务端获取本地文件，构建过程中上下文路径下的文件会被打包上传给Docker引擎。
- Dockerfile应置于空目录下，或项目根目录下，可通过.dockerignore文件剔除不需要作为上下文传递给Docker引擎的文件。
- 如果不通过 -f 指定Dockerfile文件，默认将上下文目录中名为Dockerfile的文件作为Dockerfile。

- 操作记录

创建Dockerfile

```
[root@avatar mynginx]# vi Dockerfile
```

```
FROM nginx
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
```

构建镜像

在Dockerfile文件所在目录

```
[root@avatar mynginx]# docker build -t nginx:v3 .
Sending build context to Docker daemon  2.048kB
Step 1/2 : FROM nginx
 ---> ea335eea17ab
Step 2/2 : RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
 ---> Running in 1715fffeddbf
Removing intermediate container 1715fffeddbf
 ---> a4d67251229a
Successfully built a4d67251229a
Successfully tagged nginx:v3
[root@avatar mynginx]# docker image ls
REPOSITORY               TAG       IMAGE ID       CREATED          SIZE
nginx                    v3        a4d67251229a   6 minutes ago    141MB
nginx                    v2        4d42a904c1bf   31 minutes ago   141MB
nginx                    latest    ea335eea17ab   20 hours ago     141MB
wurstmeister/kafka       latest    11142da99906   6 weeks ago      505MB
hello-world              latest    feb5d9fea6a5   7 weeks ago      13.3kB
wurstmeister/zookeeper   latest    3f43f72cb283   2 years ago      510MB
```

#### 保存镜像

```shell
 docker save <镜像> -o <文件名>
```

- 将镜像保存为文件
- 进行压缩：

```shell
docker save alpine | gzip > alpine-latest.tar.gz
```

#### 加载镜像

```shell
docker load -i <文件名>
```

- 从文件加载镜像
- 将镜像从一台机器迁移到另一台机器，并显示进度

```shell
docker save <镜像名> | bzip2 | pv | ssh <用户名>@<主机名> 'cat | docker load'
```

### 容器命令

#### 新建并启动容器

```shell
docker run
```

- 参数：
  - -t：分配一个伪终端并绑定到容器的标准输入上
  - -i：让容器的标准输入保持打开
  - -d：后台运行
    - 查看输出信息：docker container logs
- -p：映射端口
    - hostPort:containerPort
  
- 过程：
  1. 检查本地是否存在指定的镜像，不存在就从公有仓库下载
  2. 利用镜像创建并启动一个容器
  3. 分配一个文件系统，并在只读的镜像层外面挂载一层可读写层
  4. 从宿主主机配置的网桥接口中桥接一个虚拟接口到容器中去
  5. 从地址池配置一个 ip 地址给容器
  6. 执行用户指定的应用程序
  7. 执行完毕后容器被终止

#### 查看端口映射

```shell
docker port
```

#### 启动已终止容器

```shell
docker container start
```

#### 终止容器

```shell
docker container stop
```

#### 重启容器

```shell
docker container restart
```

#### 查看容器

```shell
docker ps
```

```shell
docker container ls
```

- -a：显示终止状态的容器

#### 进入容器

```shell
docker exec
```

- 若使用docker attach，exit后容器停止
- bash进入命令行
- 参数：
  - -t：分配一个伪终端并绑定到容器的标准输入上
  - -i：让容器的标准输入保持打开
  - -d：后台运行

#### 导出容器

```shell
docker export
```

#### 导入容器

```shell
docker import
```

- docker import：导入容器快照到本地镜像库，容器快照文件仅保存容器当时快照状态，无历史记录和元数据信息，可以重新指定标签等元数据信息。
- docker load：导入镜像存储文件到本地镜像库，保存完整记录，体积较大。

#### 删除容器

```shell
docker container rm 
```

#### 清理终止状态容器

```shell
docker container prune
```

#### 上传到容器
```shell
docker cp [本地路径] <容器ID或容器名>:[容器路径]
```

#### 查看每个容器占用空间
```shell
docker system df -v
```
### 仓库命令

#### 登录仓库

```shell
docker login
```

#### 查找镜像

```shell
docker search
```

#### 拉取镜像

```shell
docker pull
```

#### 推送镜像

- 标记本地镜像

```shell
docker tag ubuntu:18.04 username/ubuntu:18.04
```

- 推送镜像

```shell
docker push username/ubuntu:18.04
```