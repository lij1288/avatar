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
