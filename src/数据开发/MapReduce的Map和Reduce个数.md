## **MapReduce的Map和Reduce个数**

### map个数

- bolck_size：块大小，默认为128m，可通过dfs.block.size设置
- total_size：输入文件的大小
- input_file_num：输入文件的个数

#### 默认map个数

- 和block_size相关

  > default_num=total_size/block_size

#### 期望map个数

- 可通过mapred.map.tasks设置，只有在大于default_num时才生效

  > goal_num=mapred.map.tasks

#### 每个InputSplit的最小值

- 即每个task处理的文件大小，可通过mapred.min.split.size设置，只有在大于bolck_size时才生效

  > split_size=max(mapred.min.split.size, block_size)
  >
  > split_num=total_size/split_size

#### 计算map个数

- 每个map处理的数据不能跨文件

  > compute_map_num=min(split_num, max(default_num, goal_num))
  >
  > final_map_num=max(compute_map_num, input_file_num)

#### 设置map个数

1. 增加map个数，设置mapred.map.tasks
2. 减小map个数，设置mapred.min.split.size
3. 对很多小文件减少map个数，先将小文件合并为大文件，再设置mapred.min.split.size

### reduce个数

#### job.setNumReduceTasks(x);