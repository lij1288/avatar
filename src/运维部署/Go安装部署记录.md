## **Go安装部署记录**

### 解压安装包

> rm -rf /usr/local/go && tar -C /usr/local -zxvf go1.19.5.linux-amd64.tar.gz

### 修改配置文件

> vi /etc/profile

```
export PATH=$PATH:/usr/local/go/bin
```

### 验证安装

> go version