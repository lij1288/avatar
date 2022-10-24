## **解压rar/zip文件并识别路径**

```python
# 在系统环境变量中配置了WinRAR的路径D:\App\WinRAR，重启PyCharm
import rarfile
from zipfile import ZipFile
import os


# 压缩包内目标个数
def file_count(dir_path):
    dir = os.listdir(dir_path)
    return len(dir)


def locate_file(dir_path):
    # 接种日志
    dir = os.listdir(dir_path)
    log_file = ''
    kucun_file = ''
    jinji_files = ''
    for file in dir:
        if os.path.splitext(file)[1] == '.csv':
            log_file = os.path.join(dir_path, file)
    # 库存
    try:
        kucun_path = dir_path + '\\库存'
        kucun_dir = os.listdir(kucun_path)
        for file in kucun_dir:
            kucun_file = os.path.join(kucun_path, file)
    except:
        kucun_file = 0
    # 禁忌
    jinji_files = set()
    try:
        jinji_path = dir_path + '\\禁忌'
        jinji_dir = os.listdir(jinji_path)
        for file in jinji_dir:
            jinji_file = os.path.join(jinji_path, file)
            jinji_files.add(jinji_file)
    except:
        jinji_files = 0

    res = dict()
    res['log'] = log_file
    res['kucun'] = kucun_file
    res['jinji'] = jinji_files

    return res


def extract(target):
    try:
        path = 'C:\\Users\\综合运营中心\\Downloads\\' + target
        dir_path = 'C:\\Users\\综合运营中心\\Downloads\\' + target[:-4]

        if target[-3:] == 'rar':
            rf = rarfile.RarFile(path)
            rf.extractall(dir_path)
            if file_count(dir_path) == 1:
                dir_path = dir_path + '\\' + target[:-4]
            return locate_file(dir_path)
        if target[-3:] == 'zip':
            zip_file = ZipFile(path, 'r')
            # 处理文件名乱码问题
            name_to_info = zip_file.NameToInfo
            for name, info in name_to_info.copy().items():
                new_name = name.encode('cp437').decode('gbk')
                if new_name != name:
                    info.filename = new_name
                    del name_to_info[name]
                    name_to_info[new_name] = info
            for file in zip_file.namelist():
                zip_file.extract(file, dir_path)
            if file_count(dir_path) == 1:
                dir_path = dir_path + '\\' + target[:-4]
            return locate_file(dir_path)
    except Exception as e:
        print(e)
        return '【失败】压缩包解压失败'
```

