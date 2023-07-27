## **MySQL锁表问题处理**

- 查询是否锁表

  > show open tables where in_use>0

- 查询对应进程

  > show processlist

- 关闭对应进程

  > kill id