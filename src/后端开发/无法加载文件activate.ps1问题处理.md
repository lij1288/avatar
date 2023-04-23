## **无法加载文件activate.ps1问题处理**

### 问题记录

- PyCharm报错

> 无法加载文件 D:\Develop\PycharmProjects\Workspace\venv\Scripts\activate.ps1，因为在此系统上禁止运行脚本

### 解决过程

- 以管理员身份运行PowerShell

> Set-ExecutionPolicy RemoteSigned

![](assets\无法加载文件activate.ps1问题处理\ExecutionPolicy.jpg)

- Restricted
  - 不加载配置文件或运行脚本， Windows 客户端计算机的默认执行策略
- RemoteSigned
  - 要求从 Internet 下载的所有脚本和配置文件都由受信任的发布者签名，Windows Server 计算机的默认执行策略