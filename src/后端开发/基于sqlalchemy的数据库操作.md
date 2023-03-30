## **基于sqlalchemy的数据库操作**

### 连接MySQL

```python
from selenium import webdriver
from sqlalchemy import create_engine
from urllib.parse import quote_plus
import time


conn_str = 'mysql+pymysql://root:%s@********:3306/qjdata?charset=utf8' % quote_plus('********')
conn = create_engine(conn_str, echo=True)

driver = webdriver.Chrome()
Keys = webdriver.common.keys.Keys
By = webdriver.common.by.By


def insert_detail(url, title, source, time):
    sql = f"""
        update qjsjw_data set title='{title}',source='{source}',time='{time}' where url='{url}';
        """
    sql_res = conn.execute(sql)


sql = f"""
    select url from qjsjw_data where title is null
    """
sql_res = conn.execute(sql)
sql_data = []
for row in sql_res:
    cur = dict()
    for k, v in row._mapping.items():
        cur[k] = v
    sql_data.append(cur)
len = len(sql_data)
for n in range(0, len):
    print(n)
    res = sql_data.pop(0)
    url = res.get('url')
    print(url)
    driver.get(url)
    time.sleep(1)
    title = driver.find_element(By.XPATH, '/html/body/div/div[2]/div[1]/p').text.replace('\n', '')
    source = driver.find_element(By.XPATH, '/html/body/div/div[2]/div[1]/div/span[1]').text[4:]
    time2 = driver.find_element(By.XPATH, '/html/body/div/div[2]/div[1]/div/span[2]').text[6:]
    insert_detail(url, title, source, time2)
```

### 连接PostgreSQL

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from urllib.parse import quote_plus
import psycopg2

conn_str = 'postgresql+psycopg2://qjdndb:%s@********:5432/qjdndb' % quote_plus('********')
conn = scoped_session(sessionmaker(create_engine(conn_str)))

try:
    sql = f"""
        select 'ods' table_schema, table_name, column_name from adm.ads_stats_detail where is_empty is null
        """
    sql_res = conn.execute(sql)
    for row in sql_res:
        cur = dict()
        for k, v in row._mapping.items():
            cur[k] = v
        table_schema = cur.get('table_schema')
        table_name = cur.get('table_name')
        column_name = cur.get('column_name')

        sql = f"""
                update adm.ads_stats_detail set is_empty = (select count(1) from {table_schema}.{table_name} where "{column_name}" is null) 
                where table_name = '{table_name}' and column_name = '{column_name}';
                commit;
                """
        sql_res = conn.execute(sql)
except Exception as e:
    print(e)
```

