## **基于urllib的相关应用记录**

### ajax数据爬取

```python
import urllib.request
import urllib.parse
import time


def create_request(size, page):
    base_url = 'http://********:9999/credit/publicity/new/xk/pages?status=1&name=&organId=&'
    params = {
        'size': size,
        'page': page,
    }
    data = urllib.parse.urlencode(params)
    url = base_url + data
    headers = {
        'User-Agent': '********'
    }
    # 请求对象
    request = urllib.request.Request(url=url, headers=headers)
    return request


def get_result(request):
    # 响应数据
    response = urllib.request.urlopen(request)
    # 状态码
    print(response.status)
    # 返回数据
    result = response.read().decode('utf-8')
    print(result)
    return result


def write2file(size, start_page, last_page):
    with open('D:\\WorkSpace\\unicloud\\信用数据\\行政许可' + str(last_page) + '.json', 'a', encoding='utf8') as file:
        for i in range(start_page, last_page):
            if i == start_page:
                file.write('{')
            file.write('"page":')
            request = create_request(size, i)
            content = get_result(request)
            file.write(content)
            if i != last_page-1:
                file.write(',')
            else:
                file.write('}')
            time.sleep(1)


write2file(100, 0, 1000)
# write2file(100, 1000, 2000)
# write2file(100, 2000, 3000)

```

### 关联数据爬取

```python
import urllib.request
import urllib.parse
import json
from sqlalchemy import create_engine
from urllib.parse import quote_plus


conn_str = 'mysql+pymysql://root:%s@********:3306/workspace?charset=utf8' % quote_plus('******')
conn = create_engine(conn_str, echo=True)


# 社区
def get_community(street_id):
    url = 'https://www.********.com/qjSOA_plus/shanon/extendForMapAction/commonQueryForWg.action?'
    params = {
        'type': 'xq'
        , 'content': '4'
        , 'quickSearchWord': ''
        , 'curRegion': street_id
    }
    target = url + urllib.parse.urlencode(params)

    headers = {
        'Accept': '********'
        , 'Accept-Encoding': '********'
        , 'Accept-Language': '********'
        , 'Connection': '********'
        , 'Cookie': '********'
        , 'Host': '********'
        , 'Referer': '********'
        , 'sec-ch-ua': '********'
        , 'sec-ch-ua-mobile': '********'
        , 'sec-ch-ua-platform': 
        , 'Sec-Fetch-Dest': '********'
        , 'Sec-Fetch-Mode': '********'
        , 'Sec-Fetch-Site': '********'
        , 'User-Agent': '********'
        , 'X-Requested-With': '********'
    }
    # 请求对象
    request = urllib.request.Request(url=target, headers=headers)
    # 响应数据
    response = urllib.request.urlopen(request)
    # 状态码
    print(response.status)
    # 返回数据
    result = response.read().decode('utf-8')
    print(result)
    obj = json.loads(result)
    return obj


def insert_community(street_id, communities):
    for n in range(0, len(communities)):
        code = communities[n]['code']
        color = communities[n]['color']
        o_lonlatarea = communities[n]['o_lonlatarea']
        level = communities[n]['level']
        name = communities[n]['name']
        o_lonlat = communities[n]['o_lonlat']
        pid = communities[n]['pid']
        id = communities[n]['id']
        b_lonlatarea = communities[n]['b_lonlatarea']
        b_lonlat = communities[n]['b_lonlat']
        sql = f"""
            insert into community values ('{street_id}','{code}','{color}','{o_lonlatarea}','{level}','{name}','{o_lonlat}','{pid}','{id}','{b_lonlatarea}','{b_lonlat}')
            """
        conn.execute(sql)


sql = f"""
    select id street_id from street;
    """
sql_res = conn.execute(sql)

for row in sql_res:
    cur = dict()
    for k, v in row._mapping.items():
        cur[k] = v
        street_id = cur['street_id']
        communities = get_community(street_id)
        insert_community(street_id, communities)
```

