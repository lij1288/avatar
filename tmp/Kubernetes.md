# Kubernetes

## 架构和组件

控制面板组件（Master）

kube-apiserver：提供接口服务，可通过部署多个实例进行扩缩

kube-controller-manager：控制器管理器，管理各个类型的控制器。

- 节点控制器（Node Controller）：负责在节点出现故障时进行通知和响应
- 任务控制器（Job Controller）：监测代表一次性任务的 Job 对象，然后创建 Pods 来运行这些任务直至完成
- 端点分片控制器（EndpointSlice Controller）：填充端点分片（EndpointSlice）对象，以提供 Service 和 Pod 之间的链接。
- 服务账号控制器（ServiceAccountController）：为新的命名空间创建默认的服务账号（ServiceAccount）。

cloud-controller-manager：云控制器管理器，对接第三方云平台提供的控制器API

kube-scheduler：按照预定的调度策略将Pod调度到相应节点

etcd：键值数据库，用作Kubernetes所有集群数据的后台数据库

节点组件（Node）

kubelt：负责维护容器的生命周期，以及Volume（CVI）和网络（CNI）的管理

kube-proxy：负责Service的服务发现和负载均衡

Container runtime：容器的运行时环境

附加组件

kube-dns：为整个集群提供DNS服务

Ingress Controller：为服务提供外网入口

Prometheus：资源监控

Dashboard：GUI界面

Federation：提供跨可用区的集群

Fluentd-elasticsearch：提供集群日志采集、存储与查询

## 资源和对象

- Kubernets中所有内容都被抽象为资源，对象是资源的持久化实体。kubectl可通过配置文件创建对象。

### 对象的规约和状态

- 规约（Spec）

  - 必需字段

  - 期望状态

- 状态（Status）

  - 实际状态
    - 有K8S维护，通过一系列控制器管理对象，让对象实际状态尽可能接近期望状态

### 资源的分类

#### 集群

- 作用于集群，集群下的所有资源都可使用
- Namespace
  - Kubernetes支持多个虚拟集群，它们底层依赖于同一个物理集群，这些虚拟集群被称为命名空间，作用是用于实现多团队/环境的资源隔离
  - 命名空间 namespace 是 k8s 集群级别的资源，可以给不同的用户、租户、环境或项目创建对应的命名空间
  - 默认 namespace
    - kube-system 主要用于运行系统级资源，存放 k8s 自身的组件
    - kube-public 此命名空间是自动创建的，并且可供所有用户（包括未经过身份验证的用户）读取。此命名空间主要用于集群使用，关联的一些资源在集群中是可见的并且可以公开读取。此命名空间的公共方面知识一个约定，但不是非要这么要求
    - default 未指定名称空间的资源就是 default，即你在创建pod 时如果没有指定 namespace，则会默认使用 default
- Node
  - 不像其他的资源（如 Pod 和 Namespace），Node 本质上不是Kubernetes 来创建的，Kubernetes 只是管理 Node 上的资源。虽然可以通过 Manifest 创建一个Node对象（如下 json 所示），但 Kubernetes 也只是去检查是否真的是有这么一个 Node，如果检查失败，也不会往上调度 Pod
- ClusterRole
  - 定义一组权限，定义集群级别的权限
- ClusterRoleBinding
  - ClusterRoleBinding：将 Subject 绑定到 ClusterRole，使规则在所有命名空间中生效

#### 命名空间

- 作用于命名空间，只能在该命名空间范围内使用

- 工作负载

  - Pod

    - 容器组，是Kubernetes中最小的可部署单元

    - 代表了Kubernetes中一个独立的应用程序运行实例，该实例可能由单个容器或者几个紧耦合在一起的容器组成

    - 一个Pod包含了应用程序容器、存储资源、一个唯一的网络 IP 地址、以及一些确定容器该如何运行的选项

    - Docker是Kubernetes Pod中使用最广泛的容器引擎

    - 副本（replicas）：被复制的Pod，只有描述性信息不同，可通过控制器的replicas属性指定Pod的副本数量

    - 控制器

      - 适用无状态服务

        - ReplicationController（RC）

          - 帮助动态更新Pod的副本数

          - Replication Controller 简称 RC，RC 是 Kubernetes 系统中的核心概念之一，简单来说，RC 可以保证在任意时间运行 Pod 的副本数量，能够保证 Pod 总是可用的。如果实际 Pod 数量比指定的多那就结束掉多余的，如果实际数量比指定的少就新启动一些Pod，当 Pod 失败、被删除或者挂掉后，RC 都会去自动创建新的 Pod 来保证副本数量，所以即使只有一个 Pod，我们也应该使用 RC 来管理我们的 Pod。可以说，通过 ReplicationController，Kubernetes 实现了 Pod 的高可用性。

        - ReplicaSet（RS）

          - 帮助动态更新Pod的副本数，可通过selector选择对哪些Pod生效
          - label和selector
            - label （标签）是附加到 Kubernetes 对象（比如 Pods）上的键值对，用于区分对象（比如Pod、Service）。 label 旨在用于指定对用户有意义且相关的对象的标识属性，但不直接对核心系统有语义含义。 label 可以用于组织和选择对象的子集。label 可以在创建时附加到对象，随后可以随时添加和修改。可以像 namespace 一样，使用 label 来获取某类对象，但 label 可以与 selector 一起配合使用，用表达式对条件加以限制，实现更精确、更灵活的资源查找。
            - label 与 selector 配合，可以实现对象的“关联”，“Pod 控制器” 与 Pod 是相关联的 —— “Pod 控制器”依赖于 Pod，可以给 Pod 设置 label，然后给“控制器”设置对应的 selector，这就实现了对象的关联。

        - Deployment

          - 对RS的进一步封装，提供了更丰富的部署相关功能
            - 创建Replica Set和Pod
            - 滚动升级和回滚
            - 平滑扩容和缩容
            - 暂停和回复Deployment

      - 适用有状态服务

        - StatefulSet
          - 专门对有状态服务进行部署的控制器
          - StatefulSet 中每个 Pod 的 DNS 格式为 statefulSetName-{0..N-1}.serviceName.namespace.svc.cluster.local
            - serviceName 为 Headless Service的名字
            - 0..N-1 为 Pod 所在的序号，从 0 开始到 N-1
            - statefulSetName 为 StatefulSet 的名字
            - namespace 为服务所在的 namespace，Headless Servic 和 StatefulSet 必须在相同的 namespace
            - .cluster.local 为 Cluster Domain
          - 主要特点
            - 稳定的持久化存储：即 Pod 重新调度后还是能访问到相同的持久化数据，基于 PVC 来实现
            - 稳定的网络标志：稳定的网络标志，即 Pod 重新调度后其 PodName 和 HostName 不变，基于 Headless Service（即没有 Cluster IP 的 Service）来实现
            - 有序部署，有序扩展：有序部署，有序扩展，即 Pod 是有顺序的，在部署或者扩展的时候要依据定义的顺序依次依次进行（即从 0到 N-1，在下一个Pod 运行之前所有之前的 Pod 必须都是 Running 和 Ready 状态），基于 init containers 来实现
            - 有序删除，有序收缩：有序收缩，有序删除（即从 N-1 到 0）
          - 组成
            - Headless Service：用于定义网络标志（DNS domain）
            - volumeClaimTemplate：用于创建持久化卷PersistentVolumes的模板
          - 注意事项
            - kubernetes v1.5 版本以上才支持
            - 所有Pod的Volume必须使用PersistentVolume或者是管理员事先创建好
            - 为了保证数据安全，删除StatefulSet时不会删除Volume
            - StatefulSet 需要一个 Headless Service 来定义 DNS domain，需要在 StatefulSet 之前创建好

      - 守护进程

        - DaemonSet
          - 为每个匹配的Node都部署一个守护进程
          - 典型应用
            - 日志收集：fluentd，logstash等
            - 系统监控：Prometheus Node Exporter，collectd，New Relic agent，Ganglia gmond等
            - 系统程序：kube-proxy, kube-dns, glusterd, ceph等

      - 任务/定时任务

        - Job
          - 一次性任务，运行完成后Pod销毁，不再重新启动新容器
        - CronJob
          - 在 Job 基础上加上了定时功能

- 服务发现

  - Service
    - 实现K8S集群内部网络调用
  - Ingress
    - 实现将K8S内部服务暴露给外网访问
    - ingress相当于路由规则的集合，实现路由功能的是Ingress Controller

- 存储

  - Volume
    - 数据卷，共享Pod中容器使用的数据。用来放持久化的数据，比如数据库数据
  - Container Storage Interface（CSI）
    - 由来自 Kubernetes、Mesos、Docker 等社区成员联合制定的一个行业标准接口规范，旨在将任意存储系统暴露给容器化应用程序

- 特殊类型配置

  - Secret
    - Secret 解决了密码、token、密钥等敏感数据的配置问题，而不需要把这些敏感数据暴露到镜像或者 Pod Spec 中。Secret 可以以 Volume 或者环境变量的方式使用
    - Secret的类型
      - Service Account：用来访问 Kubernetes API，由 Kubernetes 自动创建，并且会自动挂载到 Pod 的/run/secrets/kubernetes.io/serviceaccount 目录中；
      - Opaque：base64 编码格式的 Secret，用来存储密码、密钥等；
      - kubernetes.io/dockerconfigjson：用来存储私有 docker registry 的认证信息。
  - ConfigMap
    - 用于存放配置，与 Secret 是类似的，只是 ConfigMap 放的是明文的数据，Secret 是密文存放
  - DownwardAPI
    - 用于将Pod信息共享到容器内
    - DownwardAPI的两种方式
      - 环境变量：用于单个变量，可以将 pod 信息和容器信息直接注入容器内部
      - volume 挂载：将 pod 信息生成为文件，直接挂载到容器内部中去

- 其他

  - Role
    - 定义一组权限，定义命名空间级别的权限Role 是一组权限的集合，例如 Role 可以包含列出 Pod 权限及列出 Deployment 权限，Role 用于给某个 Namespace 中的资源进行鉴权。
  - RoleBinding
    - 将 Subject 绑定到 Role，使规则在命名空间内生效

#### 元数据

- 对于资源的元数据描述，每一个资源都可使用
- Horizontal Pod Autoscaler（HPA）
  - 根据CPU使用率或自定义指标（metrics）自动对Pod进行扩/缩容
  - 控制管理器每隔30s（–horizontal-pod-autoscaler-sync-period）查询metrics的资源使用情况
  - 支持的metrics类型
    - 预定义metrics（比如Pod的CPU）以利用率的方式计算
    - 自定义的Pod metrics，以原始值（raw value）的方式计算
    - 自定义的object metrics
  - metrics查询方式
    - Heapster
    - 自定义REST API
- PodTemplate
  - 对Pod的定义，被包含在其他的Kubernetes对象中，控制器通过PodTemplate信息来创建Pod
- LimitRange
  - 对集群内Request和Limits的配置做全局的统一的限制，相当于批量设置了某一个范围内（某个命名空间）的Pod的资源使用限制

# Pod相关概念

## Pod配置文件

```yaml
apiVersion: v1 # api文档版本
kind: Pod  # 资源对象类型，也可配置为Deployment、StatefulSet等
metadata: # Pod相关的元数据，用于描述Pod的数据
  name: nginx-demo # Pod的名称
  labels: # 定义Pod的标签
    type: app # 自定义label标签，名字为type，值为app
    test: 1.0.0 # 自定义label标签，描述Pod版本号
  namespace: 'default' # 命名空间配置
spec: # Pod的期望状态
  containers: # 对Pod中的容器描述
  - name: nginx # 容器名称
    image: nginx:latest # 指定容器镜像
    imagePullPolicy: IfNotPresent # 镜像拉取策略，指定若本地有则使用，若没有则远程拉取
    command: # 指定容器启动时执行的命令
    - nginx
    - -g
    - 'daemon off;' # nginx -g 'daemon off;'
    workingDir: /usr/share/nginx/html # 定义容器启动后的工作目录
    ports: # 端口信息
    - name: http # 端口名称
      containerPort: 80 # 描述容器内暴露的端口
      protocol: TCP # 描述该端口的通信协议
    env: # 环境变量
    - name: JVM_OPTS # 环境变量名称
      value: '-Xms128m -Xmx128m' # 环境变量值
    resources:
      requests: # 最少需要的资源
        cpu: 100m # 限制cpu最少使用0.1个核心
        memory: 128Mi # 限制内存最少使用128兆
      limits: # 最多可用的资源
        cpu: 200m # 限制cpu最多使用0.2个核心
        memory: 256Mi # 限制内存最多使用256兆
  restartPolicy: OnFailure # 重启策略，只有失败才会重启
```

> kubectl create -f nginx-demo.yaml

> kubectl get po -o wide

```
NAME         READY   STATUS    RESTARTS   AGE     IP             NODE        NOMINATED NODE   READINESS GATES
nginx-demo   1/1     Running   0          4m26s   10.244.36.68   k8s-node1   <none>           <none>
```

> route -n

```
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.168.1.99    0.0.0.0         UG    100    0        0 ens33
10.244.36.64    192.168.1.112   255.255.255.192 UG    0      0        0 tunl0
10.244.169.128  192.168.1.113   255.255.255.192 UG    0      0        0 tunl0
10.244.235.192  0.0.0.0         255.255.255.192 U     0      0        0 *
172.17.0.0      0.0.0.0         255.255.0.0     U     0      0        0 docker0
192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 ens33
```

> kubectl describe po nginx-demo

```
Name:         nginx-demo
Namespace:    default
Priority:     0
Node:         k8s-node1/192.168.1.112
Start Time:   Wed, 05 Jun 2024 17:35:45 +0800
Labels:       test=1.0.0
              type=app
Annotations:  cni.projectcalico.org/containerID: 94acf1c24b80cf86e124fe3458479f2ff6f1568d67332cbf9c68a0f16769cc78
              cni.projectcalico.org/podIP: 10.244.36.68/32
              cni.projectcalico.org/podIPs: 10.244.36.68/32
Status:       Running
IP:           10.244.36.68
IPs:
  IP:  10.244.36.68
Containers:
  nginx:
    Container ID:  docker://6edef47e10d71f0f843b3c82fbe672156403dcdf0c6ec157f246d12a292b5609
    Image:         nginx:latest
    Image ID:      docker-pullable://nginx@sha256:0f04e4f646a3f14bf31d8bc8d885b6c951fdcf42589d06845f64d18aec6a3c4d
    Port:          80/TCP
    Host Port:     0/TCP
    Command:
      nginx
      -g
      daemon off;
    State:          Running
      Started:      Wed, 05 Jun 2024 17:35:46 +0800
    Ready:          True
    Restart Count:  0
    Limits:
      cpu:     200m
      memory:  256Mi
    Requests:
      cpu:     100m
      memory:  128Mi
    Environment:
      JVM_OPTS:  -Xms128m -Xmx128m
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-v5vcm (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             True 
  ContainersReady   True 
  PodScheduled      True 
Volumes:
  kube-api-access-v5vcm:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   Burstable
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  59s   default-scheduler  Successfully assigned default/nginx-demo to k8s-node1
  Normal  Pulled     59s   kubelet            Container image "nginx:latest" already present on machine
  Normal  Created    59s   kubelet            Created container nginx
  Normal  Started    59s   kubelet            Started container nginx
```

## Pod的探针

- 容器内应用的监测机制，根据不同的探针来判断容器应用当前的状态

### 探针的类型

#### StartupProbe

- 用于判断应用程序是否已经启动
- 配置了StartupProbe后，会先禁用其他探针，直到 startupProbe 成功后，其他探针才会启用
- 解决不能准确预估应用启动时间，配置其他探针时无法配置初始化时长来检测的问题

```yaml
startupProbe:
  httpGet:
    path: /api/startup
    port: 80
```

#### LivenessProbe

- 用于探测容器中的应用是否运行，如果探测失败，kubelet会根据配置的重启策略进行重启，若没有配置，默认容器启动成功，不会执行重启策略

```yaml
livenessProbe:
  failureThreshold: 5
  httpGet:
    path: /health
    port: 8080
    scheme: HTTP
  initialDelaySeconds: 60
  periodSeconds: 10
  successThreshold: 1
  timeoutSeconds: 5
```

#### ReadinessProbe

- 用于探测容器中的应用是否健康，若返回值为success，则认为容器已经完全启动，并且该容器是可以接收外部流量的

```yaml
readinessProbe:
  failureThreshold: 3 # 错误次数
  httpGet:
    path: /ready
    port: 8181
    scheme: HTTP
  periodSeconds: 10 # 间隔时间
  successThreshold: 1
  timeoutSeconds: 1
```

### 探针的探测方式

#### ExecAction

- 在容器内部执行一个命令，如果返回值为0则认为容器健康

```yaml
livenessProbe:
  exec:
    command:
      - cat
      - /health
```

#### TCPSocketAction

- 通过tcp连接监测容器内端口是否开放，如果开放则认为容器健康

```yaml
livenessProbe:
  tcpSocket:
    port: 80
```

#### HTTPGetAction

- 发送HTTP请求到容器内的应用程序，如果接口返回的状态码在 200~400 之间则认为容器健康

```yaml
livenessProbe:
  failureThreshold: 5
  httpGet:
    path: /health
    port: 8080
    scheme: HTTP
    httpHeaders:
      - name: xxx
        value: xxx
```

### 探针的参数配置

- 初始化时间

  > initialDelaySeconds: 60

- 超时时间

  > timeoutSeconds: 2

- 监测间隔时间

  > periodSeconds: 5

- 监测成功1次就表示成功

  > successThreshold: 1

- 监测失败2次就表示失败

  > failureThreshold: 2

> kubectl get deploy -n kube-system

> kubectl edit deploy -n kube-system coredns

```yaml
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    deployment.kubernetes.io/revision: "1"
  creationTimestamp: "2024-06-04T09:17:52Z"
  generation: 1
  labels:
    k8s-app: kube-dns
  name: coredns
  namespace: kube-system
  resourceVersion: "4487"
  uid: 99d3ceca-14a6-4ab7-9d50-430eeb90f908
spec:
  progressDeadlineSeconds: 600
  replicas: 2
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      k8s-app: kube-dns
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      creationTimestamp: null
      labels:
        k8s-app: kube-dns
    spec:
      containers:
      - args:
        - -conf
        - /etc/coredns/Corefile
        image: registry.aliyuncs.com/google_containers/coredns:v1.8.6
        imagePullPolicy: IfNotPresent
        livenessProbe:
          failureThreshold: 5
          httpGet:
            path: /health
            port: 8080
            scheme: HTTP
          initialDelaySeconds: 60
          periodSeconds: 10
          successThreshold: 1
          timeoutSeconds: 5
        name: coredns
        ports:
        - containerPort: 53
          name: dns
          protocol: UDP
        - containerPort: 53
          name: dns-tcp
          protocol: TCP
        - containerPort: 9153
          name: metrics
          protocol: TCP
        readinessProbe:
          failureThreshold: 3
          httpGet:
            path: /ready
            port: 8181
            scheme: HTTP
          periodSeconds: 10
          successThreshold: 1
          timeoutSeconds: 1
        resources:
          limits:
            memory: 170Mi
          requests:
            cpu: 100m
            memory: 70Mi
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            add:
            - NET_BIND_SERVICE
            drop:
            - all
          readOnlyRootFilesystem: true
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
        volumeMounts:
        - mountPath: /etc/coredns
          name: config-volume
          readOnly: true
      dnsPolicy: Default
      nodeSelector:
        kubernetes.io/os: linux
      priorityClassName: system-cluster-critical
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      serviceAccount: coredns
      serviceAccountName: coredns
      terminationGracePeriodSeconds: 30
      tolerations:
      - key: CriticalAddonsOnly
        operator: Exists
      - effect: NoSchedule
        key: node-role.kubernetes.io/master
      - effect: NoSchedule
        key: node-role.kubernetes.io/control-plane
      volumes:
      - configMap:
          defaultMode: 420
          items:
          - key: Corefile
            path: Corefile
          name: coredns
        name: config-volume
status:
  availableReplicas: 2
  conditions:
  - lastTransitionTime: "2024-06-04T10:03:17Z"
    lastUpdateTime: "2024-06-04T10:03:17Z"
    message: Deployment has minimum availability.
    reason: MinimumReplicasAvailable
    status: "True"
    type: Available
  - lastTransitionTime: "2024-06-04T10:03:17Z"
    lastUpdateTime: "2024-06-04T10:03:18Z"
    message: ReplicaSet "coredns-6d8c4cb4d" has successfully progressed.
    reason: NewReplicaSetAvailable
    status: "True"
    type: Progressing
  observedGeneration: 1
  readyReplicas: 2
  replicas: 2
  updatedReplicas: 2
```



## Pod的生命周期

- init container初始化容器
- 钩子函数：回调函数

### Pod的退出流程

- Endpoint删除pod的ip地址

- Pod转为Terminating状态

  - 转为删除中的状态后，会给Pod一个宽限期，让Pod执行清理或销毁操作

    ```yaml
    # 删除操作后保留的时间，作用于Pod中的所有容器
    terminationGracePeriodSeconds: 30
    containers:
      - xxx
    ```

- 执行preStop的指令

### PreStop的应用

- 注册中心下线
- 数据清理
- 数据销毁

# Kubernets的资源调度

## Label和Selector

### Label

#### 配置文件

- 在各类资源的metadata.labels中设置

#### kubectl

- 临时创建label（不更新模板）

  > kubectl label po <资源名称> app=demo
  >
  > kubectl label po nginx-demo app=demo

- 修改已经存在的label

  > kubectl label po <资源名称> app=demo2 --overwrite

- 查看label

  - 按照label值查找节点

    > kubectl get po -A -l app=demo

  - 查看所有节点的labels

    > kubectl get po --show-labels

### Selector

#### 配置文件

- 在各对象的spec.selector或其他可以写selector的属性中设置

#### kubectl

- 匹配单个值

  - -A 全部命名空间

  > kubectl get po -A -l app=demo

- 匹配多个条件、不等值、语句

  > kubectl get po -A -l app!=demo2,'test in (1.0.0, 1.0.1, 1.0.2)'

## Deployment

#### 功能

- 创建

  - 通过image创建

    > kubectl create deploy nginx-deploy --image=nginx

    - 嵌套关系

    ```shell
    [root@k8s-master ~]# kubectl get deployments
    NAME           READY   UP-TO-DATE   AVAILABLE   AGE
    nginx-deploy   1/1     1            1           69s
    [root@k8s-master ~]# kubectl get replicasets
    NAME                      DESIRED   CURRENT   READY   AGE
    nginx-deploy-6c758c8d46   1         1         1       73s
    [root@k8s-master ~]# kubectl get pods
    NAME                            READY   STATUS    RESTARTS   AGE
    nginx-deploy-6c758c8d46-4gjlf   1/1     Running   0          78s
    ```

    - 获取配置信息

    > kubectl get deploy nginx-deploy -o yaml

  - 通过yaml创建

    > kubectl create -f xxx.yaml --record

- 滚动更新

  - 修改了deployment配置文件template中属性后，触发更新操作

    > kubectl set image deployment/nginx-deployment nginx=nginx:1.9.1

    > kubectl edit deployment/nginx-deployment

  - 查看滚动更新过程

    > kubectl rollout status deploy <deployment_name>

  - 查看部署描述，最后展示发生的event列表也可以看到滚动更新过程

    > kubectl describe deploy <deployment_name>

  - 通过kubectl get deployments获取部署信息，UP-TO-DATE 表示已经有多少副本达到了配置中要求的数目

  - 通过kubectl get rs可以看到增加了一个新的 rs

  - 通过kubectl get pods可以看到所有pod关联的rs变成了新的

- 回滚

  - 通过revision history limit设置保存的revison数（默认为2）

  - 获取revison列表

    - 创建或修改时可通过--record添加CHANGE-CAUSE

    > kubectl rollout history deployment/nginx-deploy

  - 查看详细信息

    > kubectl rollout history deployment/nginx-deploy --revision=2

  - 回退到指定的revision

    > kubectl rollout undo deployment/nginx-deploy --to-revision=2

- 扩容缩容

  - 可通过kube scale进行扩容缩容
  - 可通过kube edit编辑replcas 进行扩容缩容
  - 扩容缩容只是直接影响副本数，没有更新pod template，因此不会创建新的 rs

- 暂停与恢复

  - 频繁修改信息会触发多次更新，可以暂停滚动更新

    > kubectl rollout pause deployment <name>

  - 恢复滚动更新

    > kubectl rollout deploy <name>

#### 配置文件

```yaml
apiVersion: apps/v1 # deployment api 版本
kind: Deployment # 资源类型为deployment
metadata: # 元信息
  labels: # 标签
    app: nginx-deploy
  name: nginx-deploy
  namespace: default
spec:
  replicas: 1 # 期望副本数
  revisionHistoryLimit: 10 # 进行滚动更新后，保留的历史版本数
  selector: # 选择器，用于找到匹配的RS
    matchLabels: # 按照标签匹配
      app: nginx-deploy # 匹配的标签key/value
  strategy: # 更新策略
    rollingUpdate: # 滚动更新配置
      maxSurge: 25% # 进行滚动更新时，更新的个数最多可以超过期望副本数的个数/比例
      maxUnavailable: 25% # 进行滚动更新时，更新的个数最多可以少于期望副本数的个数/比例
    type: RollingUpdate # 更新类型，采用滚动更新
  template: # pod模板
    metadata: # pod的元信息
      labels: # pod的标签
        app: nginx-deploy
    spec: # pod期望信息
      containers: # pod的容器
      - image: nginx # 镜像
        imagePullPolicy: IfNotPresent # 拉取策略
        name: nginx # 容器名称
      restartPolicy: Always # 重启策略
      terminationGracePeriodSeconds: 30 # 删除操作最多宽限多长时间
```

## StatefulSet

#### 功能

- 创建

  - 通过yaml文件创建

    > kubectl create -f web.yaml

  - 查看service和statefulset

    > kubectl get svc nginx

    > kubectl get sts web

  - 查看pvc信息

    > kubectl get pvc

  - 查看创建的pod

    > kubectl get pods -l app=nginx

  - 查看pod的dns

    - 运行一个 pod，基础镜像为busybox工具包，通过nslookup查看dns信息

      > kubectl run -i --tty --image busybox dns-test --restart=Never --rm /bin/sh

      > nslookup web-0.nginx

- 镜像更新

  - 目前不支持直接更新 image，需要通过patch来间接实现

    kubectl patch sts web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"nginx:1.9.1"}]'

  - RollingUpdate

    - StatefulSet也可以采用滚动更新策略，同样是修改pod template属性后会触发更新，由于pod是有序的，在StatefulSet中更新时是基于pod的顺序倒序更新
    - 灰度发布
      - 利用滚动更新中的partition属性，可以实现简易的灰度发布的效果，如有5个pod，如果当前partition设置为3，那么滚动更新时，只会更新序号 >= 3 的pod
      - 利用该机制可以通过控制partition的值，来只更新其中一部分pod，确认没有问题后再增加更新的pod数量，最终实现全部pod更新

  - OnDelete

    - 只有在pod被删除时会进行更新操作

- 扩容缩容

  > kubectl scale statefulset web --replicas=5

  > kubectl patch statefulset web -p '{"spec":{"replicas":3}}'

- 删除

  - 级联删除

    - 删除statefulset同时删除pods

      > kubectl delete sts web

  - 非级联删除

    - 删除statefulset不删除pods

      > kubectl delte sts web --cascade=false

  - 删除service

    > kubectl delete svc nginx

- 删除pvc

  - StatefulSet删除后PVC还会保留着，数据不再使用的话也需删除

    > kubectl delete pvc www-web-0 www-web-1

#### 配置文件

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  serviceName: "nginx"
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
      annotations:
        volume.alpha.kubernetes.io/storage-class: anything
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi
```



## DaemonSet

#### 配置文件

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
spec:
  selector:
    matchLabels:
      app: logging
  template:
    metadata:
      labels:
        app: logging
        id: fluentd
      name: fluentd
    spec:
      containers:
      - name: fluentd-es
        image: agilestacks/fluentd-elasticsearch:v1.3.0
        env:
         - name: FLUENTD_ARGS
           value: -qq
        volumeMounts:
         - name: containers
           mountPath: /var/lib/docker/containers
         - name: varlog
           mountPath: /varlog
      volumes:
         - hostPath:
             path: /var/lib/docker/containers
           name: containers
         - hostPath:
             path: /var/log
           name: varlog
```

#### 指定Node节点

- DaemonSet会忽略Node的unschedulable状态，有两种方式来指定 Pod 只运行在指定的 Node节点上
  - nodeSelector：只调度到匹配指定label的Node上
  - nodeAffinity：功能更丰富的Node选择器，比如支持集合操作
  - podAffinity：调度到满足条件的Pod所在的Node上

- nodeSelector

  - 先为Node打上标签

    > kubectl label nodes k8s-node1 svc_type=microsvc

  - 然后在daemonset配置中设置nodeSelector

    ```yaml
    spec:
      template:
        spec:
          nodeSelector:
            svc_type: microsvc
    ```

- nodeAffinity

  - nodeAffinity 目前支持两种：requiredDuringSchedulingIgnoredDuringExecution 和 preferredDuringSchedulingIgnoredDuringExecution，分别代表必须满足条件和优选条件

  - 比如下面的例子代表调度到包含标签 wolfcode.cn/framework-name 并且值为 spring 或 springboot 的 Node 上，并且优选还带有标签 another-node-label-key=another-node-label-value 的Node

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: with-node-affinity
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: wolfcode.cn/framework-name
                operator: In
                values:
                - spring
                - springboot
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 1
            preference:
              matchExpressions:
              - key: another-node-label-key
                operator: In
                values:
                - another-node-label-value
      containers:
      - name: with-node-affinity
        image: pauseyyf/pause
    ```

- podAffinity

  - podAffinity 基于 Pod 的标签来选择 Node，仅调度到满足条件Pod 所在的 Node 上，支持 podAffinity 和 podAntiAffinity

    - 如果一个 “Node 所在空间中包含至少一个带有 auth=oauth2 标签且运行中的 Pod”，那么可以调度到该 Node,不调度到 “包含至少一个带有 auth=jwt 标签且运行中 Pod”的 Node 上

      ```yaml
      apiVersion: v1
      kind: Pod
      metadata:
        name: with-pod-affinity
      spec:
        affinity:
          podAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                - key: auth
                  operator: In
                  values:
                  - oauth2
              topologyKey: failure-domain.beta.kubernetes.io/zone
          podAntiAffinity:
            preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                  - key: auth
                    operator: In
                    values:
                    - jwt
                topologyKey: kubernetes.io/hostname
        containers:
        - name: with-pod-affinity
          image: pauseyyf/pause
      ```

#### 滚动更新

- 不建议使用RollingUpdate，建议使用OnDelete，避免频繁更新ds

## HPA自动扩容/缩容

#### 开启指标服务

- 下载metrics-server组件配置文件

  > wget https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml -O metrics-server-components.yaml

- 修改镜像地址为国内的地址

  > sed -i 's/k8s.gcr.io\/metrics-server/registry.cn-hangzhou.aliyuncs.com\/google_containers/g' metrics-server-components.yaml

- 修改容器的tls配置，不验证tls，在containers的args参数中增加--kubelet-insecure-tls参数

- 安装组件

  > kubectl apply -f metrics-server-components.yaml

- 查看pod状态

  > kubectl get pods --all-namespaces | grep metrics

#### CPU、内存指标监控

- 实现CPU或内存监控，必须配置resources.requests.cpu或resources.requests.memory，进一步配置cpu/memory 达到上述配置的百分比后进行扩容或缩容

  > kubectl autoscale deploy nginx-deploy --cpu-percent=20 --min=2 --max=5

#### 自定义metrics

- 控制管理器开启–horizontal-pod-autoscaler-use-rest-clients
- 控制管理器的–apiserver指向API Server Aggregator
- 在API Server Aggregator中注册自定义的metrics API

# Kubernetes的服务发布

## Service

### 配置文件

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
  labels:
    app: nginx-svc
spec:
  ports:
  - name: http # service 端口配置的名称
    protocol: TCP # 端口绑定的协议，支持TCP、UDP、SCTP，默认为TCP
    port: 80 # service 自己的端口
    targetPort: 9527 # 目标 pod 的端口
  - name: https
    port: 443
    protocol: TCP
    targetPort: 443
  selector: # 选中当前service匹配哪些pod，对哪些pod的东西流量进行代理
    app: nginx
```

### 命令操作

- 创建service

  > kubectl create -f nginx-svc.yaml

- 查看service信息，通过service的cluster ip进行访问

  > kubectl get svc 

- 查看pod信息，通过pod的ip进行访问

  > kubectl get po -owide

- 创建其他pod通过service name进行访问（推荐）

  > kubectl exec -it busybox -- sh

  > curl http://nginx-svc

- 默认在当前namespace中访问，如果需跨namespace访问pod，则在service name后加 .\<namespace> 即可

  > curl http://nginx-svc.default

### Endpoint

### 代理K8S外部服务

- 实现方式

  1. 编写 service 配置文件时，不指定 selector 属性
  2. 自己创建 endpoint

  ```yaml
  apiVersion: v1
  kind: Endpoints
  metadata:
    labels:
      app: wolfcode-svc-external # 与service一致
    name: wolfcode-svc-external # 与service一致
    namespace: default # 与service一致
  subsets:
  - addresses:
    - ip: <target ip> # 目标ip地址
    ports: # 与service一致
    - name: http
      port: 80
      protocol: TCP
  ```

- 应用
  - 各环境访问名称统一
  - 访问K8S集群外的其他服务
  - 项目迁移

### 反向代理外部服务

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: wolfcode-external-domain
  name: wolfcode-external-domain
spec:
  type: ExternalName
  externalName: www.wolfcode.cn
```

### 常用类型

- ClusterIP
  - 只能在集群内部使用，不配置类型的话默认就是 ClusterIP
- ExternalName
  - 返回定义的 CNAME 别名，可以配置为域名
- NodePort
  - 会在所有安装了 kube-proxy 的节点都绑定一个端口，此端口可以代理至对应的 Pod，集群外部可以使用任意节点 ip + NodePort 的端口号访问到集群中对应 Pod 中的服务
  - 当类型设置为 NodePort 后，可以在 ports 配置中增加 nodePort 配置指定端口，如果不指定会随机指定端口，需要在下方的端口范围内
    - 端口范围：30000~32767
    - 端口范围配置在 /usr/lib/systemd/system/kube-apiserver.service 文件中
- LoadBalancer
  - 使用云服务商（阿里云、腾讯云等）提供的负载均衡器服务

## Ingress

### 安装ingress-nginx

#### 添加helm仓库

- 添加仓库

  > helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

- 查看仓库列表

  > helm repo list

- 搜索ingress-nginx

  > helm search repo ingress-nginx

#### 下载安装包

> helm pull ingress-nginx/ingress-nginx

#### 配置参数

- 解压安装包

  > tar xf ingress-nginx-xxx.tgz

- 进入目录

  > cd ingress-nginx

- 修改values.yaml镜像地址

  ```yaml
  registry: registry.cn-hangzhou.aliyuncs.com
  image: google_containers/nginx-ingress-controller
  image: google_containers/kube-webhook-certgen
  tag: v1.3.0
  
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
  ```
  
- 修改部署配置的 kind: DaemonSet

  ```
  nodeSelector:
    ingress: "true" # 增加选择器，如果 node 上有 ingress=true 就部署
  将 admissionWebhooks.enabled 修改为 false
  将 service 中的 type 由 LoadBalancer 修改为ClusterIP，如果服务器是云平台才用LoadBalancer
  ```
#### 创建Namespace

- 为ingress专门创建一个namespace

  > kubectl create ns ingress-nginx

#### 安装ingress

- 为需要部署ingress的节点上加标签

  > kubectl label node k8s-node1 ingress=true

- 安装ingress-nginx

  > helm install ingress-nginx ./ingress-nginx -n ingress-nginx

### 基本使用

- 创建一个ingress

  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress # 资源类型为 Ingress
  metadata:
    name: wolfcode-nginx-ingress
    annotations:
      kubernetes.io/ingress.class: "nginx"
      nginx.ingress.kubernetes.io/rewrite-target: /
  spec:
    rules: # ingress 规则配置，可以配置多个
    - host: k8s.wolfcode.cn # 域名配置，可以使用通配符 *
      http:
        paths: # 相当于 nginx 的 location 配置，可以配置多个
        - pathType: Prefix # 路径类型，按照路径类型进行匹配 ImplementationSpecific 需要指定 IngressClass，具体匹配规则以 IngressClass 中的规则为准。Exact：精确匹配，URL需要与path完全匹配上，且区分大小写的。Prefix：以 / 作为分隔符来进行前缀匹配
          backend:
            service: 
              name: nginx-svc # 代理到哪个 service
              port: 
                number: 80 # service 的端口
          path: /api # 等价于 nginx 中的 location 的路径前缀匹配
  ```

- 多域名配置

  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress # 资源类型为 Ingress
  metadata:
    name: wolfcode-nginx-ingress
    annotations:
      kubernetes.io/ingress.class: "nginx"
      nginx.ingress.kubernetes.io/rewrite-target: /
  spec:
    rules: # ingress 规则配置，可以配置多个
    - host: k8s.wolfcode.cn # 域名配置，可以使用通配符 *
      http:
        paths: # 相当于 nginx 的 location 配置，可以配置多个
        - pathType: Prefix # 路径类型，按照路径类型进行匹配 ImplementationSpecific 需要指定 IngressClass，具体匹配规则以 IngressClass 中的规则为准。Exact：精确匹配，URL需要与path完全匹配上，且区分大小写的。Prefix：以 / 作为分隔符来进行前缀匹配
          backend:
            service: 
              name: nginx-svc # 代理到哪个 service
              port: 
                number: 80 # service 的端口
          path: /api # 等价于 nginx 中的 location 的路径前缀匹配
        - pathType: Exec # 路径类型，按照路径类型进行匹配 ImplementationSpecific 需要指定 IngressClass，具体匹配规则以 IngressClass 中的规则为准。Exact：精确匹配>，URL需要与path完全匹配上，且区分大小写的。Prefix：以 / 作为分隔符来进行前缀匹配
          backend:
            service:
              name: nginx-svc # 代理到哪个 service
              port:
                number: 80 # service 的端口
          path: /
    - host: api.wolfcode.cn # 域名配置，可以使用通配符 *
      http:
        paths: # 相当于 nginx 的 location 配置，可以配置多个
        - pathType: Prefix # 路径类型，按照路径类型进行匹配 ImplementationSpecific 需要指定 IngressClass，具体匹配规则以 IngressClass 中的规则为准。Exact：精确匹配>，URL需要与path完全匹配上，且区分大小写的。Prefix：以 / 作为分隔符来进行前缀匹配
          backend:
            service:
              name: nginx-svc # 代理到哪个 service
              port:
                number: 80 # service 的端口
          path: /
  ```



# Kubernetes的配置管理

### ConfigMap

- 一般用于去存储Pod中应用所需的一些配置信息或环境变量，将配置与Pod分开，避免应为修改配置导致还需要重新构建镜像与容器
- 使用kubectl create configmap -h查看示例，构建configmap对象

### 加密数据配置Secret

- 与ConfigMap类似，用于存储配置信息，但是主要用于存储敏感信息、需要加密的信息，Secret可以提供数据加密、解密功能
- 在创建Secret时，要注意如果要加密的字符中，包含了有特殊字符，需要使用转义符转移，例如$转移后为$，也可以对特殊字符使用单引号描述，这样就不需要转移例如 1$289\*-! 转换为 '1$289*-!'

### SubPath的使用

- 使用 ConfigMap 或 Secret 挂载到目录的时候，会将容器中源目录给覆盖掉，此时我们可能只想覆盖目录中的某一个文件，但是这样的操作会覆盖整个文件，因此需要使用到 SubPath

- 配置方式

  1. 定义 volumes 时需要增加 items 属性，配置 key 和 path，且 path 的值不能从 / 开始
  2. 在容器内的 volumeMounts 中增加 subPath 属性，该值与 volumes 中 items.path 的值相同

  ```yaml
  ontainers:
    ......
    volumeMounts:
    - mountPath: /etc/nginx/nginx.conf # 挂载到哪里
      name: config-volume # 使用哪个 configmap 或 secret
      subPath: etc/nginx/nginx.conf # 与 volumes.[0].items.path 相同
  volumes:
  - configMap:
    name: nginx-conf # configMap 名字
    items: # subPath 配置
      key: nginx.conf # configMap 中的文件名
      path: etc/nginx/nginx.conf # subPath 路径
  ```

### 配置的热更新

```

```

- 通常会将项目的配置文件作为 configmap 然后挂载到 pod，如果更新 configmap 中的配置，pod更新情况
  - 默认方式：会更新，更新周期是更新时间 + 缓存时间
  - subPath：不会更新
  - 变量形式：如果 pod 中的一个变量是从 configmap 或 secret 中得到，同样也是不会更新的
- 对于 subPath 的方式，我们可以取消 subPath 的使用，将配置文件挂载到一个不存在的目录，避免目录的覆盖，然后再利用软连接的形式，将该文件链接到目标位置，如果目标位置原本就有文件，可能无法创建软链接，此时可以基于前面讲过的 postStart 操作执行删除命令，将默认的吻技安删除即可

#### 通过 edit 命令直接修改 configmap

#### 通过 replace 替换

- 由于 configmap 我们创建通常都是基于文件创建，并不会编写 yaml 配置文件，因此修改时我们也是直接修改配置文件，而 replace 是没有 --from-file 参数的，因此无法实现基于源配置文件的替换，此时我们可以利用下方的命令实现

- 该命令的重点在于 --dry-run 参数，该参数的意思打印 yaml 文件，但不会将该文件发送给 apiserver，再结合 -oyaml 输出 yaml 文件就可以得到一个配置好但是没有发给 apiserver 的文件，然后再结合 replace 监听控制台输出得到 yaml 数据即可实现替换

  > kubectl create cm --from-file=nginx.conf --dry-run -oyaml | kubectl replace -f-

### 不可变的Secret和ConfigMap

- 对于一些敏感服务的配置文件，在线上有时是不允许修改的，此时在配置 configmap 时可以设置 immutable: true 来禁止修改

# Kubernetes的持久化存储

## Volumes

#### HostPath

- 将节点上的文件或目录挂载到 Pod 上，此时该目录会变成持久化存储目录，即使 Pod 被删除后重启，也可以重新加载到该目录，该目录下的文件不会丢失

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: nginx
    name: nginx-volume
    volumeMounts:
    - mountPath: /test-pd # 挂载到容器的哪个目录
      name: test-volume # 挂载哪个 volume
  volumes:
  - name: test-volume
    hostPath:
      path: /data # 节点中的目录
      type: Directory # 检查类型，在挂载前对挂载目录做什么检查操作，有多种选项，默认为空字符串，不做任何检查


类型：
空字符串：默认类型，不做任何检查
DirectoryOrCreate：如果给定的 path 不存在，就创建一个 755 的空目录
Directory：这个目录必须存在
FileOrCreate：如果给定的文件不存在，则创建一个空文件，权限为 644
File：这个文件必须存在
Socket：UNIX 套接字，必须存在
CharDevice：字符设备，必须存在
BlockDevice：块设备，必须存在
```

#### EmptyDir

- EmptyDir 主要用于一个 Pod 中不同的 Container 共享数据使用的，由于只是在 Pod 内部使用，因此与其他 volume 比较大的区别是，当 Pod 如果被删除了，那么 emptyDir 也会被删除
- 存储介质可以是任意类型，如 SSD、磁盘或网络存储。可以将 emptyDir.medium 设置为 Memory 让 k8s 使用 tmpfs（内存支持文件系统），速度比较快，但是重启 tmpfs 节点时，数据会被清除，且设置的大小会计入到 Container 的内存限制中

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: nginx
    name: nginx-emptydir
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir: {}
```

## NFS挂载

- nfs 卷能将 NFS (网络文件系统) 挂载到你的 Pod 中。 不像 emptyDir 那样会在删除 Pod 的同时也会被删除，nfs 卷的内容在删除 Pod 时会被保存，卷只是被卸载。 这意味着 nfs 卷可以被预先填充数据，并且这些数据可以在Pod之间共享

#### 安装NFS

```

# 安装 nfs
yum install nfs-utils -y

# 启动 nfs
systemctl start nfs-server

# 查看 nfs 版本
cat /proc/fs/nfsd/versions

# 创建共享目录
mkdir -p /data/nfs
cd /data/nfs
mkdir rw
mkdir ro

# 设置共享目录 export
vim /etc/exports
/data/nfs/rw 192.168.113.0/24(rw,sync,no_subtree_check,no_root_squash)
/data/nfs/ro 192.168.113.0/24(ro,sync,no_subtree_check,no_root_squash)

# 重新加载
exportfs -f
systemctl reload nfs-server

# 到其他测试节点安装 nfs-utils 并加载测试
mkdir -p /mnt/nfs/rw
mount -t nfs 192.168.113.121:/data/nfs/rw /mnt/nfs/rw
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: nginx
    name: test-container
    volumeMounts:
    - mountPath: /my-nfs-data
      name: test-volume
  volumes:
  - name: test-volume
    nfs:
      server: my-nfs-server.example.com # 网络存储服务地址
      path: /my-nfs-volume # 网络存储路径
      readOnly: true # 是否只读
```

## PV与PVC

- 持久卷（PersistentVolume，PV） 是集群中的一块存储，可以由管理员事先制备， 或者使用存储类（Storage Class）来动态制备。 持久卷是集群资源，就像节点也是集群资源一样。PV 持久卷和普通的 Volume 一样， 也是使用卷插件来实现的，只是它们拥有独立于任何使用 PV 的 Pod 的生命周期。 此 API 对象中记述了存储的实现细节，无论其背后是 NFS、iSCSI 还是特定于云平台的存储系统
- 持久卷申领（PersistentVolumeClaim，PVC） 表达的是用户对存储的请求。概念上与 Pod 类似。 Pod 会耗用节点资源，而 PVC 申领会耗用 PV 资源。Pod 可以请求特定数量的资源（CPU 和内存）；同样 PVC 申领也可以请求特定的大小和访问模式 （例如，可以要求 PV 卷能够以 ReadWriteOnce、ReadOnlyMany 或 ReadWriteMany 模式之一来挂载）

### 生命周期

#### 构建

- 静态构建
  - 集群管理员创建若干 PV 卷。这些卷对象带有真实存储的细节信息， 并且对集群用户可用（可见）。PV 卷对象存在于 Kubernetes API 中，可供用户消费（使用）
- 动态构建
  - 如果集群中已经有的 PV 无法满足 PVC 的需求，那么集群会根据 PVC 自动构建一个 PV，该操作是通过 StorageClass 实现的
  - 想要实现这个操作，前提是 PVC 必须设置 StorageClass，否则会无法动态构建该 PV，可以通过启用 DefaultStorageClass 来实现 PV 的构建

#### 绑定

- 当用户创建一个 PVC 对象后，主节点会监测新的 PVC 对象，并且寻找与之匹配的 PV 卷，找到 PV 卷后将二者绑定在一起
- 如果找不到对应的 PV，则需要看 PVC 是否设置 StorageClass 来决定是否动态创建 PV，若没有配置，PVC 就会一致处于未绑定状态，直到有与之匹配的 PV 后才会申领绑定关系

#### 使用

- Pod 将 PVC 当作存储卷来使用，集群会通过 PVC 找到绑定的 PV，并为 Pod 挂载该卷
- Pod 一旦使用 PVC 绑定 PV 后，为了保护数据，避免数据丢失问题，PV 对象会受到保护，在系统中无法被删除

#### 回收策略

- 当用户不再使用其存储卷时，他们可以从 API 中将 PVC 对象删除， 从而允许该资源被回收再利用。PersistentVolume 对象的回收策略告诉集群， 当其被从申领中释放时如何处理该数据卷。 目前，数据卷可以被 Retained（保留）、Recycled（回收）或 Deleted（删除）

- Retain

  ```
  回收策略 Retain 使得用户可以手动回收资源。当 PersistentVolumeClaim 对象被删除时，PersistentVolume 卷仍然存在，对应的数据卷被视为"已释放（released）"。 由于卷上仍然存在这前一申领人的数据，该卷还不能用于其他申领。 管理员可以通过下面的步骤来手动回收该卷：
  删除 PersistentVolume 对象。与之相关的、位于外部基础设施中的存储资产 （例如 AWS EBS、GCE PD、Azure Disk 或 Cinder 卷）在 PV 删除之后仍然存在。
  根据情况，手动清除所关联的存储资产上的数据。
  手动删除所关联的存储资产。
  如果你希望重用该存储资产，可以基于存储资产的定义创建新的 PersistentVolume 卷对象。
  ```

- Delete

  - 对于支持 Delete 回收策略的卷插件，删除动作会将 PersistentVolume 对象从 Kubernetes 中移除，同时也会从外部基础设施（如 AWS EBS、GCE PD、Azure Disk 或 Cinder 卷）中移除所关联的存储资产。 动态制备的卷会继承[其 StorageClass 中设置的回收策略](https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes/#reclaim-policy)， 该策略默认为 Delete。管理员需要根据用户的期望来配置 StorageClass； 否则 PV 卷被创建之后必须要被编辑或者修补。

- Recycle

  - 回收策略 Recycle 已被废弃。取而代之的建议方案是使用动态制备
  - 如果下层的卷插件支持，回收策略 Recycle 会在卷上执行一些基本的擦除 （rm -rf /thevolume/*）操作，之后允许该卷用于新的 PVC 申领

### PV

#### 状态

- Available：空闲，未被绑定
- Bound：已经被 PVC 绑定
- Released：PVC 被删除，资源已回收，但是 PV 未被重新使用
- Failed：自动回收失败

#### 配置文件

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0001
spec:
  capacity:
    storage: 5Gi # pv 的容量
  volumeMode: Filesystem # 存储类型为文件系统
  accessModes: # 访问模式：ReadWriteOnce、ReadWriteMany、ReadOnlyMany
    - ReadWriteOnce # 可被单节点独写
  persistentVolumeReclaimPolicy: Recycle # 回收策略
  storageClassName: slow # 创建 PV 的存储类名，需要与 pvc 的相同
  mountOptions: # 加载配置
    - hard
    - nfsvers=4.1
  nfs: # 连接到 nfs
    path: /data/nfs/rw/test-pv # 存储路径
    server: 192.168.113.121 # nfs 服务地址
```

### PVC

#### Pod 绑定 PVC

```yaml
containers:
  ......
  volumeMounts:
    - mountPath: /tmp/pvc
      name: nfs-pvc-test
volumes:
  - name: nfs-pvc-test
    persistentVolumeClaim:
      claimName: nfs-pvc # pvc 的名称
```

#### 配置文件

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nfs-pvc
spec:
  accessModes:
    - ReadWriteOnce # 权限需要与对应的 pv 相同
  volumeMode: Filesystem
  resources:
    requests:
      storage: 8Gi # 资源可以小于 pv 的，但是不能大于，如果大于就会匹配不到 pv
  storageClassName: slow # 名字需要与对应的 pv 相同
#  selector: # 使用选择器选择对应的 pv
#    matchLabels:
#      release: "stable"
#    matchExpressions:
#      - {key: environment, operator: In, values: [dev]}
```

### StorageClass

- k8s 中提供了一套自动创建 PV 的机制，就是基于 StorageClass 进行的，通过 StorageClass 可以实现仅仅配置 PVC，然后交由 StorageClass 根据 PVC 的需求动态创建 PV

#### 制备器（Provisioner）

#### NFS 动态制备案例

- nfs-provisioner

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: nfs-client-provisioner
    namespace: kube-system
    labels:
      app: nfs-client-provisioner
  spec:
    replicas: 1
    strategy:
      type: Recreate
    selector:
      matchLabels:
        app: nfs-client-provisioner
    template:
      metadata:
        labels:
          app: nfs-client-provisioner
      spec:
        serviceAccountName: nfs-client-provisioner
        containers:
          - name: nfs-client-provisioner
            image: quay.io/external_storage/nfs-client-provisioner:latest
            volumeMounts:
              - name: nfs-client-root
                mountPath: /persistentvolumes
            env:
              - name: PROVISIONER_NAME
                value: fuseim.pri/ifs
              - name: NFS_SERVER
                value: 192.168.113.121
              - name: NFS_PATH
                value: /data/nfs/rw
        volumes:
          - name: nfs-client-root
            nfs:
              server: 192.168.113.121
              path: /data/nfs/rw
  ```

- StorageClass 配置

  ```yaml
  apiVersion: storage.k8s.io/v1
  kind: StorageClass
  metadata:
    name: managed-nfs-storage
    namespace: kube-system
  provisioner: fuseim.pri/ifs # 外部制备器提供者，编写为提供者的名称
  parameters:
    archiveOnDelete: "false" # 是否存档，false 表示不存档，会删除 oldPath 下面的数据，true 表示存档，会重命名路径
  reclaimPolicy: Retain # 回收策略，默认为 Delete 可以配置为 Retain
  volumeBindingMode: Immediate # 默认为 Immediate，表示创建 PVC 立即进行绑定，只有 azuredisk 和 AWSelasticblockstore 支持其他值
  ```

- RBAC 配置

  ```yaml
  apiVersion: v1
  kind: ServiceAccount
  metadata:
    name: nfs-client-provisioner
    namespace: kube-system
  ---
  kind: ClusterRole
  apiVersion: rbac.authorization.k8s.io/v1
  metadata:
    name: nfs-client-provisioner-runner
    namespace: kube-system
  rules:
    - apiGroups: [""]
      resources: ["persistentvolumes"]
      verbs: ["get", "list", "watch", "create", "delete"]
    - apiGroups: [""]
      resources: ["persistentvolumeclaims"]
      verbs: ["get", "list", "watch", "update"]
    - apiGroups: ["storage.k8s.io"]
      resources: ["storageclasses"]
      verbs: ["get", "list", "watch"]
    - apiGroups: [""]
      resources: ["events"]
      verbs: ["create", "update", "patch"]
  ---
  kind: ClusterRoleBinding
  apiVersion: rbac.authorization.k8s.io/v1
  metadata:
    name: run-nfs-client-provisioner
    namespace: kube-system
  subjects:
    - kind: ServiceAccount
      name: nfs-client-provisioner
      namespace: default
  roleRef:
    kind: ClusterRole
    name: nfs-client-provisioner-runner
    apiGroup: rbac.authorization.k8s.io
  ---
  kind: Role
  apiVersion: rbac.authorization.k8s.io/v1
  metadata:
    name: leader-locking-nfs-client-provisioner
    namespace: kube-system
  rules:
    - apiGroups: [""]
      resources: ["endpoints"]
      verbs: ["get", "list", "watch", "create", "update", "patch"]
  ---
  kind: RoleBinding
  apiVersion: rbac.authorization.k8s.io/v1
  metadata:
    name: leader-locking-nfs-client-provisioner
    namespace: kube-system
  subjects:
    - kind: ServiceAccount
      name: nfs-client-provisioner
  roleRef:
    kind: Role
    name: leader-locking-nfs-client-provisioner
    apiGroup: rbac.authorization.k8s.io
  ```

- PVC 处于 Pending 状态

  - 在 k8s 1.20 之后，出于对性能和统一 apiserver 调用方式的初衷，移除了对 SelfLink 的支持，而默认上面指定的 provisioner 版本需要 SelfLink 功能，因此 PVC 无法进行自动制备

  - 配置 SelfLink

    ```yaml
    修改 apiserver 配置文件
    vim /etc/kubernetes/manifests/kube-apiserver.yaml
    
    spec:
      containers:
      - command:
        - kube-apiserver
        - --feature-gates=RemoveSelfLink=false # 新增该行
        ......
    
    修改后重新应用该配置
    kubectl apply -f /etc/kubernetes/manifests/kube-apiserver.yaml
    ```
    
  - 不需要 SelfLink 的 provisioner
    
    ```yaml
    将 provisioner 修改为如下镜像之一即可
    
    gcr.io/k8s-staging-sig-storage/nfs-subdir-external-provisioner:v4.0.0
    
    registry.cn-beijing.aliyuncs.com/pylixm/nfs-subdir-external-provisioner:v4.0.0
    ```

- PVC 测试配置

  ```yaml
  apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
    name: auto-pv-test-pvc
  spec:
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 300Mi
    storageClassName: managed-nfs-storage
  ```

  
