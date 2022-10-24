## **selenium的click使用try后失效问题处理**

### 问题记录

- 基于selenium下载邮箱附件，使用try之后其中一个click失效，无异常报出

### 解决过程

- 将driver设置为global

```python
# https://chromedriver.storage.googleapis.com/index.html下载对应版本chromedriver.exe放到Scripts目录
# 或https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/下载对应版本msedgedriver.exe放到Scripts目录
from selenium import webdriver
import time
import MHLogin

def log_download():
    global driver  #添加后解决下载按钮click失效问题
    try:
        # 日志下载
        driver = webdriver.Chrome()
        # driver = webdriver.Edge()
        Keys = webdriver.common.keys.Keys
        By = webdriver.common.by.By
        driver.get(MHLogin.get_addr('jzrj'))
        time.sleep(1)
        # print(driver.page_source)
        driver.find_element(By.NAME, 'F_email').send_keys(MHLogin.get_user('jzrj'))
        driver.find_element(By.NAME, 'F_email').send_keys(Keys.TAB)
        driver.find_element(By.NAME, 'F_password').send_keys(MHLogin.get_pwd('jzrj'))
        driver.find_element(By.NAME, 'action').click()
        time.sleep(3)
        driver.switch_to.frame('main')
        driver.find_element(By.XPATH, '//*[@title="收件箱"]').click()
        time.sleep(5)
        driver.find_element(By.XPATH, '//*[@title="接种日志' + time.strftime("%#m.8", time.localtime()) + '"]').click()
        # browser.find_element(By.XPATH,'//*[@title="接种日志' + time.strftime("%#m.%#d", time.localtime()) + '"]').click()
        time.sleep(10)
        # target = driver.find_element(By.XPATH,'//html//body//div[1]//table//tbody//tr[2]//td//table//tbody//tr//td[2]//div//div//div[3]//div[7]//div[2]//div[3]//div//div//span[1]//a')
        target = driver.find_element(By.XPATH, '//*[@target="download_frname"]')
        target.click()
        return target.text
    except Exception as e:
        print(e)
```

