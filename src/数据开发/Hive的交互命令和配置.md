## **Hive的交互命令和配置**

### 1. 常用命令

#### 1.1 -e 不进入hive交互窗口执行sql语句

- 命令行执行sql意义: 放入shell脚本

> bin/hive -e "select * from demo"

#### 1.2 -f 执行文件中的sql语句

> bin/hive -f /tmp/demo.sql

#### 1.3 传参

> --hiveconf 设置配置参数
>
> --hivevar 设置参数，key=value，使用${key}

### 2. 其他命令

#### 2.1 退出hive交互窗口

> exit;

> quit;

#### 2.2 在hive cli交互命令窗口中操作hdfs文件系统

> dfs -ls /
>
> dfs -rm -r /demo

#### 2.3 在hive cli交互命令窗口中查看本地文件系统（beeline不支持）

> !ls /tmp/demo

#### 2.4 查看在hive交互窗口输入的历史命令

- 进入当前用户的根目录/root或/home/xuser
- 查看.hivehistory文件

> cat .hivehistory

### 3. 常见属性配置

#### 3.1 Hive数据仓库位置配置

- default数据仓库最原始位置是在HDFS的/user/hive/warehouse路径下
- 在仓库目录下，没有对默认的数据库default创建文件夹，如果某张表属于default数据库，直接在数据仓库目录下创建一个文件夹
- 配置hive-site.xml的hive.metastore.warehouse.dir来修改位置

#### 3.2 信息显示设置

- 显示当前数据库，配置hive-site.xml的hive.cli.print.current.db为true

- 查询结果显示表头信息，配置hive-site.xml的hive.cli.print.header为true

#### 3.3 运行日志存储目录配置

- 默认存放在/tmp/root/hive.log目录下
- 复制/opt/module/hive/conf/hive-log4j.properties.template为hive-log4j.properties
- 在hive-log4j.properties中修改hive.log.dir=/opt/app/hive/logs

#### 3.4 参数配置

##### 3.4.1 查看当前所有配置信息

> set;

##### 3.4.5 参数设置方式

- 优先级依次增加，系统级参数如log4j设定必须使用前两种，因为参数读取在会话建立前完成

###### 1> 配置文件

- 默认配置文件：hive-default.xml
- 用户自定义配置文件：hive-site.xml
- Hive会读入hadoop的配置，因为Hive是作为Hadoop的客户端启动，Hive的配置会覆盖Hadoop的配置

###### 2> 命令行

- 启动Hive时，设定参数

> bin/hive -hiveconf mapred.reduce.tasks=5;

###### 3> HQL

- 在HQL中使用set设置参数

> set mapred.reduce.tasks=5;
>
> set hive.exec.mode.local.auto=true;