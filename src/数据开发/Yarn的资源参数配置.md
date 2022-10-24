## **Yarn的资源参数配置**

### Yarn的服务器资源容量参数

- yarn-site.xml

  > 一个容器资源（内存）请求的最低单位
  > yarn.scheduler.minimum-allocation-mb   1024
  >
  > 一个容器资源（内存）请求的最大单位
  > yarn.scheduler.maximum-allocation-mb   8192
  >
  > 一个容器资源（CPU）请求的最低单位
  > yarn.scheduler.minimum-allocation-vcores  1
  >
  > 一个容器资源（CPU）请求的最大单位
  > yarn.scheduler.maximum-allocation-vcores  32
  >
  > 一个NodeManager机器上的内存总量
  > yarn.nodemanager.resource.memory-mb   8192
  >
  > NodeManager的物理内存检查开关
  > yarn.nodemanager.pmem-check-enabled    true
  >
  > NodeManager的虚拟内存检查开关（存储在硬盘）
  > yarn.nodemanager.vmem-check-enabled   true
  >
  > NodeManager的虚拟内存对物理内存的比率
  > yarn.nodemanager.vmem-pmem-ratio    2.1
  >
  > 一个NodeManager机器上的CPU虚拟核数总量（和真实的CPU线程为比例关系，影响算力）
  > yarn.nodemanager.resource.cpu-vcores    8

### MR程序的资源申请参数

- 设置方式

  1. 可以通过提交任务时, 在命令后面用 -D 来传入
  2. 也可以在代码中, 用conf.set() 来传入
  3. 也可以在工程的配置文件mapred-site.xml中配置

- mapred-site.xml

  >  一个MRAppMaster进程所需的内存数
  >  yarn.app.mapreduce.am.resource.mb   1536
  >
  >  一个MRAppMaster进程所需的cpu虚拟核数
  >  yarn.app.mapreduce.am.resource.cpu-vcores   1
  >
  >  一个MapTask任务所需要的内存数
  >  mapreduce.map.memory.mb   1024
  >
  >  一个MapTask任务所需要的cpu vcores
  >  mapreduce.map.cpu.vcores   1
  >
  >  一个ReduceTask任务所需要的内存数
  >  mapreduce.reduce.memory.mb   1024
  >
  >  一个ReduceTask任务所需要的cpu vcores
  >  mapreduce.reduce.cpu.vcores   1