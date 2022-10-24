## **Yarn的任务调度策略**

### 调度器的分类

#### FIFO Scheduler

- 先进先出，优先满足提交时间更早的job的资源需求
- 不太适合用于大型的共享集群（大job会占用所有资源很长时间，导致其他job只能等待）

#### Capacity Scheduler (默认)

- 预分配资源（用定义队列的方式）
- 大job可以放在大队列中运行，不耽误小job在别的队列中运行
- 在同一个队列中，多个job遵循FIFO的策略

#### Scheduler

- 可以预分配队列，但是队列和队列之间可以互相利用对方的资源
- 在一个队列中，多个job之间遵循公平调度原则

### 调度器的配置

- 默认

```xml
<property>
<name>yarn.resourcemanager.scheduler.class</name>
<value>org.apache.hadoop.yarn.server.resourcemanager.scheduler.capacity.CapacityScheduler</value>
</propety>
```

- yarn-site.xml

```xml
<!-- 指定调度器的类型 -- >
<property>
<name>yarn.resourcemanager.scheduler.class</name>
<value>org.apache.hadoop.yarn.server.resourcemanager.scheduler.fair.FairScheduler</value>
</property>
 
<!-- 指定调度器所需的配置文件所在路径 -- >
<property>
<name>yarn.scheduler.fair.allocation.file</name>
<value>/opt/apps/hadoop-3.1.1/etc/hadoop/fair-scheduler.xml</value>
</property>
```