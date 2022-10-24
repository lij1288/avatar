## **Sqoop对Oracle进行入库/回调**

### Oracle入库Hive

```shell
#!/bin/bash

cd `dirname $0`
pwd_dir=`pwd`

#获取目录名
sys_name=`basename ${pwd_dir}`
cd ..

#获取上一级目录，主要用途是日志文件路径
pwdnow=`pwd`
cd `dirname $0`
deal_day=$1

#定义变量
jdbc_dir=`grep ${sys_name}_jdbc     /e3base/ODS/DINF/SQOOPIMPORT/sqoopvar.cfg | cut -d '=' -f 2 `
use_name=`grep ${sys_name}_usename  /e3base/ODS/DINF/SQOOPIMPORT/sqoopvar.cfg | cut -d '=' -f 2`
passwd=`grep   ${sys_name}_passwd  /e3base/ODS/DINF/SQOOPIMPORT/sqoopvar.cfg | cut -d '=' -f 2`
###schema#table_name#hive_name#column_name#只需要修改这是个变量
schema=BD_VIEW
table_name=OFFER_INST
hive_name=inc_offer_inst_d
column_name=PARTITION_ID
m_cnt=8
###日志输出文件
logpath=${pwdnow}/logs/${hive_name}.${deal_day}

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
$beeline -u $jdbc_dir1 -n $use_name1 -p $passwd1 -e "
  use dinf;
  create external  table if not exists ${hive_name}(
		 DEAL_DAY            string     comment'处理日'
		,OFFER_INST_ID       BIGINT      comment  '记录销售品实例标识，主键。'
        ,OFFER_ID            BIGINT      comment  '记录套餐标志。餐，3-基础销售品，0-品牌类销售品'
        ,OFFER_TYPE          STRING      comment  '记录销售品标识归属的销售品类型，冗余存储。LOVB=OFF-0005'
        ,OWNER_CUST_ID       BIGINT      comment  '记录产权客户标识。'
        ,EFF_DATE            STRING      comment  '记录销售品实例具体的生效时间，不因销售品信息变更而改变。'
        ,EXP_DATE            STRING      comment  '记录销售品实例具体的失效时间，指同客户约定的协议失效时间。'
        ,OFFER_AGREE_ID      BIGINT      comment  '记录销售品协议项的标识，协议子域的外键。'
        ,CREATE_ORG_ID       BIGINT      comment  '记录实例创建的组织标识。'
        ,EXP_PROC_METHOD     STRING      comment  '记录套餐到期是否自动续约、自动退订，也可以由10000客户确认后自动退订改自动续约。LOVB=OFF-0008'
        ,LAN_ID              BIGINT      comment  '记录本地网标识。'
        ,REGION_ID           BIGINT      comment  '记录销售品实例所属的区域。指向公共管理区域标识'
        ,STATUS_CD           STRING      comment  '记录状态。LOVB=PRI-0004。'
        ,CREATE_STAFF        BIGINT      comment  '记录创建的员工。'
        ,UPDATE_STAFF        BIGINT      comment  '记录修改的员工。'
        ,CREATE_DATE         STRING      comment  '记录创建的时间。'
        ,STATUS_DATE         STRING      comment  '记录每次销售品信息变更的时间，保持时间的连续性。'
        ,UPDATE_DATE         STRING      comment  '记录修改的时间，可用于人工维护。'
        ,BUSI_MOD_DATE       STRING      comment  '记录销售品信息业务变更的时间，保持档案时间的连续性，手动维护或人工信息维护不需进历史表用修改时间表达，不用修改这个时间，由客户发起的要进历史表。'
        ,LAST_ORDER_ITEM_ID  BIGINT      comment  '记录上一次维护记录的订单项标识。'
        ,REMARK              STRING      comment  '记录备注信息。'
        ,EXT_OFFER_INST_ID   STRING      comment  '记录外部销售品实例标识'
        ,IS_INDEPENDENT      STRING      comment  '冗余销售品规格上的可独立订购标记，LOVB=OFF-C-0029'
        ,OUTER_OFFER_INST_ID BIGINT      comment  '外系统映射销售品实例标识'
)
  partitioned by (pt_d string comment '日分区')
  row format delimited fields terminated by '\\001'
  LOCATION 'hdfs:///ods/dinf/${sys_name}/${hive_name}'
" >$logpath 2>&1
$beeline -u $jdbc_dir1 -n $use_name1 -p $passwd1 -e "
  use dinf;
  alter table ${hive_name}   drop if exists partition (pt_d=${deal_day}) ;
  alter table ${hive_name}   add partition (pt_d=${deal_day}) LOCATION 'hdfs:///ods/dinf/${sys_name}/${hive_name}/${deal_day}';
" >$logpath 2>&1
$sqoop import --connect ${jdbc_dir}  --username ${use_name} --password ${passwd} --query "SELECT /*+parallel(a,8)*/
		${deal_day}     
		,OFFER_INST_ID
        ,OFFER_ID
        ,OFFER_TYPE
        ,OWNER_CUST_ID
        ,EFF_DATE
        ,EXP_DATE
        ,OFFER_AGREE_ID
        ,CREATE_ORG_ID
        ,EXP_PROC_METHOD
        ,LAN_ID
        ,REGION_ID
        ,STATUS_CD
        ,CREATE_STAFF
        ,UPDATE_STAFF
        ,CREATE_DATE
        ,STATUS_DATE
        ,UPDATE_DATE
        ,BUSI_MOD_DATE
        ,LAST_ORDER_ITEM_ID
        ,REMARK
        ,EXT_OFFER_INST_ID
        ,IS_INDEPENDENT
        ,OUTER_OFFER_INST_ID
		,PARTITION_ID from (select /*+parallel(a,8)*/ 
		${deal_day}     
		,OFFER_INST_ID
        ,OFFER_ID
        ,OFFER_TYPE
        ,OWNER_CUST_ID
        ,EFF_DATE
        ,EXP_DATE
        ,OFFER_AGREE_ID
        ,CREATE_ORG_ID
        ,EXP_PROC_METHOD
        ,LAN_ID
        ,REGION_ID
        ,STATUS_CD
        ,CREATE_STAFF
        ,UPDATE_STAFF
        ,CREATE_DATE
        ,STATUS_DATE
        ,UPDATE_DATE
        ,BUSI_MOD_DATE
        ,LAST_ORDER_ITEM_ID
        ,REMARK
        ,EXT_OFFER_INST_ID
        ,IS_INDEPENDENT
        ,OUTER_OFFER_INST_ID
		,mod(OFFER_INST_ID,8) as PARTITION_ID
from ${schema}.${table_name} ) t 
where  \$CONDITIONS"  --fields-terminated-by '\001' --lines-terminated-by '\n'  --m ${m_cnt} --split-by ${column_name} --target-dir /ods/dinf/${sys_name}/${hive_name}/${deal_day}  --delete-target-dir   --class-name ${hive_name} --outdir ${pwdnow}/logs --null-string '\\N' --null-non-string '\\N'  >>$logpath  2>&1
 if [ -n "`grep records.  $logpath`" ] ;then
	 if [ -n "`grep ERROR  $logpath`" ]; then
		 echo "ERROR:sqoopimport failed !"
	 else 
		 echo "Success"
	 fi
else
  echo 'ERROR:sqoopimport failed'
fi

```

### Hive回调Oracle

```shell
#!/bin/bash

cd `dirname $0`
pwd_dir=`pwd`
sys_name=`basename ${pwd_dir}`
cd ..
pwdnow=`pwd`
cd `dirname $0`

#定义变量
this_day=$1
this_mon=${this_day:0:6}
jdbc_dir=`grep ${sys_name}_jdbc     /e3base/ODS/EXPORT/sqoopvar.cfg | cut -d '=' -f 2`
use_name=`grep ${sys_name}_usename  /e3base/ODS/EXPORT/sqoopvar.cfg | cut -d '=' -f 2`
passwd=`grep   ${sys_name}_passwd   /e3base/ODS/EXPORT/sqoopvar.cfg | cut -d '=' -f 2`
#模板修改的地方
oracle_name=DD_PDT_OFFER_INST_D_V
hive_name=dd_pdt_offer_inst_d_${this_mon}
m_cnt=4
#日志输出文件
logpath=${pwdnow}/logs/${oracle_name}.${this_day}
#变量日志输出
echo ${deal_mon}       >$logpath 2>&1
echo ${jdbc_dir}      >>$logpath 2>&1
echo ${use_name}      >>$logpath 2>&1
echo ${passwd}        >>$logpath 2>&1
echo ${oracle_name}   >>$logpath 2>&1
echo ${hive_name}     >>$logpath 2>&1
echo ${m_cnt}         >>$logpath 2>&1
echo ${sys_name}      >>$logpath 2>&1

#命令绝对路径
hadoop=/e3base/hadoop/bin/hadoop
hive=/e3base/hive/bin/hive
sqoop=/e3base/sqoop/bin/sqoop
beeline=/e3base/hive/bin/beeline
jdbc_dir1=`grep beeline_jdbc     /e3base/ODS/DINF/SQOOPIMPORT/sqoopvar.cfg | cut -d '=' -f 2`
use_name1=`grep beeline_usename  /e3base/ODS/DINF/SQOOPIMPORT/sqoopvar.cfg | cut -d '=' -f 2`
passwd1=`grep beeline_passwd   /e3base/ODS/DINF/SQOOPIMPORT/sqoopvar.cfg | cut -d '=' -f 2`
$hadoop fs -rm -r /ods/test/${hive_name}
$beeline -u $jdbc_dir1 -n $use_name1 -p $passwd1 -e "
   use ${use_name};
   INSERT OVERWRITE DIRECTORY '/ods/test/${hive_name}'
      select DEAL_DAY
            ,OFFER_INST_ID
            ,OFFER_ID
            ,OFFER_TYPE
            ,OWNER_CUST_ID
            ,EFF_DATE
            ,EXP_DATE
            ,OFFER_AGREE_ID
            ,CREATE_ORG_ID
            ,EXP_PROC_METHOD
            ,LAN_ID
            ,REGION_ID
            ,STATUS_CD
            ,CREATE_STAFF
            ,UPDATE_STAFF
            ,CREATE_DATE
            ,STATUS_DATE
            ,UPDATE_DATE
            ,BUSI_MOD_DATE
            ,LAST_ORDER_ITEM_ID
            ,REMARK
            ,EXT_OFFER_INST_ID
            ,IS_INDEPENDENT
            ,OUTER_OFFER_INST_ID
      from  ${use_name}.${hive_name} where pt_d = '${this_day}'
" >>$logpath 2>&1
#if [ $? -eq 0 ] ;then
#       echo 'Success'
#else
#       echo 'ERROR:INSERT failed'z
#fi

$sqoop export  --connect ${jdbc_dir}  --username ${use_name} --password ${passwd} --table ${oracle_name} --num-mappers ${m_cnt} --export-dir /ods/test/${hive_name} --fields-terminated-by '\001' --lines-terminated-by '\n'  --input-null-string  '\\N' --input-null-non-string  '\\N'  --class-name ${oracle_name} --outdir ${pwdnow}/logs --input-null-string  'NULL' --input-null-non-string  'NULL'  >>$logpath 2>&1
 if [ -n "`grep records.  $logpath`" ] ;then
         if [ -n "`grep ERROR  $logpath`" ]; then
                 echo "ERROR:sqoopexport failed !"
                 echo "`grep ERROR  $logpath`"
         else
                 echo "Success"
         fi
else
  echo 'ERROR:sqoopexport failed'
fi
```

