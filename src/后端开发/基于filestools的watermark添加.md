## **基于filestools的watermark添加**

```python
import os
import shutil
# pip install filestools
from watermarker.marker import add_mark


def process(source):
    for files in os.listdir(source):
        file_path = os.path.join(source, files)
        save_path = source
        if os.path.isfile(file_path):
            file_name_tuple = os.path.splitext(os.path.basename(file_path))
            target_name = file_name_tuple[0] + '_bak' + file_name_tuple[1]
            if file_name_tuple[1] == '.jpg' \
                    and file_name_tuple[0][-4:] != '_bak' \
                    and source[-2:] != '方式' \
                    and target_name not in os.listdir(source):
                print('【备份图片】 ' + os.path.basename(file_path) + '——>' + target_name)
                shutil.copyfile(file_path, os.path.join(save_path, target_name))
                print('【添加水印】 ' + os.path.basename(file_path))
                # 字体大小 不透明度 字体间距 旋转角度
                add_mark(file_path, 'lijiong.cn', source, '#87b1de', 45, 0.1, 75, 30)
            else:
                continue
        elif os.path.isdir(file_path):
            print('【处理目录】—> ' + os.path.basename(file_path))
            process(file_path)
        else:
            print('【未处理】—> ' + file_path)


process("D:\\tmp\\test")
```

