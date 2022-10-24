## **Eclipse相关操作**

### 快捷键

| 快捷键                            | 说明                                 |
| :-------------------------------- | :----------------------------------- |
| Ctrl+1                            | 快速修复                             |
| Alt+/                             | 内容辅助                             |
| Ctrl+D                            | 删除当前行                           |
| Ctrl+Backspace                    | 按单词删除                           |
| Ctrl+←                            | 光标移到左边单词开头                 |
| Ctrl+→                            | 光标移到右边单词末尾                 |
| Shift+Enter                       | 向下插入空行                         |
| Ctrl+Shift+Enter                  | 向上插入空行                         |
| Ctrl+Alt+↑/↓                      | 向上/下复制                          |
| Alt+↑/↓                           | 向上/下移动                          |
| Alt+←/→                           | 上/下一个编辑页面                    |
| Ctrl+Shift+F                      | 格式化                               |
| Ctrl+Shift+O                      | 组织导入                             |
| Ctrl+Shift+T                      | 搜索类 (包括工程和关联的第三方jar包) |
| Ctrl+M                            | 切换最大化                           |
| Ctrl+O                            | 快速显示OutLine                      |
| Ctrl+T                            | 快速显示继承结构                     |
| Ctrl+L                            | 转至行                               |
| Ctrl+Q                            | 上一个编辑位置                       |
| Ctrl+W                            | 关闭当前                             |
| Ctrl+Shift+F4                     | 关闭所有                             |
| Ctrl+/                            | 单行注释                             |
| Ctrl+Shift+/                      | 多行注释                             |
| Alt+Shift+J                       | 文档注释                             |
| Alt+Shift+R                       | 重命名                               |
| Alt+Shift+M                       | 抽取方法                             |
| Alt+Shift+L                       | 抽取变量                             |
| Ctrl+R                            | Debug运行至行                        |
| F5                                | 跳入方法                             |
| F6                                | 逐行调试                             |
| F7                                | 跳出方法                             |
| F8                                | 跳到下一断点                         |
| Alt+Shift+S -> C                  | 无参构造                             |
| Alt+Shift+S -> O                  | 有参构造                             |
| Alt+Shift+S -> R -> Tab -> A -> R | get, set方法                         |
| Alt+Shift+S -> H -> Tab -> G      | hasCode, equals                      |
| Alt+Shift+S -> S -> Tab -> G      | toString                             |

### 修改快捷键

Window -> Preferences -> General -> Keys

### 字体设置

Window -> Preferences -> General -> Appearance -> Colors And Fonts -> Basic -> Text Font

### 重置窗口

Window -> Reset Perspective

### 工作空间

Window -> Preferences -> General -> workspace -> Text file encoding UTF-8

### 导入导出

导出：选中工程，Ctrl+c，复制到要存放的地方
导入：Import->General->Existing Project into Workspace->选择你要导入的工程->勾选Copy projects into workspace

### 显示占位符

windows -> Preferences -> General -> Editors -> Text Editors -> Show whitespace characters

### 修改作者

 Window -> Preference -> Java -> Code Style -> Code Templates 在右侧选择Comments,将其中的Types项，然后选右边的"Edit"

### 导出jar包

- JAR file  仅仅是 a library of Java code, 在运行时需要在命令行下指定main class

  > java -cp .;myClass.jar packname.mainclassname    

- Runnable JAR file 包含了一个main class的声明文件，在运行时就知道该call哪个类

  > java -jar myClass.jar

### 引入jar包目录

项目右键 -> Build Path -> Add Libraries -> User Library 

User Libraries -> New -> Add External JARs -> Apply -> Finish

### 配置源码文件来源

Attach Source -> External location -> External File -> src.zip -> OK

### Maven导出包含依赖的jar包

- pom.xml添加插件

```xml
	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<version>3.5.1</version>
				<configuration>
					<source>1.8</source>
					<target>1.8</target>
				</configuration>
			</plugin>
            
			<plugin>
				<artifactId>maven-assembly-plugin</artifactId>
				<configuration>
					<!-- get all project dependencies -->
					<descriptorRefs>
						<descriptorRef>jar-with-dependencies</descriptorRef>
					</descriptorRefs>
					<!-- MainClass in mainfest make a executable jar -->
					<archive>
						<manifest>
							<!--<mainClass>util.Microseer</mainClass> -->
						</manifest>
					</archive>

				</configuration>
				<executions>
					<execution>
						<id>make-assembly</id>
						<!-- bind to the packaging phase -->
						<phase>package</phase>
						<goals>
							<goal>single</goal>
						</goals>
					</execution>
				</executions>
			</plugin>

		</plugins>
	</build>
```

- 项目右键 -> Run As -> Maven build...
- Goals -> package -> Apply -> Run