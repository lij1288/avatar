## **Centos7安装配置记录**

### 虚机创建

1. 主页 -> 创建新的虚拟机
2. 您希望使用什么类型的配置？ -> 自定义（高级）
3. 选择虚拟机硬件兼容性 -> Workstation 16.x
4. 安装客户机操作系统 -> 稍后安装操作系统
5. 选择客户机操作系统 -> Linux
6. 命名虚拟机 -> 自定义
7. 处理器配置 -> 自定义
8. 此虚拟机的内存 -> 自定义
9. 网络类型 -> 使用网络地址转换(NAT)
10. 选择I/O控制器类型 -> LSI Logic
11. 选择磁盘类型 -> SCSI
12. 选择磁盘 -> 创建新虚拟磁盘
13. 指定磁盘容量 -> 20 / 将虚拟磁盘拆分成多个文件
14. 指定磁盘文件 -> 默认
15. 已准备好创建虚拟机 -> 完成

### 网络配置

#### 虚拟交换机配置

1. 编辑 -> 虚拟网络编辑器 -> 更改设置 -> 选中VMnet8
   - 子网IP：192.168.1.0
2. NAT设置
   - 网关IP：192.168.1.99

#### Windows配置

1. 网络和Internet设置 -> 更改适配器选项 -> VMnet8 -> 右键属性
2. Internet协议版本4(TCP/IPv4) -> 使用下面的IP地址
   - IP地址：192.168.1.100
   - 子网掩码：255.255.255.0
   - 默认网关：192.168.1.99

### 系统安装
#### 下载地址
http://isoredirect.centos.org/centos/7/isos/x86_64/
#### CentOS7安装

1. 编辑虚拟机设置 -> CD/DVD -> 使用ISO映像文件 -> CentOS-7-x86_64-Everything-2003.iso
2. 开启此虚拟机
3. Install CentOS 7
4. 您在安装过程中想使用哪种语言？-> 中文
5. 日期&时间 -> 亚洲 -> 上海
6. 键盘布局 -> 汉语
7. 语言支持 ->中文
8. 安装源 -> 自动检测到的安装介质
9. 软件选择 -> GNOME桌面
10. 安装目标位置 -> 自动配置分区
11. KDUMP -> 启用kdump -> 为Kdump保留的内存：自动
12. 网络和主机名 -> 

    - 配置 -> IPv4设置 
      - 地址：192.168.1.101
      - 子网掩码：255.255.255.0
      - 网关：192.168.1.99
      - 附加DNS服务器：192.168.1.99
    - 配置 -> 常规
      - 可用时自动链接到这个网络
      - 所有用户都可以连接这个网络

    - 以太网 -> 打开
    - 主机名 -> 自定义
13. 开始安装
14. ROOT密码
15. 重启
16. 许可信息 -> 我同意许可协议
17. 初始设置 -> 完成配置

#### 查看jdk版本

```
[root@avatar ~]# java -version
openjdk version "1.8.0_242"
OpenJDK Runtime Environment (build 1.8.0_242-b08)
OpenJDK 64-Bit Server VM (build 25.242-b08, mixed mode)
```

#### 查看ssh状态

```
[root@avatar ~]# service sshd status
Redirecting to /bin/systemctl status sshd.service
● sshd.service - OpenSSH server daemon
   Loaded: loaded (/usr/lib/systemd/system/sshd.service; enabled; vendor preset: enabled)
   Active: active (running) since 二 2021-11-02 13:20:48 CST; 2min 9s ago
     Docs: man:sshd(8)
           man:sshd_config(5)
 Main PID: 1218 (sshd)
    Tasks: 1
   CGroup: /system.slice/sshd.service
           └─1218 /usr/sbin/sshd -D

11月 02 13:20:48 avatar systemd[1]: Starting OpenSSH server daemon...
11月 02 13:20:48 avatar sshd[1218]: Server listening on 0.0.0.0 port 22.
11月 02 13:20:48 avatar sshd[1218]: Server listening on :: port 22.
11月 02 13:20:48 avatar systemd[1]: Started OpenSSH server daemon.
```

#### 时间同步

> ntpdate 0.asia.pool.ntp.org

#### 防火墙设置

- 查看防火墙状态

> systemctl status firewalld

- 停止防火墙

> systemctl stop firewalld

- 禁止防火墙开机启动

> systemctl disable firewalld

```
[root@avatar ~]# firewall-cmd --state
running
[root@avatar ~]# systemctl stop firewalld.service
[root@avatar ~]# firewall-cmd --state
not running
[root@avatar ~]# systemctl disable firewalld.service
Removed symlink /etc/systemd/system/multi-user.target.wants/firewalld.service.
Removed symlink /etc/systemd/system/dbus-org.fedoraproject.FirewallD1.service.
```