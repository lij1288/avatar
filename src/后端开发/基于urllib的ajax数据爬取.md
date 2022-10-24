## **基于urllib的ajax数据爬取**

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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36 Edg/103.0.1264.71'
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

