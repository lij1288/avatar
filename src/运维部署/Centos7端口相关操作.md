## **Centos7端口相关操作**

### 查看防火墙状态

> systemctl status firewalld

### 启动防火墙

> systemctl start firewalld

### 停止防火墙

> systemctl stop firewalld

### 禁止防火墙开机启动

> systemctl disable firewalld

### 永久开放端口

> firewall-cmd --add-port=3306/tcp --permanent

### 移除端口

> firewall-cmd --permanent --remove-port=3306/tcp

### 重新加载防火墙规则

> firewall-cmd --reload

### 查看已开放端口

> firewall-cmd --zone=public --list-ports

### 查看端口是否开放

> firewall-cmd --query-port=3306/tcp