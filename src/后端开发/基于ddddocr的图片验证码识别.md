## **基于ddddocr的图片验证码识别**

- 环境支持

  - python <= 3.9（ddddocr1.4）

- 安装命令
  

> pip install ddddocr

```python
import ddddocr

ocr = ddddocr.DdddOcr()
with open('yzm.png', 'rb') as f:
    img_bytes = f.read()
res = ocr.classification(img_bytes)
print(res)
```

### 显示编码图片处理

```python
<img data-v-90dd9fe0="" width="100%" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAAoCAIAAAD2TmbPAAACsUlEQVR42u3bvU7EMAwA4Lw0jMDKgISYkdhg4xULUqUoyo9jO7bjpK06Hb1r0q9OHLeEA7E9PvzE/bj29vPy/vH2m+2eGxxWAf58+ibtGm0oaf0z38ACtOPG/wPDDawYmiRd+IARYw3mIWBLeA+6QKhJjdXixkzg9BMb5unAXQCpyVg2lAPmZBlhS1fVeApwGZcGwLLM5AhuKWobzwU2yIaQI/bX82vctYBbnVQ1VgU+w6XcI7Cxa2Z5nj2lxTMzgasd1gOuptBnM87PNQCmr3FTwpZu15ifRVeZScAxUKjAwPK3FYuD43P2CzYlji4kxpgM3LqCZTqGv7jpkdXjU2BelYPhXaZXxpUsTJjKA8OJwPgoDQMDiuKVrExOtZLVBWYfI1PJqkawHjCmnDleSUjZUsVyDFAyRs6yFsDVRTNv8usCI2dr2DhOB8CcXQID7dQwRubJdsBnt7Mjqcat4/EDL/Ju6N5/3eE3+4VLAOPzbb1irNRMjAzK2GDxIF4GmCQnsqK1BNarVroGZuPdwH6BywmYUdzYGJjatTnAAB6mHtJl9gPMiMhNgFvGZf5cdolXSiRpCZY7qA8bgLUyw3gCcGuWZedWWUyLgGkUszDG1YfHWb8WAD7oD/xJa6SqNN5M/L07JDBmxUyt/FgDw4O27CPC7FoIlipHgrg1ueLTMZKxHfDgnSjCDD9sMH5nFvMn9jpiJnA3XVL1dvvKOynTdh3B3eYaYBvTIplHLppr4MP8PbQNNssrFpZr8fYkvIxMF9itsWCrZnVwcNYLx+6bYELQKszZY9/AWsytAqT9C/FI7KsAC0q0fsGeGYN9LWApCfhx58R0pDz7FYFFJLoPUZxknWF1oXEn9te7X/TAHHYKRxK5WZ11LvO2QzRVDv6XnHWZg/0V939ndPkXYv4D9hJp4W9xJikAAAAASUVORK5CYII=">
```

```python
# https://chromedriver.storage.googleapis.com/index.html下载对应版本chromedriver.exe放到Scripts目录
# 或https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/下载对应版本msedgedriver.exe放到Scripts目录

from selenium import webdriver
from tenacity import *
import ddddocr
import time
import base64
import MHLogin


# 图片验证码识别
def yzm_ocr(img):
    ocr = ddddocr.DdddOcr()
    img_bytes = base64.b64decode(img)
    return ocr.classification(img_bytes).lower()


# 系统登录
@retry(stop=stop_after_attempt(10))  # 重试10次
def login():
	# driver = webdriver.Chrome()
	driver = webdriver.Edge()
	Keys = webdriver.common.keys.Keys
	By = webdriver.common.by.By
	driver.get(MHLogin.get_addr('csm'))
	time.sleep(1)
	# print(driver.page_source)
	driver.find_element(By.NAME, 'username').send_keys(MHLogin.get_user('csm'))
	driver.find_element(By.NAME, 'password').send_keys(MHLogin.get_pwd('csm'))
	img = driver.find_element(By.XPATH,'//html//body//div//div//form//div[4]//div//div[2]//img').get_attribute('src').split(',')[1]
	yzm_res = yzm_ocr(img)
	print(yzm_res)
	driver.find_element(By.NAME, 'vdcode').send_keys(yzm_res)
	driver.find_element(By.XPATH, '//html//body//div//div//form//button').click()
	print(driver.page_source)


login()
```

### 未显示编码图片处理

```html
<img id="clientImgCode" src="/Account/GetImgAsync?key=4b9842ee-1c36-4bd4-90e0-ea1b6d710881&amp;t=637981264827850418" title="看不清，点击换一张">
```

```python
# https://chromedriver.storage.googleapis.com/index.html下载对应版本chromedriver.exe放到Scripts目录
# 或https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/下载对应版本msedgedriver.exe放到Scripts目录
from selenium import webdriver
from PIL import Image
from io import BytesIO
from tenacity import *
import ddddocr
import time
import MHLogin


# 图片验证码识别
def yzm_ocr(img):
    ocr = ddddocr.DdddOcr()
    with open(img, 'rb') as f:
        img_bytes = f.read()
    return ocr.classification(img_bytes).lower()


# 系统登录
@retry(stop=stop_after_attempt(10))  # 重试10次
def login():
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
    driver.get(MHLogin.get_addr('louj'))
    time.sleep(1)
    # print(driver.page_source)
    driver.find_element(By.XPATH, '//html//body//div[3]//div//div[2]//form//div[1]//input').send_keys(MHLogin.get_user('louj'))
    driver.find_element(By.XPATH, '//html//body//div[3]//div//div[2]//form//div[2]//input').send_keys(MHLogin.get_pwd('louj'))
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


login()
```

