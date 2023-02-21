## **Python的ModuleNotFoundError: No module named '_ctypes'问题处理**

### 问题记录

- 安装模块报错

> Python ModuleNotFoundError: No module named '_ctypes'

### 解决过程1

> pip3 install --upgrade pip

### 解决过程2

> yum install libffi-devel

> cd Python-3.8.3

> make && make install