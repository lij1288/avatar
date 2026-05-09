## **SSH免密登录设置**

- 生成密钥

> ssh-keygen

> Generating public/private rsa key pair.
>
> Enter file in which to save the key (/root/.ssh/id_rsa): [Enter]
>
> Enter passphrase (empty for no passphrase): [Enter]
>
> Enter same passphrase again: [Enter]

- 复制公钥
  - 本机也需要复制

> ssh-copy-id 192.168.1.101

> root@192.168.1.101's password: 

> ssh-copy-id 192.168.1.102

> root@192.168.1.102's password: 

> ssh-copy-id 192.168.1.103

> root@192.168.1.103's password: 

- 生成密钥指定密钥类型和长度

> ssh-keygen -t rsa -b 4096

- 复制公钥指定端口号

> ssh-copy-id -p 28822 root@your-server-ip

## 问题处理记录

- 配置免密登录后仍无法登录
  - 检查/etc/ssh/sshd_config最下面有一行AuthenticationMethods password，进行注释后重启sshd服务，重新配置免密登录解决问题