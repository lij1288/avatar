

## **Windows版Maven安装配置记录**

### 下载解压安装包

- https://dlcdn.apache.org/maven/

### 创建并设置本地仓库

- 修改conf/settings.xml

```xml
<!-- localRepository
 | The path to the local repository maven will use to store artifacts.
 |
 | Default: ${user.home}/.m2/repository
<localRepository>/path/to/local/repo</localRepository>
-->
<localRepository>D:/Develop/maven-repository</localRepository>
```

### 配置镜像源

- 修改conf/settings.xml

```xml
<!-- mirror
 | Specifies a repository mirror site to use instead of a given repository. The repository that
 | this mirror serves has an ID that matches the mirrorOf element of this mirror. IDs are used
 | for inheritance and direct lookup purposes, and must be unique across the set of mirrors.
 |
<mirror>
  <id>mirrorId</id>
  <mirrorOf>repositoryId</mirrorOf>
  <name>Human Readable Name for this Mirror.</name>
  <url>http://my.repository.com/repo/path</url>
</mirror>
-->
<mirror>
  <id>alimaven</id>
  <mirrorOf>central</mirrorOf>
  <name>aliyun maven</name>
  <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
</mirror>
```

### 配置环境变量

- D:\Develop\apache-maven-3.6.3\bin

### 查看安装结果


> mvn -v