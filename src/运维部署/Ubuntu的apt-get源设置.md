## **Ubuntu的apt-get源设置**

### 备份配置文件

> sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak

### 修改配置文件

> vi /etc/apt/sources.list

```shell
deb http://mirrors.aliyun.com/ubuntu/ precise main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ precise-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ precise-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ precise-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ precise-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ precise main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ precise-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ precise-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ precise-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ precise-backports main restricted universe multiverse
```

### 刷新源列表

> sudo apt-get update

### 报错问题处理

- Certificate verification failed: The certificate is NOT trusted. The certificate chain uses expired certificate.  Could not handshake: Error in the certificate verification. [IP: 101.6.15.130 443]

  > vi  /etc/apt/apt.conf.d/99verify-peer.conf 

  ```
  Acquire { https::Verify-Peer false }
  ```

- 由于没有公钥，无法验证下列签名： NO_PUBKEY 3B4FE6ACC0B21F32

  > sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3B4FE6ACC0B21F32

- 无法修正错误，因为您要求某些软件包保持现状，就是它们破坏了软件包间的依赖关系
  - 安装被依赖的软件包，卸载版本不符合的被依赖的软件包