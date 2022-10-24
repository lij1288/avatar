## **Windows版MySQL5.7.30安装记录**

### 下载并解压安装包

- https://downloads.mysql.com/archives/community/

### 配置环境变量

- Path添加D:\Develop\mysql-5.7.30-winx64\bin

### 创建配置文件

- 在D:\Develop\mysql-5.7.30-winx64下新建my.ini

```ini
[mysqld]
#端口号
port=3306
#mysql路径
basedir=D:\Develop\mysql-5.7.30-winx64
#mysqldata
datadir=D:\Develop\mysql-5.7.30-winx64\data 
#最大连接数
max_connections=2000
#编码
character-set-server=utf8

default-storage-engine=INNODB

sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES

[mysql]
#编码
default-character-set=utf8
```

### 安装MySQL

- 以管理员身份运行CMD

- 安装命令

  > mysqld -install

- 初始化命令

  > mysqld --initialize

- 启动服务

  > net start mysql

- 登录，初始密码在D:\Develop\mysql-5.7.30-winx64\data下的err文件中

  > mysql -uroot -p

- 修改密码

```sql
alter user user() identified by "******";
```

### 不使用初始密码修改密码

- 在服务关闭状态下运行

  > mysqld --skip-grant-tables

- 保持窗口打开，直接使用回车登录

  > mysql -u root -p

- 修改密码

```sql
use mysql;
update user set authentication_string=password(“******”) where user=“root”
flush privileges;
```

## 提示找不到msvcr120.dll和msvcp120.dll问题处理

### 解决过程

- 将C:\Program Files\Common Files\microsoft shared\ClickToRun下的msvcr120.dll和msvcp120.dll复制到MySQL的bin目录下