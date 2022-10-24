## **Node环境安装记录**

### 下载并解压安装包

- 下载地址：https://nodejs.org/en/download/

> tar -Jxvf node-v16.14.2-linux-x64.tar.xz

### 配置环境变量

- 编辑~/.bash_profile在末尾添加

```
export PATH=$PATH:/opt/app/node-v16.14.2-linux-x64/bin
```

- 使环境变量生效

> source ~/.bash_profile

### 验证安装

> node -v

> npm version

> npx -v