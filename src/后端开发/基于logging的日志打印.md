## **基于logging的日志打印**

```python
from sqlalchemy import create_engine
from urllib.parse import quote_plus
import pymysql
import logging

host = '********'
user = '********'
psd = '********'
database = '********'

conn_str = ('mysql+pymysql://' + user + ':%s@' + host + ':3306/' + database + '?charset=utf8') % quote_plus(psd)
conn = create_engine(conn_str, echo=True)

logging.basicConfig(handlers=[logging.FileHandler("water_process.log", encoding="utf-8")], level=logging.INFO, format='%(asctime)s %(message)s')

# 插入原始数据
logging.info('--------插入原始数据--------')
try:
    sql = f"""
        insert into tmp (jd,wd,stnm,source,status,type) select LGTD,LTTD,PUMP_NAME,'att_pump_base',status,'2' from att_pump_base where status=0;
        """
    conn.execute(sql)
    sql = f"""
        insert into tmp (stcd,jd,wd,stnm,source,status,type) select stcd,lgtd,lttd,stnm,'att_st_base',status,'1' from att_st_base where status=0;
        """
    conn.execute(sql)
    sql = f"""
        insert into tmp (stcd,jd,wd,stnm,source,status,type) select stcd,lgtd,lttd,stnm,'att_sz_base',status,'1' from att_sz_base where status=0;
        """
    conn.execute(sql)
    sql = f"""
        insert into tmp (jd,wd,stnm,source,status,type) select LGTD,LTTD,WAGA_NAME,'att_waga_base',status,'2' from att_waga_base where status=0;
        """
    conn.execute(sql)
    sql = f"""
        insert into tmp (stcd,jd,wd,stnm,source,status,type) select stcd,lon,lat,stnm,'fx_pump_base',status,'2' from fx_pump_base where status=0;
        """
    conn.execute(sql)
    sql = f"""
        insert into tmp (stcd,jd,wd,xzqh,stnm,source,status,type) select ifnull(stcd01, stcd) as stcd,lon,lat,SUBSTR(adcd,1,6) as adcd,stnm,'fx_rain_base',status,'1' from fx_rain_base where status=0;
        """
    conn.execute(sql)
    sql = f"""
        insert into tmp (stcd,jd,wd,xzqh,stnm,source,status,type) select stcd,lon,lat,adcd,stnm,'fx_water_data_base',status,'1' from fx_water_data_base where status=0;
        """
    conn.execute(sql)
    sql = f"""
        insert into tmp (stcd,jd,wd,xzqh,stnm,source,status,type) select stcd,lon,lat,SUBSTR(adcd,1,6) as adcd,stnm,'fx_gate_base',status,'2' from fx_gate_base where status=0;
        """
    conn.execute(sql)
except Exception as e:
    logging.error(e)

# tmp表数据过滤
logging.info('--------tmp表数据过滤--------')
try:
    sql = f"""
        delete t1
        from tmp t1
        join rel_water_object_code t2
        on trim(t1.stnm) = t2.stnm and trim(t1.type) = t2.type
        """
    conn.execute(sql)
except Exception as e:
    logging.error(e)

# 处理行政区划
logging.info('--------处理行政区划--------')
try:
    sql = f"""
        update tmp t1
        join nt_gis_info t2
        on t1.xzqh is null
        and t1.jd is not null and t1.wd is not null and t1.jd <> '' and t1.wd <> ''
        and ST_Intersects(ST_GeomFromText(t2.Coordinate),ST_GeomFromText(concat('POINT(',t1.jd,' ',t1.wd,')'))) = 1
        set t1.xzqh = t2.adcode
        """
    conn.execute(sql)
except Exception as e:
    logging.error(e)

# 插入rel_water_object_code
logging.info('--------插入rel_water_object_code--------')
try:
    source_dict = dict(att_pump_base='HP010'
                       , att_st_base='MS001'
                       , att_waga_base='HP007'
                       , fx_pump_base='HP010'
                       , fx_rain_base='MS001'
                       , fx_water_data_base='MS001'
                       , att_sz_base='MS001'
                       , fx_gate_base='HP007')

    sql = f"""
        select stcd,stnm,source,xzqh,type from tmp;
        """
    sql_res = conn.execute(sql)
    for row in sql_res:
        cur = dict()
        for k, v in row._mapping.items():
            cur[k] = v

        stcd = cur.get('stcd')
        stnm = cur.get('stnm')
        source = cur.get('source')
        xzqh = cur.get('xzqh')
        type = cur.get('type')
        tmp_stcd = source_dict.get(source) + xzqh
        sql = f"""
            insert into rel_water_object_code(stcd,old_stcd,stnm,type,status)
            values('{tmp_stcd}','{stcd}','{stnm}','{type}','9');
            """
        conn.execute(sql)
except Exception as e:
    logging.error(e)

# stcd拼接主键
logging.info('--------stcd拼接主键--------')
try:
    sql = f"""
        select id,stcd from rel_water_object_code where status=9;
        """
    sql_res = conn.execute(sql)
    for row in sql_res:
        cur = dict()
        for k, v in row._mapping.items():
            cur[k] = v

        id = cur.get('id')
        stcd = cur.get('stcd')

        new_stcd = stcd + str(id).rjust(6, '0')
        sql = f"""
            update rel_water_object_code set stcd='{new_stcd}' where id = '{id}';
            """
        conn.execute(sql)
except Exception as e:
    logging.error(e)

# 生成校验码
logging.info('--------生成校验码--------')
try:
    A1_dict = {'0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
               'A': '10'
        , 'B': '11', 'C': '12', 'D': '13', 'E': '14', 'F': '15', 'G': '16', 'H': '17', 'J': '18', 'K': '19', 'L': '20'
        , 'M': '21', 'N': '22', 'P': '23', 'Q': '24', 'R': '25', 'S': '26', 'T': '27', 'U': '28', 'V': '29', 'W': '30'
        , 'X': '31', 'Y': '32'}
    A2_dict = {'0': '1', '1': '0', '2': 'X', '3': '9', '4': '8', '5': '7', '6': '6', '7': '5', '8': '4', '9': '3',
               '10': '2'}

    sql = f"""
        select id,stcd from rel_water_object_code where status=9;
        """
    sql_res = conn.execute(sql)
    for row in sql_res:
        cur = dict()
        for k, v in row._mapping.items():
            cur[k] = v

        id = cur.get('id')
        stcd = cur.get('stcd')

        tmp_code = 0
        for n in range(1, 18):
            tmp_code = tmp_code + int(A1_dict.get(stcd[n - 1]))
        check_code = A2_dict.get(str(tmp_code % 11))
        new_stcd = stcd + check_code
        sql = f"""
            update rel_water_object_code set stcd='{new_stcd}',status='0' where id = '{id}';
            """
        conn.execute(sql)
except Exception as e:
    logging.error(e)

```

