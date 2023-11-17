## **基于faker的模拟数据创建**

```python
from faker import Faker
from sqlalchemy import create_engine
from urllib.parse import quote_plus

conn_str = 'mysql+pymysql://root:%s@********:3306/dwd_rk?charset=utf8' % quote_plus('********')
conn = create_engine(conn_str, echo=True)

faker = Faker('zh_CN')
for i in range(1, 10000):
    id = faker.uuid4()
    csrq = str(faker.date_between(start_date='-50y', end_date='-20y'))
    xb = faker.random_element(elements=('男', '女'))
    if xb == '男':
        xm = faker.name_male()
    if xb == '女':
        xm = faker.name_female()
    sfzh = faker.ssn()[:6]+csrq.replace('-', '')+faker.ssn()[-4:]
    nl = 2023 - int(csrq[:4])
    lxfs = faker.phone_number()
    djsyd = faker.random_element(elements=('和平区', '河东区', '河西区', '南开区', '河北区', '红桥区', '滨海新区', '东丽区', '西青区', '津南区', '北辰区', '武清区', '宝坻区', '宁河区', '静海区', '蓟州区'))
    whcd = faker.random_element(elements=('高中', '高中1', '高中2', '大学', '大学1'))
    mz = '汉族'
    hy_type = faker.random_element(elements=('制造业', '电力、热力、燃气及水生产和供应业', '建筑业', '批发和零售业', '交通运输仓储和邮政业', '住宿和餐饮业', '信息传输、软件和信息技术服务业', '金融业', '房地产业', '租赁和商务服务业', '科学研究和技术服务业', '水利、环境和公共设施管理业', '居民服务、修理和其他服务业', '教育', '卫生和社会工作', '文化、体育和娱乐业', '公共管理、社会保障和社会组织'))
    sysj = str(faker.date_between(start_date='-1y', end_date='-0y'))


    sql = f"""
        insert into dwd_rk_sydj_info values ('{id}','{sfzh}','{xm}','{lxfs}','{csrq}','{xb}','{nl}','{mz}','{whcd}','{sysj}','{djsyd}','{hy_type}')
        """
    sql_res = conn.execute(sql)
```

