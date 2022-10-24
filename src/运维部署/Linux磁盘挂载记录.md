## **Linux磁盘挂载记录**

### 查看磁盘信息

```shell
df -h
```

### 查看未挂载磁盘

```shell
fdisk -l
```

### 树状查看分区信息

```shell
lsblk
```

```
[root@vm192-254-4-195 ~]# lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
vda    253:0    0   50G  0 disk 
└─vda1 253:1    0   50G  0 part /
vdb    253:16   0  600G  0 disk 
```

### 进行分区

- 当硬盘小于等于2T时，用fdisk，大于2T时，用parted

- fdisk
  - n：新建分区
  - p：建立主分区
  - w：写入分区

```shell
fdisk /dev/vdb
```

```
[root@vm192-254-4-195 ~]# fdisk /dev/vdb
Welcome to fdisk (util-linux 2.23.2).

Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Device does not contain a recognized partition table
Building a new DOS disklabel with disk identifier 0x1fb395c9.

Command (m for help): n
Partition type:
   p   primary (0 primary, 0 extended, 4 free)
   e   extended
Select (default p): 
Using default response p
Partition number (1-4, default 1): 
First sector (2048-1258291199, default 2048): 
Using default value 2048
Last sector, +sectors or +size{K,M,G} (2048-1258291199, default 1258291199): 
Using default value 1258291199
Partition 1 of type Linux and of size 600 GiB is set

Command (m for help): w
The partition table has been altered!

Calling ioctl() to re-read partition table.
Syncing disks.
```

### 树状查看分区信息

```
[root@vm192-254-4-195 ~]# lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
vda    253:0    0   50G  0 disk 
└─vda1 253:1    0   50G  0 part /
vdb    253:16   0  600G  0 disk 
└─vdb1 253:17   0  600G  0 part 
```

### 格式化分区

```shell
mkfs.ext4 /dev/vdb1
```

```
[root@vm192-254-4-195 ~]# mkfs.ext4 /dev/vdb1
mke2fs 1.42.9 (28-Dec-2013)
Filesystem label=
OS type: Linux
Block size=4096 (log=2)
Fragment size=4096 (log=2)
Stride=0 blocks, Stripe width=0 blocks
39321600 inodes, 157286144 blocks
7864307 blocks (5.00%) reserved for the super user
First data block=0
Maximum filesystem blocks=2304770048
4800 block groups
32768 blocks per group, 32768 fragments per group
8192 inodes per group
Superblock backups stored on blocks: 
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208, 
	4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968, 
	102400000

Allocating group tables: done                            
Writing inode tables: done                            
Creating journal (32768 blocks): done
Writing superblocks and filesystem accounting information: done
```

### 挂载目录

```shell
mkdir /data
```

```shell
mount /dev/vdb1 /data
```

### 设置永久挂载

```shell
vi /etc/fstab
```

```
/dev/vdb1 /data                   ext4    defaults        0 0
```

### 查看挂载情况

```
[root@vm192-254-4-195 ~]# ll /data
total 16
drwx------ 2 root root 16384 Nov 22 18:43 lost+found
[root@vm192-254-4-195 ~]# df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        50G  2.7G   45G   6% /
devtmpfs         32G     0   32G   0% /dev
tmpfs            32G   16K   32G   1% /dev/shm
tmpfs            32G   57M   32G   1% /run
tmpfs            32G     0   32G   0% /sys/fs/cgroup
/dev/vdb1       591G   73M  561G   1% /data
tmpfs           6.3G     0  6.3G   0% /run/user/0
```