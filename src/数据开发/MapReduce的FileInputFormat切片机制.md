## **MapReduce的FileInputFormat切片机制**

- Client查看输入目录的文件，计算任务分片，如果剩余大小大于切片大小的1.1倍，则分出一个任务片，否则剩余部分为一个任务片，切片计算结果是一个FileSplit[]数组，会序列化任务切片信息数组到资源提交路径

- 计算切片大小的逻辑是Math.max(minSize, Math.min(maxSize, blockSize))

  mapreduce.input.fileinputformat.split.minsize默认值为1

  mapreduce.input.fileinputformat.split.maxsize默认值为Long.MAXValue

  默认情况下切片大小为blocksize