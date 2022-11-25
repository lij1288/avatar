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