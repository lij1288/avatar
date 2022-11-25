## **Docker的实验特性开启**

### 编辑~/.docker/config.json

- 开启Docker CLI的实验特性

- 新增条目

```json
{
    "experimental": "enabled"
}
```

```
[root@avatar ~]# cat .docker/config.json
{
	"auths": {
		"https://index.docker.io/v1/": {
			"auth": "bGlqMTI4ODphc2RsajE5OTM="
		}
	},
	"experimental": "enabled"
}
```

- 注：config.json在login后生成

```
[root@avatar ~]# docker login
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username: lij1288
Password: 
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
[root@avatar ~]# cat .docker/config.json
{
	"auths": {
		"https://index.docker.io/v1/": {
			"auth": "bGlqMTI4ODphc2RsajE5OTM="
		}
	}
}
```

### 编辑/etc/docker/daemon.json

- 开启Dockerd的实验特性

- 新增条目

```json
{
    "experimental": true
}
```

```
[root@avatar ~]# cat /etc/docker/daemon.json
{
    "registry-mirrors": [
    "https://mirror.baidubce.com",
    "https://docker.mirrors.ustc.edu.cn/"
    ],
    "experimental": true
}
```

### 重新加载配置文件

> sudo systemctl daemon-reload

### 重启Docker

> sudo systemctl restart docker

### 验证开启结果

> docker info | grep Experimental

```
[root@avatar ~]# docker info | grep Experimental
 Experimental: true
```