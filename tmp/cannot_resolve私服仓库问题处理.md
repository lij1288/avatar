## **cannot resolve私服仓库问题处理**

- 修改maven配置文件

```xml
    <profile>
        <id>nexusProfile</id>
        <repositories>
            <repository>
                <id>nexus</id>
                <name>nexus</name>
                <url>https://********（公司私服仓库）</url>
                <releases>
                    <enabled>true</enabled>
                </releases>
                <snapshots>
                    <enabled>true</enabled>
                </snapshots>
            </repository>
        </repositories>
    </profile>
```

```xml
  <activeProfiles>
    <activeProfile>nexusProfile</activeProfile>
  </activeProfiles>
```

- 重新构建项目
  - clean + installl