## **基于pdfplumber的PDF文件解析**

```python
import pdfplumber
import re

pdf = pdfplumber.open('D:/Workspace/test.pdf')
res = []
table = []
for page in pdf.pages:
    # print(page)
    # print(page.extract_text())   # 将页面的所有字符整理成字符串
    # print(page.extract_words())   # 返回字符串及其边框信息
    # print(page.extract_tables())   # 返回从表格中提取的文本
    for t in page.extract_tables():
        for row in t:
            # print(row)
            # 该行第一列为数字，则添加到表格中
            if re.match(r'\d+', row[0]):
                table.append(row)
            # 该行第一列非数字，则已完成一个表格，将该表格添加到结果集
            if re.match(r'\D+', row[0]):
                if len(table) > 0:
                    res.append(table)
                print(table)
                table = []
# 将最后一个表格添加到结果集
res.append(table)
pdf.close()
```

![](assets/基于pdfplumber的PDF文件解析/pdf.jpg)