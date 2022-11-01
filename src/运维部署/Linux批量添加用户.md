## **Linux批量添加用户**

### 编辑用户和密码文件

- user.txt

```
bjz_601::601:601:user:/home/sftp_user/bjz_601:/bin/bash
bjz_602::602:602:user:/home/sftp_user/bjz_602:/bin/bash
bsz_603::603:603:user:/home/sftp_user/bsz_603:/bin/bash
ctlz_604::604:604:user:/home/sftp_user/ctlz_604:/bin/bash
cfyz_605::605:605:user:/home/sftp_user/cfyz_605:/bin/bash
deyz_606::606:606:user:/home/sftp_user/deyz_606:/bin/bash
dsgz_607::607:607:user:/home/sftp_user/dsgz_607:/bin/bash
dzgzz_608::608:608:user:/home/sftp_user/dzgzz_608:/bin/bash
gzz_609::609:609:user:/home/sftp_user/gzz_609:/bin/bash
hjyz_610::610:610:user:/home/sftp_user/hjyz_610:/bin/bash
```

- passwd.txt

```
bjz_601:Unidata601.
bjz_602:Unidata602.
bsz_603:Unidata603.
ctlz_604:Unidata604.
cfyz_605:Unidata605.
deyz_606:Unidata606.
dsgz_607:Unidata607.
dzgzz_608:Unidata608.
gzz_609:Unidata609.
hjyz_610:Unidata610.
```

### 创建用户

> newusers < user.txt

### 查看创建结果

> cat /etc/passwd

### 关闭用户的投影密码

- 将密码从shadow文件存到passwd文件

> pwunconv

### 导入密码

> chpasswd < passwd.txt

### 开启用户的投影密码

- 将密码从passwd文件存到shadow文件

> pwconv