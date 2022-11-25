## **基于selenium的相关应用记录**

### 邮箱附件下载

```python
# https://chromedriver.storage.googleapis.com/index.html下载对应版本chromedriver.exe放到Scripts目录
# 或https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/下载对应版本msedgedriver.exe放到Scripts目录
from selenium import webdriver
import time
import loginutils

def log_download():
    global driver
    try:
        driver = webdriver.Chrome()
        # driver = webdriver.Edge()
        Keys = webdriver.common.keys.Keys
        By = webdriver.common.by.By
        driver.get(loginutils.get_addr('jzrj'))
        time.sleep(1)
        # print(driver.page_source)
        driver.find_element(By.NAME, 'F_email').send_keys(loginutils.get_user('jzrj'))
        driver.find_element(By.NAME, 'F_email').send_keys(Keys.TAB)
        driver.find_element(By.NAME, 'F_password').send_keys(loginutils.get_pwd('jzrj'))
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



### 图片验证码识别+列表遍历

```python
# https://chromedriver.storage.googleapis.com/index.html下载对应版本chromedriver.exe放到Scripts目录
# 或https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/下载对应版本msedgedriver.exe放到Scripts目录

from selenium import webdriver
from tenacity import *
import shutil
import time
import ddddocr
import base64
import loginutils


# 图片验证码识别
def yzm_ocr(img):
    ocr = ddddocr.DdddOcr()
    img_bytes = base64.b64decode(img)
    return ocr.classification(img_bytes).lower()


# 场所码下载
@retry(stop=stop_after_attempt(10))  # 重试10次
def csm_download():

    # 删除下载目录
    shutil.rmtree('c:\\csm_files')

    # 下载场所码
    # driver = webdriver.Edge()
    options = webdriver.ChromeOptions()
    # 设置下载目录（若不存在自动创建）
    # 设置允许下载多个文件
    prefs = {'download.default_directory': 'c:\\csm_files', 'profile.default_content_setting_values.automatic_downloads': 1}
    options.add_experimental_option('prefs', prefs)
    driver = webdriver.Chrome(chrome_options=options)

    Keys = webdriver.common.keys.Keys
    By = webdriver.common.by.By
    driver.get(loginutils.get_addr('csm'))
    time.sleep(1)
    # print(driver.page_source)
    driver.find_element(By.NAME, 'username').send_keys(loginutils.get_user('csm'))
    driver.find_element(By.NAME, 'password').send_keys(loginutils.get_pwd('csm'))
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
# https://chromedriver.storage.googleapis.com/index.html下载对应版本chromedriver.exe放到Scripts目录
# 或https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/下载对应版本msedgedriver.exe放到Scripts目录
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import loginutils


options = Options()
driver = webdriver.Chrome()
# driver = webdriver.Edge()
Keys = webdriver.common.keys.Keys
By = webdriver.common.by.By
driver.get(loginutils.get_addr('qyml'))
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
import loginutils


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
driver.get(loginutils.get_addr('qyxx'))
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
# https://chromedriver.storage.googleapis.com/index.html下载对应版本chromedriver.exe放到Scripts目录
# 或https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/下载对应版本msedgedriver.exe放到Scripts目录

from selenium import webdriver
from tenacity import *
import shutil
import time
import ddddocr
import os
from PIL import Image
from io import BytesIO
import loginutils


# 图片验证码识别
def yzm_ocr(img):
    ocr = ddddocr.DdddOcr()
    with open(img, 'rb') as f:
        img_bytes = f.read()
    return ocr.classification(img_bytes).lower()


# 场所码下载
@retry(stop=stop_after_attempt(10))  # 重试10次
def loujian_download():

    # 删除下载目录
    shutil.rmtree('c:\\python_file')
    os.mkdir('c:\\python_file')

    # 下载场所码
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
    driver.get(loginutils.get_addr('louj'))
    time.sleep(1)
    # print(driver.page_source)
    driver.find_element(By.XPATH, '//html//body//div[3]//div//div[2]//form//div[1]//input').send_keys(loginutils.get_user('louj'))
    driver.find_element(By.XPATH, '//html//body//div[3]//div//div[2]//form//div[2]//input').send_keys(loginutils.get_pwd('louj'))
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

