## **FTP安装部署及虚拟用户创建记录**

### 安装FTP

> yum -y install vsftpd ftp

### 修改配置文件

> vi /etc/vsftpd/vsftpd.conf

```shell
# 修改配置
local_enable=YES      # 允许本地用户模式，映射的系统用户为本地用户，此项必须开启
pam_service_name=vsftpd      # 指定pam认证文件，可修改 
anonymous_enable=NO      # 禁止匿名登录
listen=YES      # 允许IPV4独立监听
listen_ipv6=NO      # 禁止IPV6
# 新增配置
guest_enable=YES      # 开启虚拟用户模式
guest_username=FTP      # 指定虚拟用户账号映射到本地账号FTP
user_config_dir=/etc/vsftpd/vuser_conf      # 指定虚拟用户的权限配置目录
chroot_local_user=YES      # 限制用户在home目录中
allow_writeable_chroot=YES      # 允许写入home目录
reverse_lookup_enable=NO      #禁止进行dns反向解析，加快登录速度
```

### 创建虚拟用户文件

- 奇数行为用户名，偶数行为对应密码

> vi /etc/vsftpd/vuser

```
ftpuser_new
ftpuser_pwd
```

- 生产db文件

> db_load -T -t hash -f vuser vuser.db

### 修改支持虚拟用户的PAM认证文件

> find  / -name pam_userdb.so

```
/usr/lib64/security/pam_userdb.so
```

- 注释所有行，添加后两行

> vi /etc/pam.d/vsftpd

```shell
#%PAM-1.0
#session    optional     pam_keyinit.so    force revoke
#auth       required	pam_listfile.so item=user sense=deny file=/etc/vsftpd/ftpusers onerr=succeed
#auth       required	pam_shells.so
#auth       include	password-auth
#account    include	password-auth
#session    required     pam_loginuid.so
#session    include	password-auth
auth       required     /lib64/security/pam_userdb.so   db=/etc/vsftpd/vuser
account    required     /lib64/security/pam_userdb.so   db=/etc/vsftpd/vuser
```

### 创建虚拟用户的权限配置目录

>  mkdir /etc/vsftpd/vuser_conf

> vi /etc/vsftpd/vuser_conf/ftpuser_new

```
local_root=/home/ftpuser_new
anon_upload_enable=YES
anon_mkdir_write_enable=YES
anon_other_write_enable=YES
anon_umask=000
```

### 创建虚拟用户映射的系统用户

> useradd -s /sbin/nologin FTP

> cat /etc/passwd

### 创建虚拟用户的根目录

> mkdir /home/ftpuser_new

> chown -R FTP:FTP /home/ftpuser_new

### 重启服务

> systemctl restart vsftpd