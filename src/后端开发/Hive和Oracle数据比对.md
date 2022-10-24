## **Hive和Oracle数据比对**

```shell
#!/bin/bash

cd `dirname $0`
pwd_dir=`pwd`

#获取目录名
sys_name=`basename ${pwd_dir}`
cd ..

#获取上一级目录（日志文件路径）
pwdnow=`pwd`
cd `dirname $0`
#20200107
deal_day=$1 
deal_mon=${deal_day:0:6}
#deal_day=${deal_hour:0:8}
#deal_hh=${deal_hour:8:2}
acct_mon=${deal_day:2:4}
deal_dd=${deal_day:6:2}

#定义变量
jdbc_dir=`grep ${sys_name}_jdbc     /e3base/ODS/DINF/SQOOPIMPORT/sqoopvar.cfg | cut -d '=' -f 2 `
use_name=`grep ${sys_name}_usename  /e3base/ODS/DINF/SQOOPIMPORT/sqoopvar.cfg | cut -d '=' -f 2`
passwd=`grep   ${sys_name}_passwd  /e3base/ODS/DINF/SQOOPIMPORT/sqoopvar.cfg | cut -d '=' -f 2`
###schema#table_name#hive_name
schema=BILLDETAIL
table_name=MOBILE_VALUE_EVENT_1${acct_mon}
hive_name=dd_bll_ic_d_${deal_mon}
###日志输出文件
logpath=${pwdnow}/logs/dd_bll_ic_d_check.${deal_day}

#变量输出日志
echo ${deal_day}       >$logpath 2>&1
echo ${sys_name}      >>$logpath 2>&1
echo ${jdbc_dir}      >>$logpath 2>&1
echo ${use_name}      >>$logpath 2>&1
echo ${passwd}        >>$logpath 2>&1
echo ${schema}        >>$logpath 2>&1
echo ${table_name}    >>$logpath 2>&1
echo ${hive_name}     >>$logpath 2>&1
echo ${column_name}   >>$logpath 2>&1
##命令绝对路径
hadoop=/e3base/hadoop/bin/hadoop
hive=/e3base/hive/bin/hive
sqoop=/e3base/sqoop/bin/sqoop
beeline=/e3base/hive/bin/beeline
jdbc_dir1=`grep beeline_jdbc     /e3base/ODS/DINF/SQOOPIMPORT/sqoopvar.cfg | cut -d '=' -f 2`
use_name1=`grep beeline_usename  /e3base/ODS/DINF/SQOOPIMPORT/sqoopvar.cfg | cut -d '=' -f 2`
passwd1=`grep beeline_passwd   /e3base/ODS/DINF/SQOOPIMPORT/sqoopvar.cfg | cut -d '=' -f 2`
result2=`$beeline -u $jdbc_dir1 -n $use_name1 -p $passwd1 -e " select count(*) from ddwd.${hive_name} where pt_d='${deal_day}'" | tail -n 2  | awk 'NR==1{print}' | awk '{print $2}'`
echo ${result2}
result1=`$sqoop eval --connect jdbc:oracle:thin:@136.64.196.60:1521:tjhjdb2 --username ods --password TK_20x#9 --query "select  /*+parallel(t,8)*/ count(*) from ${schema}.${table_name} PARTITION(p${deal_dd}) t where to_char(t.STATE_DATE,'YYYYMMDD')=${deal_day}" | tail -n 2  | awk 'NR==1{print}' | awk '{print $2}'`
echo ${result1}
result=$((result2*100/result1))
if [  ${deal_day} = ${deal_mon}01  ];then 
	if [  ${result} -ne 100  ];then
		echo "ERROR数据不一致"
	else 
		echo "Success"
	fi
elif [  ${result} -gt 50  ];then
		echo "Success"
	else
		echo "ERROR数据不一致"
fi
```

