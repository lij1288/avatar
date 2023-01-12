## **Maven安装配置记录**

### 上传解压安装包

- https://dlcdn.apache.org/maven/

> tar -zxvf apache-maven-3.6.3-bin.tar.gz

### 配置镜像源

> vi cong/settings.xml

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

> vi /etc/profile

```shell
export MAVEN_HOME=/opt/app/apache-maven-3.6.3
export PATH=$PATH:$MAVEN_HOME/bin
```

> source /etc/profile

### 验证安装

> mvn -v