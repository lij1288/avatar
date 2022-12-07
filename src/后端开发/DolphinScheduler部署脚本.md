## **DolphinScheduler部署脚本**

```shell
#!/bin/bash

# 配置免密登录
# ssh-keygen
# ssh-copy-id loalhost

# 定义变量
MYSQL_HOSTNAME="192.168.1.101"
MYSQL_PORT="3306"
MYSQL_USERNAME="root"
MYSQL_PASSWORD="********"
JAVA_HOME="/opt/app/jdk1.8.0_202"

# 创建数据库
create_db_sql="CREATE DATABASE dolphinscheduler DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;"
mysql -h${MYSQL_HOSTNAME} -P${MYSQL_PORT} -u${MYSQL_USERNAME} -p${MYSQL_PASSWORD} -e "${create_db_sql}"

# 修改配置文件
cat apache-dolphinscheduler-3.0.1-bin/bin/env/dolphinscheduler_env.sh | sed -i "s#java_home#$JAVA_HOME#g" apache-dolphinscheduler-3.0.1-bin/bin/env/dolphinscheduler_env.sh
cat apache-dolphinscheduler-3.0.1-bin/bin/env/dolphinscheduler_env.sh | sed -i "s#mysql_hostname#$MYSQL_HOSTNAME#g" apache-dolphinscheduler-3.0.1-bin/bin/env/dolphinscheduler_env.sh
cat apache-dolphinscheduler-3.0.1-bin/bin/env/dolphinscheduler_env.sh | sed -i "s#mysql_port#$MYSQL_PORT#g" apache-dolphinscheduler-3.0.1-bin/bin/env/dolphinscheduler_env.sh
cat apache-dolphinscheduler-3.0.1-bin/bin/env/dolphinscheduler_env.sh | sed -i "s#mysql_username#$MYSQL_USERNAME#g" apache-dolphinscheduler-3.0.1-bin/bin/env/dolphinscheduler_env.sh
cat apache-dolphinscheduler-3.0.1-bin/bin/env/dolphinscheduler_env.sh | sed -i "s#mysql_password#$MYSQL_PASSWORD#g" apache-dolphinscheduler-3.0.1-bin/bin/env/dolphinscheduler_env.sh

# 启动zk
mkdir -p /opt/data/zookeeper
zookeeper-3.4.6/bin/zkServer.sh start

# 初始化数据库
bash apache-dolphinscheduler-3.0.1-bin/tools/bin/upgrade-schema.sh

# 启动ds
bash apache-dolphinscheduler-3.0.1-bin/bin/install.sh

# 登录ds
# http://localhost:12345/dolphinscheduler/ui admin/dolphinscheduler123
```

