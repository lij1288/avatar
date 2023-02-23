## **基于pyDes的加密解密**

```python
import base64
import pyDes


def encrypt(data, key):
    # 密钥、加密模式、偏移量、填充字符、填充模式
    des = pyDes.des(key, pyDes.ECB, b"\0\0\0\0\0\0\0\0", pad=None, padmode=pyDes.PAD_PKCS5)
    res = des.encrypt(data)
    return bytes.decode(base64.b64encode(res))


def decrypt(data, key):
    # 密钥、加密模式、偏移量、填充字符、填充模式
    des = pyDes.des(key, pyDes.ECB, b"\0\0\0\0\0\0\0\0", pad=None, padmode=pyDes.PAD_PKCS5)
    res = des.decrypt(base64.b64decode(data))
    return bytes.decode(res)


str1 = encrypt('testpwd', 'testkey!')
str2 = decrypt(str1, 'testkey!')
print(str1)
print(str2)
```

- 从数据中获取数据并解密

```python
from sqlalchemy import create_engine
from urllib.parse import quote_plus
import base64
import pyDes


conn_str = 'mysql+pymysql://root:%s@********:3306/******?charset=utf8' % quote_plus('********')
conn = create_engine(conn_str, echo=True)

key = bytes.decode(base64.b64decode('dGVzdGtleSE='))


def get_addr(id):
    try:
        sql1 = f"""
            select addr from dict_login where id = '{id}'
            """
        sql_res = conn.execute(sql1)
        sql_data = []
        for row in sql_res:
            cur = dict()
            for k, v in row._mapping.items():
                cur[k] = v
            sql_data.append(cur)

        res = sql_data.pop(0)
        data1 = res.get('addr')
        des = pyDes.des(key, pyDes.ECB, b"\0\0\0\0\0\0\0\0", pad=None, padmode=pyDes.PAD_PKCS5)
        res = des.decrypt(base64.b64decode(data1))
        return bytes.decode(res)
    except Exception as e:
        print(e)
        return '【失败】获取失败'


def get_user(id):
    try:
        sql1 = f"""
            select user from dict_login where id = '{id}'
            """
        sql_res = conn.execute(sql1)
        sql_data = []
        for row in sql_res:
            cur = dict()
            for k, v in row._mapping.items():
                cur[k] = v
            sql_data.append(cur)

        res = sql_data.pop(0)
        data1 = res.get('user')
        des = pyDes.des(key, pyDes.ECB, b"\0\0\0\0\0\0\0\0", pad=None, padmode=pyDes.PAD_PKCS5)
        res = des.decrypt(base64.b64decode(data1))
        return bytes.decode(res)
    except Exception as e:
        print(e)
        return '【失败】获取失败'


def get_pwd(id):
    try:
        sql1 = f"""
            select pwd from dict_login where id = '{id}'
            """
        sql_res = conn.execute(sql1)
        sql_data = []
        for row in sql_res:
            cur = dict()
            for k, v in row._mapping.items():
                cur[k] = v
            sql_data.append(cur)

        res = sql_data.pop(0)
        data1 = res.get('pwd')
        des = pyDes.des(key, pyDes.ECB, b"\0\0\0\0\0\0\0\0", pad=None, padmode=pyDes.PAD_PKCS5)
        res = des.decrypt(base64.b64decode(data1))
        return bytes.decode(res)
    except Exception as e:
        print(e)
        return '【失败】获取失败'
```





