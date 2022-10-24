## **Crontab定时任务设置**

- linux内置的cron进程可以实现定时任务功能
- crontab命令是cron table的简写，crontab文件是cron的配置文件，也叫作业列表
  - /var/spool/cron/ 存放的是每个用户包括root的crontab任务，每个任务以创建者的名字命名
  - /etc/crontab 负责调度各种管理和维护任务
  - /etc/cron.d/ 存放任何要执行的crontab文件或脚本
  - 可以把脚本放在/etc/cron.hourly、/etc/cron.daily、/etc/cron.weekly、/etc/cron.monthly目录中，每小时、天、星期、月执行一次

- 当安装完成操作系统之后，默认便会启动此任务调度命令
- crond命令每分钟会定期检查是否有要执行的工作，如果有要执行的工作便会自动执行该工作
- linux任务调度的工作分类：
  1. 系统执行的工作：系统周期性所要执行的工作，如备份系统数据、清理缓存
  2. 个人执行的工作：用户定期要做的工作，由每个用户自行设置

### Crontab语法

#### 命令语法

> crontab -u 设定某个用户的cron服务，一般root用户在执行这个命令的时候需要此参数
>
> crontab -l 列出某个用户cron服务的详细内容
>
> crontab -e 编辑某个用户的cron服务
>
> crontab -l 列出某个用户cron服务的详细内容

- root查看自己的cron设置

```shell
crontab -u root -l
```

- root想删除user1的cron设置

```shell
crontab -u user1 -r
```

- root编辑自己的cron设置

```shell
crontab -u root -e
```

#### 文件语法

>  分	小时	日	月	星期	命令

|  分  | 小时 |  日  |  月  | 星期 |  命令   |
| :--: | :--: | :--: | :--: | :--: | :-----: |
| 0-59 | 0-23 | 1-31 | 1-12 | 0-6  | command |

- 特殊符号的含义

| 符号 | 含义                           |
| :--: | :----------------------------- |
|  *   | 取值范围内的数字，表示任何时间 |
|  /   | 每                             |
|  -   | 从某个数字到某个数字           |
|  ,   | 分开几个离散的数字             |

### 任务调度文件

#### 设置方法

- 可用crontab -e命令来编辑，编辑的是/var/spool/cron下对应用户的cron文件，也可以直接修改/etc/crontab文件
- cron服务每分钟不仅要读一次/var/spool/cron内的所有文件，还需要读一次 /etc/crontab，用crontab配置是针对某个用户的，而编辑/etc/crontab是针对系统的任务

```shell
# cat /etc/crontab 
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root	#//如果出现错误，或者有数据输出，数据发给这个帐号
HOME=/	#使用者运行的路径，这里是根目录

# For details see man 4 crontabs

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name command to be executed
```

#### Demo

- crontab -e 

```shell
*/2 * * * * echo helloworld >> /tmp/test/crontab.txt
```



```shell
30	3	10,20	*	*	ls	#每月10号及20号的3:30执行ls命令

25	8-11	*	*	*	ls	#每天8-11点的第25分钟执行ls命令

*/15	*	*	*	*	ls	#每15分钟执行一次ls命令

30	7	*	*	*	root	run-parts	/etc/cron.daily	 
#每天7:50以root身份执行/etc/cron.daily目录中的所有可执行文件
```

