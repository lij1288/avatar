## **Django启动项目一直Performing system checks问题处理**

### 问题记录

- 启动Django项目一直显示Performing system checks

> Watching for file changes with StatReloader
> Performing system checks...

### 解决过程

- 其中一个应用使用到的Neo4j所在服务器未启动，启动该服务器后解决