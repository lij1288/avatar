## **Docker环境变量失效问题处理**

### 问题记录

- 环境变量在重新进入命令行时会失效，环境变量是配置在~/.bash_profile，在.bashrc中添加source ~/.bash_profile仍无法解决

### 解决过程

- 将环境变量设置在/etc/profile

- 修改.bashrc文件添加source /etc/profile
- vi  ~/.bashrc

```bash
# .bashrc

# User specific aliases and functions

alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Source global definitions
if [ -f /etc/bashrc ]; then
        . /etc/bashrc
source /etc/profile
fi
```