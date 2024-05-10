# InnoDB的数据存储结构

- InnoDB将数据划分为页，默认大小为16kb
- 页是磁盘和内存交互的基本单位，一个页中存储多个行记录，页中记录按主键值通过单向链表关联，页之间通过双向链表关联

## 页的上层结构

- 区（extent）
  - 包括64个连续的页，大小为1mb
- 段（segment）
  - 由一个或多个区组成，在文件系统中是连续分配的空间
- 表空间
  - 由一个或多个段组成，从管理上可划分为系统表空间、用户表空间、撤销表空间、临时表空间

## 页的内部结构

- 页的类型：数据页、系统页、Undo页、事务数据页等

- 数据页的组成
  - 文件头（File Header）
  - 页头（Page Header）
  - 最大最小记录（Infimum+supermum）
  - 用户记录（User Records）
  - 空闲空间（Free Space）
  - 页目录（Page Directory）
  - 文件尾（File Tailer）

### 文件头、文件尾

- 文件头：描述页的通用信息
  - FIL_PAGE_SPACE_OR_CHKSUM：页的校验和
    - 存储引擎以页为单位将数据加载到内存进行处理，处理后需将数据同步到磁盘，通过文件头和文件尾的校验和是否相同确认页是否完成同步
  - FIL_PAGE_OFFSET：页号，页的唯一标识
  - FIL_PAGE_PREV：上一页的页号
  - FIL_PAGE_NEXT：下一页的页号
  - FIL_PAGE_LSN：日志序列号（Log Sequence Number）
  - FIL_PAGE_TYPE：页的类型，FIL_PAGE_INDEX是索引页
  - FIL_PAGE_FILE_FLUSH_LSN：仅在系统表空间中，表示文件至少被刷新到了对应的LSBN
  - FIL_PAGE_ARCH_LOG_NO_OR_SPACE_ID：页所属的表空间
- 文件尾：校验页是否完整
  - FIL_PAGE_SPACE_OR_CHKSUM：页的校验和
  - FIL_PAGE_LSN：日志序列号（Log Sequence Number）

### 用户记录、最大最小记录、空闲记录

- 最大最小记录：两个虚拟的行记录
- 用户记录：行记录内容
- 空闲空间：页中还未被使用的空间

### 页头、页目录

- 页头：页的状态信息
  - PAGE_N_DIR_SLOTS：页目录中的槽（分组）数量
  - PAGE_HEAP_TOP：还未使用空间的最小地址
  - PAGE_N_HEAP：记录数量（包括最大最小记录和已删除记录）
  - PAGE_N_RECS：记录数量（不包括最大最小记录和已删除记录）
  - PAGE_FREE：第一个已删除记录的地址
  - PAGE_GARBAGE：已删除记录占用字节数
  - PAGE_LAST_INSERT：最后插入记录位置，便于快速插入连续记录
  - PAGE_DIRECTION：最后插入记录方向，便于快速插入连续记录
  - PAGE_N_DIRECTION：最后插入记录方向连续插入记录数
  - PAGE_MAX_TRX_ID：修改当前页的最大事务ID，仅在二级索引中定义
  - PAGE_LEVEL：当前页在B+树中的层级
  - PAGE_INDEX_ID：当前页所属的索引ID
  - PAGE_BTR_SEG_LEAF：仅在B+树Root页定义，B+树叶子段的头部信息，描述对应segment在inode page中的位置
  - PAGE_BTR_SEG_TOP：仅在B+树Root页定义，B+树非叶子段的头部信息，描述对应segment在inode page中的位置

- 页目录：通过二分查找解决页内单向链表的检索问题
  - 所有记录分为若干组，包括最小记录和最大记录，不包括已删除记录
  - 第一组只有最小记录，最后一组有包括最大记录在内的1-8条记录，中间组包括4-8条记录（记录数到8后再在该组插入数据会分为4和5两组），每个组的最后一条记录的头信息n_owned存储记录数
  - 页目录存储每组最后一条记录的地址偏移量

## InnoDB的行格式

### Compact行格式

- 记录的额外信息
  - 变长字段长度列表
    - 存储所有变长字段数据实际占用的字节长度
  - NULL值列表
    - 记录该行各可空数据是否为null值
  - 记录头信息
    - delete_mask：标记是否删除
      - 删除的记录组成一个垃圾链表，占用的空间被称为可重用空间，可被插入的新记录覆盖
    - min_rec_mask：标记每层非叶子节点的最小记录
    - n_owned：记录数
      - 页目录中每个组的最后一条记录的头信息存储该组的记录数
    - heap_no：记录在本页中的位置
      - 0和1是自动添加的两个虚拟记录，分别是最小记录和最大记录
    - record_type：记录类型，0普通记录、1非叶子节点记录、2最小记录、3最大记录
    - next_record：下一条记录的相对位置
      - 当前记录的真实数据到下一条记录的真实数据的地址偏移量

- 记录的真实数据
  - db_row_id：行ID，唯一标识一条数据（没有主键和唯一标识的列）
  - db_trx_id：事务ID
  - db_roll_ptr：回滚指针

### Dynamic行格式

- （默认行格式）