## **Python操作Neo4j**

### 创建节点和建立关系

```python
# -*- coding:utf-8 -*-

from py2neo import Node,Relationship,Graph,NodeMatcher,RelationshipMatcher

# 数据库
graph = Graph('http://192.168.1.101:7474', auth=("neo4j", "123456"))


# 查询节点是否存在
def MatchNode(m_graph,m_label,m_attrs):
    m_n = "_.name=" + "\'" + m_attrs['name'] + "\'"
    matcher = NodeMatcher(m_graph)
    re_value = matcher.match(m_label).where(m_n).first()
    return re_value

# 创建节点
def CreateNode(m_graph,m_label,m_attrs):
    re_value = MatchNode(m_graph,m_label,m_attrs)
    # print(re_value)
    if re_value is None:
        m_node = Node(m_label,**m_attrs)
        # 创建节点
        n = graph.create(m_node)
        return n
    return None

label1 = 'Stock'
attrs1 = {"name":'招商银行',"code":'600036'}
label2 = 'SecuritiesExchange'
attrs2 = {"name":'上海证券交易所'}
CreateNode(graph,label1,attrs1)
CreateNode(graph,label2,attrs2)

# 建立两个节点的关系，如果节点不存在，不进行创建
def CreateRelationship(m_graph,m_label1,m_attrs1,m_label2,m_attrs2,m_r_name):
    re_value1 = MatchNode(m_graph,m_label1,m_attrs1)
    re_value2 = MatchNode(m_graph,m_label2,m_attrs2)
    if re_value1 is None or re_value2 is None:
        return False
    m_r = Relationship(re_value1,m_r_name,re_value2)
    n = graph.create(m_r)
    return n

m_r_name = "证券交易所"
re_value = CreateRelationship(graph,label1,attrs1,label2,attrs2,m_r_name)
```

### 批量创建节点和建立关系

```python
# -*- coding:utf-8 -*-

import xlrd
import uuid
from py2neo import Node,Relationship,Graph,NodeMatcher,RelationshipMatcher

# 数据库
graph = Graph('http://192.168.1.101:7474', auth=("neo4j", "123456"))

# 查询节点是否存在
def MatchNode(graph,label,attrs):
    matchName = "_.name=" + "\'" + attrs['name'] + "\'"
    matcher = NodeMatcher(graph)
    res = matcher.match(label).where(matchName).first()
    return res

# 创建节点
def CreateNode(graph,label,attrs):
    res = MatchNode(graph,label,attrs)
    # print(res)
    if res is None:
        node = Node(label,**attrs)
        # 创建节点
        n = graph.create(node)
        return n
    return None

# 建立两个节点的关系
def CreateRelationship(graph,label1,attrs1,label2,attrs2,relationship):
    node1 = MatchNode(graph,label1,attrs1)
    node2 = MatchNode(graph,label2,attrs2)
    if node1 is None or node2 is None:
        return False
    node1_r_node2 = Relationship(node1,relationship,node2)
    n = graph.create(node1_r_node2)
    return n

def Excel2Neo4j(graph):
    label1 = 'Stock'
    label2 = 'Province'
    relationship = 'Area'
    readbook = xlrd.open_workbook('A股列表.xls',encoding_override="utf-8")
    sheet = readbook.sheet_by_name('A股列表')
    nrows = sheet.nrows
    for i in range(1,nrows):
        code = sheet.cell(i,4).value
        name = sheet.cell(i,5).value
        id = uuid.uuid3(uuid.NAMESPACE_DNS,sheet.cell(i,4).value).hex
        fullname = sheet.cell(i,1).value
        englishname = sheet.cell(i,2).value
        address = sheet.cell(i,3).value
        fdate = sheet.cell(i,6).value
        province = sheet.cell(i,15).value
        city = sheet.cell(i,16).value
        industry = sheet.cell(i,17).value
        weburl = sheet.cell(i,18).value
        attrs1 = {'code':code,'name':name,'id':id,'fullname':fullname,'englishname':englishname,'address':address,\
                  'fdate':fdate,'province':province,'city':city,'industry':industry,'weburl':weburl}
        print(attrs1)
        CreateNode(graph,label1,attrs1)
        attrs2 = {'name':province}
        CreateNode(graph, label2, attrs2)
        CreateRelationship(graph, label1, attrs1, label2, attrs2, relationship)

Excel2Neo4j(graph)
print("End")

# 通过cypher命令查询某个标签的节点个数
def GetNodeCountByLabel(graph,label):
    cypher = "match(n:"+label+") return count(n)"
    return graph.run(cypher).data()

print(GetNodeCountByLabel(graph,"Stock"))
print(GetNodeCountByLabel(graph,"Province"))
```



### 查询操作

```python
# -*- coding:utf-8 -*-

from py2neo import Node,Relationship,Graph,NodeMatcher,RelationshipMatcher

# 数据库
graph = Graph('http://192.168.1.101:7474', auth=("neo4j", "123456"))

# 按id查询节点
def MatchNodeByID(m_graph,m_id):
    matcher = NodeMatcher(m_graph)
    re_value = matcher.get(m_id)
    return re_value

# 按attr查询节点
def MatchNodeByAttr(m_graph,m_label,m_attrs):
    m_n = "_.name=" + "\'" + m_attrs['name'] + "\'"
    matcher = NodeMatcher(m_graph)
    re_value = matcher.match(m_label).where(m_n).first()
    return re_value

# 按label查询节点
def MatchNodeByLabel(m_graph,m_label):
    matcher = NodeMatcher(m_graph)
    re_value = matcher.match(m_label)
    return re_value

print(MatchNodeByID(graph,0))
print(MatchNodeByAttr(graph,'Stock',{"name":'招商银行',"code":'600036'}))
print(MatchNodeByLabel(graph,'Stock'))
```

### 通过Cypher命令批量创建节点

- 下载文件

> 板块,公司全称,英文名称,注册地址,A股代码,A股简称,A股上市日期,A股总股本,A股流通股本,B股代码,B股 简 称,B股上市日期,B股总股本,B股流通股本,地      区,省    份,城     市,所属行业,公司网址
> 主板,平安银行股份有限公司,"Ping An Bank Co., Ltd.",广东省深圳市罗湖区深南东路5047号,000001,平安银行,1991-04-03,"19,405,918,198","19,405,546,950",,,,0,0,华南,广东,深圳市,J 金融业,bank.pingan.com
> 主板,万科企业股份有限公司,"CHINA VANKE CO., LTD.",广东省深圳市盐田区大梅沙环梅路33号万科中心,000002,万  科Ａ,1991-01-29,"9,724,196,533","9,717,553,265",,,,0,0,华南,广东,深圳市,K 房地产,www.vanke.com
> 主板,深圳国华网安科技股份有限公司,"Shenzhen GuoHua Network Security Technology Co., Ltd.",广东省深圳市福田区梅林街道梅都社区中康路126号卓越梅林中心广场（南区）卓悦汇B2206A,000004,国华网安,1990-12-01,"156,003,026","116,330,763",,,,0,0,华南,广东,深圳市,I 信息技术,www.sz000004.cn
> ......

```python
# -*- coding:utf-8 -*-

import urllib.request

def DownloadSZExchangeExcel():
    url = 'http://www.szse.cn/api/report/ShowReport?SHOWTYPE=xlsx&CATALOGID=1110&TABKEY=tab1&random=0.4744196476238187'
    downPath = 'A股列表.xlsx'
    urllib.request.urlretrieve(url,downPath)

DownloadSZExchangeExcel()
```

```python
# -*- coding:utf-8 -*-

import xlrd
import uuid
from py2neo import Graph

# 数据库
graph = Graph('http://192.168.1.101:7474', auth=("neo4j", "123456"))

# 创建节点
def CreateNode(m_graph,m_cypher):
    m_graph.run(m_cypher)

def Excel2Neo4j(m_graph):
    label = 'Stock'
    # filename = 'A股列表.xls'.encode('utf-8').decode('utf-8')
    readbook = xlrd.open_workbook('A股列表.xls',encoding_override="utf-8")
    sheet = readbook.sheet_by_name('A股列表')
    nrows = sheet.nrows
    ncols = sheet.ncols
    for i in range(1,nrows):
        c_cmd0 = 'create(n:{0}{{code:\'{1}\','.format(label,sheet.cell(i,4).value)
        c_cmd1 = 'name:\'{0}\','.format(sheet.cell(i,5).value)#.replace('Ａ','A')
        c_cmd2 = 'id:\'{0}\','.format(uuid.uuid3(uuid.NAMESPACE_DNS,sheet.cell(i,4).value).hex)
        c_cmd3 = 'fullname:\'{0}\','.format(sheet.cell(i,1).value)
        c_cmd4 = 'englishname:\'{0}\','.format(sheet.cell(i,2).value)
        c_cmd5 = 'address:\'{0}\','.format(sheet.cell(i,3).value)
        c_cmd6 = 'fdate:\'{0}\','.format(sheet.cell(i,6).value)
        c_cmd7 = 'province:\'{0}\','.format(sheet.cell(i,15).value)
        c_cmd8 = 'city:\'{0}\','.format(sheet.cell(i,16).value)
        c_cmd9 = 'industry:\'{0}\','.format(sheet.cell(i,17).value)
        c_cmd10 = 'weburl:\'{0}\'}})'.format(sheet.cell(i,18).value)
        c_cmd = c_cmd0+c_cmd1+c_cmd2+c_cmd3+c_cmd4+c_cmd5+c_cmd6+c_cmd7+c_cmd8+c_cmd9+c_cmd10
        print(c_cmd)
        CreateNode(graph,c_cmd)

Excel2Neo4j(graph)
print("End")

# 查询某个标签的节点个数
def GetNodeCountByLabel(m_graph,m_label):
    m_n = "match(n:"+m_label+") return count(n)"
    return m_graph.run(m_n).data()

print(GetNodeCountByLabel(graph,"Stock"))
```