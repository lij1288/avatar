## **基于Place API和Geocoder的经纬度查询**

```python
import pandas
from sqlalchemy import create_engine
from urllib.parse import quote_plus
import pymysql
import maputils

conn_str = 'mysql+pymysql://root:%s@********:3306/avatar?charset=utf8' % quote_plus('********')
conn = create_engine(conn_str, echo=True)


def addr_update(addr):
    try:
        loc = maputils.loc_place(addr)
        lng = loc['results'][0]['location']['lng']
        lat = loc['results'][0]['location']['lat']
    except Exception as e:
        print(e)
        # loc = maputils.loc_geocoder(addr)
        # lng = loc['result']['location']['lng']
        # lat = loc['result']['location']['lat']
    sql = f"""
        update addr set lng='{lng}',lat='{lat}' where address='{addr}';
        """
    conn.execute(sql)


sql = f"""
    select address from addr where lng is null or lat is null;
    """
sql_res = conn.execute(sql)

for row in sql_res:
    cur = dict()
    for k, v in row._mapping.items():
        cur[k] = v
        addr = cur['address']
        addr_update(addr)
```

- maputils

```python
import urllib.request
import urllib.parse
import json


# 地点检索
def loc_place(addr):
    url = 'https://api.map.baidu.com/place/v2/search?'
    params = {
        'query': addr,
        'region': '天津',
        'ret_coordtype': 'gcj02ll',
        'output': 'json',
        'ak': 'u********C',
    }
    target = url + urllib.parse.urlencode(params)
    # 请求对象
    request = urllib.request.Request(target)
    # 响应数据
    response = urllib.request.urlopen(request)
    # 状态码
    # print(response.status)
    # 返回数据
    result = response.read().decode('utf-8')
    # print(result)
    obj = json.loads(result)
    return obj


# 地理编码检索
def loc_geocoder(addr):
    url = 'https://api.map.baidu.com/geocoding/v3/?'
    params = {
        'address': addr,
        'ret_coordtype': 'gcj02ll',
        'output': 'json',
        'ak': 'u********C',
    }
    target = url + urllib.parse.urlencode(params)
    # 请求对象
    request = urllib.request.Request(target)
    # 响应数据
    response = urllib.request.urlopen(request)
    # 状态码
    # print(response.status)
    # 返回数据
    result = response.read().decode('utf-8')
    # print(result)
    obj = json.loads(result)
    return obj
```

