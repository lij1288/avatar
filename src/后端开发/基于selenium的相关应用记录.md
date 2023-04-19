## **基于selenium的相关应用记录**

- https://chromedriver.storage.googleapis.com/index.html下载对应版本chromedriver.exe放到Scripts目录

  或https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/下载对应版本msedgedriver.exe放到Scripts目录

### 邮箱附件下载

```python
from selenium import webdriver
import time

def log_download():
    global driver
    try:
        driver = webdriver.Chrome()
        # driver = webdriver.Edge()
        Keys = webdriver.common.keys.Keys
        By = webdriver.common.by.By
        driver.get('********')
        time.sleep(1)
        # print(driver.page_source)
        driver.find_element(By.NAME, 'F_email').send_keys('********')
        driver.find_element(By.NAME, 'F_email').send_keys(Keys.TAB)
        driver.find_element(By.NAME, 'F_password').send_keys('********')
        driver.find_element(By.NAME, 'action').click()
        time.sleep(3)
        driver.switch_to.frame('main')
        driver.find_element(By.XPATH, '//*[@title="收件箱"]').click()
        time.sleep(5)
        # driver.find_element(By.XPATH, '//*[@title="接种日志' + time.strftime("%#m.12", time.localtime()) + '"]').click()
        driver.find_element(By.XPATH,'//*[@title="接种日志' + time.strftime("%#m.%#d", time.localtime()) + '"]').click()
        time.sleep(15)
        # target = driver.find_element(By.XPATH,'//html//body//div[1]//table//tbody//tr[2]//td//table//tbody//tr//td[2]//div//div//div[3]//div[7]//div[2]//div[3]//div//div//span[1]//a')
        target = driver.find_element(By.XPATH, '//*[@target="download_frname"]')
        target.click()
        return target.text
    except Exception as e:
        print(e)
        return '【失败】邮件附件下载失败'

log_download()
```



### 图片验证码识别&列表遍历

```python
from selenium import webdriver
from tenacity import *
import shutil
import time
import ddddocr
import base64


# 图片验证码识别
def yzm_ocr(img):
    ocr = ddddocr.DdddOcr()
    img_bytes = base64.b64decode(img)
    return ocr.classification(img_bytes).lower()


# 数据下载
@retry(stop=stop_after_attempt(10))  # 重试10次
def csm_download():

    # 删除下载目录
    shutil.rmtree('c:\\csm_files')

    # 下载数据
    # driver = webdriver.Edge()
    options = webdriver.ChromeOptions()
    # 设置下载目录（若不存在自动创建）
    # 设置允许下载多个文件
    prefs = {'download.default_directory': 'c:\\csm_files', 'profile.default_content_setting_values.automatic_downloads': 1}
    options.add_experimental_option('prefs', prefs)
    driver = webdriver.Chrome(chrome_options=options)

    Keys = webdriver.common.keys.Keys
    By = webdriver.common.by.By
    driver.get('********')
    time.sleep(1)
    # print(driver.page_source)
    driver.find_element(By.NAME, 'username').send_keys('********')
    driver.find_element(By.NAME, 'password').send_keys('********')
    img = driver.find_element(By.XPATH, '//html//body//div//div//form//div[4]//div//div[2]//img').get_attribute('src').split(',')[1]
    yzm_res = yzm_ocr(img)
    print(yzm_res)
    driver.find_element(By.NAME, 'vdcode').send_keys(yzm_res)
    driver.find_element(By.XPATH, '//html//body//div//div//form//button').click()
    time.sleep(3)

    # 点击下拉框
    driver.find_element(By.XPATH, '//*[@placeholder="请选择所属街道"]').click()
    time.sleep(3)

    # 遍历下拉框
    for n in range(1, 39):
        driver.find_element(By.XPATH, '//*[@placeholder="请选择所属街道"]').send_keys(Keys.ENTER)
        driver.find_element(By.XPATH, '//*[@placeholder="请选择所属街道"]').send_keys(Keys.DOWN)
        driver.find_element(By.XPATH, '//*[@placeholder="请选择所属街道"]').send_keys(Keys.ENTER)
        time.sleep(1)
        driver.find_element(By.XPATH, '//html//body//div[1]//div//div[2]//section//section//main//form//div[7]//div//button[3]').click()
        time.sleep(1)

    time.sleep(5)


csm_download()
```



### 页码遍历数据爬取

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time


options = Options()
driver = webdriver.Chrome()
# driver = webdriver.Edge()
Keys = webdriver.common.keys.Keys
By = webdriver.common.by.By
driver.get('********')
time.sleep(1)
# print(driver.page_source)
with open('D:\\WorkSpace\\unicloud\\企业基本信息\\企业名录.txt', 'a', encoding='utf8') as file:
    file.write('company_name' + '\n')
    for i in range(1,192):
        results = driver.find_elements(By.XPATH, '//*[@target="_blank"]')
        for res in results:
            if res.text not in ('网站简介', '本站声明', '服务协议', '信息投诉/删除/联系本站', '京ICP备17049264号-1'):
                file.write(res.text + '\n')
                # print(res.text)
        driver.find_element(by=By.LINK_TEXT, value='下一页').click()
        time.sleep(1)
```



### 检索信息爬取

```python
from selenium import webdriver
from sqlalchemy import create_engine
from urllib.parse import quote_plus
import datetime
import time


now_time = datetime.datetime.now().strftime('%Y%m%d')
conn_str = 'mysql+pymysql://root:%s@********:3306/qianan?charset=utf8' % quote_plus('********')
conn = create_engine(conn_str, echo=True)

sql = f"""
    create table if not exists company_info (
         company_name varchar(255) comment '企业名称'
        ,fddbr varchar(255) comment '法定代表人'
        ,jyzt varchar(255) comment '经营状态'
        ,clrq varchar(255) comment '成立日期'
        ,zczb varchar(255) comment '注册资本'
        ,sjzb varchar(255) comment '实缴资本'
        ,gszch varchar(255) comment '工商注册号'
        ,tyshxydm varchar(255) comment '统一社会信用代码'
        ,nsrsbh varchar(255) comment '纳税人识别号'
        ,zzjgdm varchar(255) comment '组织机构代码'
        ,yyqx varchar(255) comment '营业期限'
        ,nsrzz varchar(255) comment '纳税人资质'
        ,hzrq varchar(255) comment '核准日期'
        ,qylx varchar(255) comment '企业类型'
        ,hy varchar(255) comment '行业'
        ,rygm varchar(255) comment '人员规模'
        ,cbrs varchar(255) comment '参保人数'
        ,djjg varchar(255) comment '登记机关'
        ,cym varchar(255) comment '曾用名'
        ,zcdz varchar(255) comment '注册地址'
        ,jyfw text comment '经营范围'
        ,update_time varchar(255) comment '更新时间'
    )
    comment '企业基本信息'
    """
sql_res = conn.execute(sql)

driver = webdriver.Chrome()
# driver = webdriver.Edge()
Keys = webdriver.common.keys.Keys
By = webdriver.common.by.By
driver.get('********')
time.sleep(5)
# print(driver.page_source)

# create table company_list (
#      id int
#     ,company_name varchar(255)
#     ,flag varchar(255)
# )
while True:
    try:
        sql = f"""
            select company_name from company_list where flag is null limit 1
            """
        sql_res = conn.execute(sql)
        sql_data = []
        for row in sql_res:
            cur = dict()
            for k, v in row._mapping.items():
                cur[k] = v
            sql_data.append(cur)
        # flag均不为空时跳出循环
        if len(sql_data) == 0:
            break
        res = sql_data.pop(0)
        company_name = res.get('company_name')
        driver.find_element(By.XPATH, '//html//body//div//div[1]//div//div[2]//div//div//div//input').send_keys(Keys.CONTROL + 'a')
        driver.find_element(By.XPATH, '//html//body//div//div[1]//div//div[2]//div//div//div//input').send_keys(company_name)
        driver.find_element(By.XPATH, '//html//body//div//div[1]//div//div[2]//div//div//button//span').click()
        time.sleep(1)
        driver.find_element(by=By.LINK_TEXT, value=company_name).click()
        driver.close()
        time.sleep(7)
        # 切换到新标签页
        windows = driver.window_handles
        driver.switch_to.window(windows[-1])
        # print(driver.page_source)
        fddbr = driver.find_element(By.XPATH, '//html//body//div//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[1]//td[2]//div//div[1]//div//div[2]//div//div[1]//a').text
        jyzt = driver.find_element(By.XPATH, '//html//body//div//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[1]//td[4]').text
        clrq = driver.find_element(By.XPATH, '//html//body//div//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[2]//td[2]').text
        zczb = driver.find_element(By.XPATH, '//html//body//div//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[3]//td[2]//div').text
        sjzb = driver.find_element(By.XPATH, '//html//body//div//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[4]//td[2]').text
        gszch = driver.find_element(By.XPATH, '//html//body//div//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[4]//td[4]').text
        tyshxydm = '-'
        try:
            tyshxydm = driver.find_element(By.XPATH, '//html//body//div[1]//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[5]//td[2]//div//span[1]').text
        except Exception as e:
            print(e)
        nsrsbh = '-'
        try:
            nsrsbh = driver.find_element(By.XPATH, '//html//body//div[1]//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[5]//td[4]//div//span[1]').text
        except Exception as e:
            print(e)
        zzjgdm = '-'
        try:
            zzjgdm = driver.find_element(By.XPATH, '//html//body//div[1]//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[5]//td[6]//div//span[1]').text
        except Exception as e:
            print(e)
        yyqx = '-'
        try:
            yyqx = driver.find_element(By.XPATH, '//html//body//div[1]//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[6]//td[2]//span').text
        except Exception as e:
            print(e)
        nsrzz = driver.find_element(By.XPATH, '//html//body//div[1]//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[6]//td[4]').text
        hzrq = driver.find_element(By.XPATH, '//html//body//div[1]//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[6]//td[6]').text
        qylx = driver.find_element(By.XPATH, '//html//body//div[1]//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[7]//td[2]').text
        hy = driver.find_element(By.XPATH, '//html//body//div[1]//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[7]//td[4]').text
        rygm = driver.find_element(By.XPATH, '//html//body//div[1]//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[7]//td[6]').text
        cbrs = driver.find_element(By.XPATH, '//html//body//div[1]//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[8]//td[2]').text
        djjg = driver.find_element(By.XPATH, '//html//body//div[1]//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[8]//td[4]').text
        cym = driver.find_element(By.XPATH,'//html//body//div//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[9]//td[2]').text
        zcdz = '-'
        try:
            zcdz = driver.find_element(By.XPATH, '//html//body//div[1]//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[10]//td[2]//div//span[1]').text
        except Exception as e:
            print(e)
        jyfw = driver.find_element(By.XPATH, '//html//body//div[1]//div//div[2]//div[1]//div[3]//div//div[2]//div[2]//div//div[2]//div//div[2]//table//tbody//tr[11]//td[2]').text
        update_time = now_time

        sql = f"""
            insert into company_info (
                 company_name
                ,fddbr
                ,jyzt
                ,clrq
                ,zczb
                ,sjzb
                ,gszch
                ,tyshxydm
                ,nsrsbh
                ,zzjgdm
                ,yyqx
                ,nsrzz
                ,hzrq
                ,qylx
                ,hy
                ,rygm
                ,cbrs
                ,djjg
                ,cym
                ,zcdz
                ,jyfw
                ,update_time
            )
            values (
                 '{company_name}'
                ,'{fddbr}'
                ,'{jyzt}'
                ,'{clrq}'
                ,'{zczb}'
                ,'{sjzb}'
                ,'{gszch}'
                ,'{tyshxydm}'
                ,'{nsrsbh}'
                ,'{zzjgdm}'
                ,'{yyqx}'
                ,'{nsrzz}'
                ,'{hzrq}'
                ,'{qylx}'
                ,'{hy}'
                ,'{rygm}'
                ,'{cbrs}'
                ,'{djjg}'
                ,'{cym}'
                ,'{zcdz}'
                ,'{jyfw}'
                ,'{update_time}'
            )
            """
        sql_res = conn.execute(sql)

        sql = f"""
            update company_list set flag = '1' where company_name = '{company_name}'
            """
        sql_res = conn.execute(sql)
    except Exception as e:
        print(e)
        sql = f"""
            update company_list set flag = '0' where company_name = '{company_name}'
            """
        sql_res = conn.execute(sql)
```



### 加密验证码截图识别

```python
from selenium import webdriver
from tenacity import *
import shutil
import time
import ddddocr
import os
from PIL import Image
from io import BytesIO


# 图片验证码识别
def yzm_ocr(img):
    ocr = ddddocr.DdddOcr()
    with open(img, 'rb') as f:
        img_bytes = f.read()
    return ocr.classification(img_bytes).lower()


# 数据下载
@retry(stop=stop_after_attempt(10))  # 重试10次
def loujian_download():

    # 删除下载目录
    shutil.rmtree('c:\\python_file')
    os.mkdir('c:\\python_file')

    # 下载数据
    # driver = webdriver.Edge()
    options = webdriver.ChromeOptions()
    # 设置下载目录（若不存在自动创建）
    # 设置允许下载多个文件
    prefs = {'download.default_directory': 'c:\\python_file', 'profile.default_content_setting_values.automatic_downloads': 1}
    options.add_experimental_option('prefs', prefs)
    # 解决不是私密连接问题
    options.add_argument('--ignore-certificate-errors')
    driver = webdriver.Chrome(chrome_options=options)

    Keys = webdriver.common.keys.Keys
    By = webdriver.common.by.By
    driver.get('********')
    time.sleep(1)
    # print(driver.page_source)
    driver.find_element(By.XPATH, '//html//body//div[3]//div//div[2]//form//div[1]//input').send_keys('********')
    driver.find_element(By.XPATH, '//html//body//div[3]//div//div[2]//form//div[2]//input').send_keys('********')
    img = driver.find_element(By.XPATH, '//html//body//div[3]//div//div[2]//form//div[3]//div[2]//img')
    # x, y = img.location.values()
    h, w = img.size.values()
    # 网页截图
    img_data = driver.get_screenshot_as_png()
    screen_shot = Image.open(BytesIO(img_data))
    # 裁剪截图
    target = screen_shot.crop((805, 476, 805 + w, 476 + h))
    # 保存验证码图片
    target.save('yzm.png')
    yzm_res = yzm_ocr('yzm.png')
    print(yzm_res)
    driver.find_element(By.XPATH, '//html//body//div[3]//div//div[2]//form//div[3]//input').send_keys(yzm_res)
    driver.find_element(By.XPATH, '//html//body//div[3]//div//div[2]//form//input[2]').click()
    time.sleep(3)

    driver.find_element(By.XPATH, '//html//body//div[2]//div[1]//ul[1]//li[6]//a//span').click()
    time.sleep(3)
    driver.find_element(By.XPATH, '//html//body//div[2]//div[6]//div//div[2]//div//button').click()

    time.sleep(5)

    return '【成功】漏检数据下载成功'


loujian_download()
```

### 通用文章列表信息爬取

```python
from selenium import webdriver
from sqlalchemy import create_engine
from urllib.parse import quote_plus
import time

# 参数设置
type = '********'
url = 'https://********/public/info/1rsrm.html'
url2 = 'https://********/public/info/1rsrm.html?cname=1rsrm&page=2'
cnt = 20
page = 5
element_path = '/html/body/div[4]/div/div[2]/ul/li['

conn_str = 'mysql+pymysql://root:%s@********:3306/qjdata?charset=utf8' % quote_plus('********')
conn = create_engine(conn_str, echo=True)

driver = webdriver.Chrome()
Keys = webdriver.common.keys.Keys
By = webdriver.common.by.By
driver.get(url)
time.sleep(1)
# print(driver.page_source)


# 插入数据库
def insert_detail(type, title, time, target_url):
    sql = f"""
        insert into rsrm_data (
             type
            ,title
            ,time
            ,url
        )
        values (
             '{type}'
            ,'{title}'
            ,'{time}'
            ,'{target_url}'
        )
        """
    sql_res = conn.execute(sql)


# 获取文章链接
def get_target_url(driver):
    for n in range(1, cnt+1):
        try:
            target_url = driver.find_element(By.XPATH, element_path + str(n) + ']/a').get_attribute('href')
            title = driver.find_element(By.XPATH, element_path + str(n) + ']/a').text
            # time_str = driver.find_element(By.XPATH, element_path + str(n) + ']').text
            # time = time_str[len(time_str)-10:]
            time = driver.find_element(By.XPATH, element_path + str(n) + ']/span').text
            # print(type, title, time, target_url)
            insert_detail(type, title, time, target_url)
        except Exception as e:
            print(e)


for n in range(1, page+1):
    try:
        # 处理翻页网址
        if n == 1:
            page_url = url
        else:
            page_url = url2 + str(n) + '.html'
        driver.get(page_url)
        time.sleep(1)
        get_target_url(driver)
    except Exception as e:
        print(e)
```

### 文章列表及文章详情爬取

```python
from selenium import webdriver
from sqlalchemy import create_engine
from urllib.parse import quote_plus
import time
import math

conn_str = 'mysql+pymysql://root:%s@********:3306/qjdata?charset=utf8' % quote_plus('********')
conn = create_engine(conn_str, echo=True)

driver = webdriver.Chrome()
Keys = webdriver.common.keys.Keys
By = webdriver.common.by.By
type = '********'
url = 'https://********/html/main/djzwcf/index.html'
driver.get(url)
time.sleep(1)
# print(driver.page_source)
# 获取页数
# 通过属性获取隐藏文本
page_total_str = driver.find_element(By.CLASS_NAME, 'page_total').get_attribute('textContent')
print(page_total_str)
page_total = int("".join(list(filter(str.isdigit, page_total_str))))
print(page_total)
page = math.ceil(page_total/10)
print(page)


# 插入数据库
def insert_target_url(type, target_url):
    sql = f"""
        insert into qjsjw_data (
             type
            ,url
        )
        values (
             '{type}'
            ,'{target_url}'
        )
        """
    sql_res = conn.execute(sql)


# 获取文章链接
def get_target_url(driver):
    for n in range(1, 11):
        try:
            target_url = driver.find_element(By.XPATH, '/html/body/div/div[2]/div[2]/ul/li[' + str(n) + ']/a').get_attribute('href')
            print(target_url)
            insert_target_url(type, target_url)
        except Exception as e:
            print(e)


for n in range(1, page+1):
    # 处理翻页网址
    if n == 1:
        page_url = url
    else:
        page_url = url[0:len(url)-10] + str(n) + '.html'
    driver.get(page_url)
    time.sleep(1)
    get_target_url(driver)
```

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


# 插入数据库
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

### 多级目录内容下载&重命名

```python
from selenium import webdriver
import time
import os


options = webdriver.ChromeOptions()
prefs = {'download.default_directory': 'D:\\Workspace\\tmp\\', 'profile.default_content_setting_values.automatic_downloads': 1}
options.add_experimental_option('prefs', prefs)
driver = webdriver.Chrome(chrome_options=options)
Keys = webdriver.common.keys.Keys
By = webdriver.common.by.By

url = 'http://********/zk/indexce.html'
driver.get(url)
driver.switch_to.frame('contents')

# print(driver.page_source)
time.sleep(1)

for i in range(1,10):
    for j in range(1,55):
        try:
            element = driver.find_element(By.XPATH, '/html/body/center/div/table/tbody/tr[3]/th/ul/ul[1]/ul/ul[' + str(i) + ']/li[' + str(j) + ']/a')
            element.click()
            time.sleep(1)
            target_name = element.text
            file_name = element.get_attribute('href').split('/')[-1]
            print(file_name)
            path = 'D:\\Workspace\\tmp\\' + file_name
            target_path = 'D:\\Workspace\\tmp\\' + target_name + '.xls'
            print(path, target_path)
            os.rename(path, target_path)
        except Exception as e:
            print(e)
```

