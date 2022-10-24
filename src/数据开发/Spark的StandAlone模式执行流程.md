## **Spark的StandAlone模式执行流程**

1. **Master**启动，定期移除超时的Worker

2. **Worker**启动向Master建立连接，向Master注册

3. 提交任务启动**Spark-Submit**进程，Client模式**Driver**在Spark-Submit进程中

4. Driver向Master建立连接，申请资源

5. Master让Worker启动**Executor**进程

6. Executor启动好后向Driver反向注册

   

7. Driver构建**SparkContext**，创建**RDD**，调用**Transformation和Action**

8. 调用Action形成完整**DAG**，一个DAG就是一个Job

9. 从最后一个RDD从后往前推，遇到宽依赖就划分**Stage**

10. 从前往后提交Stage，一个Stage对应一个**TaskSet**，一个TaskSet中有多个**Task**，Task是Spark中最小的任务执行单元

11. 然后将Task循环出来，序列化通过网络发送给**Executor**

12. Executor将Task反序列化用实现了**Runnable**接口的包装类包装放入线程池

13. 第一阶段Task会把信息汇报给Driver的**ShuffleManager**，生成下一阶段的Task时，Driver会通知Task读数据的位置