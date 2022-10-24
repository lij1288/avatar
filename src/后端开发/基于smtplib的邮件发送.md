## **基于smtplib的邮件发送**

```python
import smtplib
from email.mime.text import MIMEText


mail_host = 'smtp.163.com'  # 邮箱服务器地址
mail_user = 'unidata_wq'  # 用户名
mail_pass = '********'  # 授权码
sender = 'unidata_wq@163.com'  # 发送方
receivers = ['unidata_wq@163.com']  # 接受方
title = '邮件标题'  # 邮件标题

# 邮件内容
message = MIMEText(f"""
    邮件内容
    """, 'plain', 'utf-8')
# message = MIMEText('', 'html', 'utf-8')

# 邮件主题
message['Subject'] = title
# 发送方信息
message['From'] = sender
# 接受方信息
message['To'] = receivers[0]


# 登录并发送邮件
try:
    smtpObj = smtplib.SMTP()
    smtpObj.connect(mail_host, 25)  # 连接到服务器
    smtpObj.login(mail_user, mail_pass)  # 登录到服务器
    smtpObj.sendmail(  # 发送
        sender, receivers, message.as_string())
    smtpObj.quit()  # 退出
    print('success')
except Exception as e:
    print('error', e)
```

