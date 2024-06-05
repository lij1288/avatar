## Kubernetes的常用命令

- 在任意节点使用kubectl

  - 拷贝配置文件

    > scp /etc/kubernetes/admin.conf 192.168.1.112:/etc/kubernetes

  - 配置环境变量

    > echo "export KUBECONFIG=/etc/kubernetes/admin.conf" >> ~/.bash_profile

    > source ~/.bash_profile

- 资源类型
  - pods：po
  - deployments：deploy
  - services：svc
  - namespace：ns
  - nodes：no
- 格式化输出
  - 输出json格式：-o json
  - 输出资源名称：-o name
  - 输出文本格式：-o wide
  - 输出yaml格式：-o yaml

### 资源操作

#### 创建对象

- 使用文件创建资源

  > kubectl create -f ./my-manifest.yaml

- 使用多个文件创建资源

  > kubectl create -f ./my1.yaml -f ./my2.yaml

- 使用目录下的所有文件来创建资源

  > kubectl create -f ./dir

- 使用url创建资源

  > kubectl create -f https://git.io/vPieo

- 启动一个nginx实例

  > kubectl run nginx --image=nginx

- 获取pod和svc的文档

  > kubectl explain pods,svc

- 从stdi 输入中创建多个yaml对象

  ```shell
  $ cat <<EOF | kubectl create -f -
  apiVersion: v1
  kind: Pod
  metadata:
    name: busybox-sleep
  spec:
    containers:
    - name: busybox
      image: busybox
      args:
      - sleep
      - "1000000"
  ---
  apiVersion: v1
  kind: Pod
  metadata:
    name: busybox-sleep-less
  spec:
    containers:
    - name: busybox
      image: busybox
      args:
      - sleep
      - "1000"
  EOF
  ```

- 创建包含几个key的secret

  ```shell
  $ cat <<EOF | kubectl create -f -
  apiVersion: v1
  kind: Secret
  metadata:
    name: mysecret
  type: Opaque
  data:
    password: $(echo "s33msi4" | base64)
    username: $(echo "jane" | base64)
  EOF
  ```

#### 显示和查找资源

- 列出所有namespace中的所有service

  > kubectl get services

- 列出所有namespace中的所有pod

  > kubectl get pods --all-namespaces

- 列出所有pod并显示详细信息

  > kubectl get pods -o wide

- 列出指定deployment

  > kubectl get deployment my-dep

- 列出该namespace中的所有pod包括未初始化的

  > kubectl get pods --include-uninitialized

- 查看详细信息

  > kubectl describe nodes my-node

  > kubectl describe pods my-pod

- 列出服务并按名称排序

  > kubectl get services --sort-by=.metadata.name

- 列出pod并按重启次数排序

  > kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

- 获取所有具有app=cassandra的pod中的version标签

  > kubectl get pods --selector=app=cassandra rc -o jsonpath='{.items[*].metadata.labels.version}'

- 获取所有节点的ExternalIP

  > kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

- 列出属于某个PC的pod的名字

  - jq命令用于转换复杂的 jsonpath

  > sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}

  > echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

- 查看已就绪的节点

  > JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}'  && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

- 列出当前pod中使用的secret

  > kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

#### 更新资源

- 滚动更新pod frontend-v1

  > kubectl rolling-update frontend-v1 -f frontend-v2.json

- 更新资源名称并更新镜像

  > kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2

- 更新frontend pod 中的镜像

  > kubectl rolling-update frontend --image=image:v2

- 退出已存在的进行中的滚动更新

  > kubectl rolling-update frontend-v1 frontend-v2 --rollback

- 基于stdin输入的json替换pod

  > cat pod.json | kubectl replace -f -

- 强制替换，删除后重新创建资源（会导致服务中断）

  > kubectl replace --force -f ./pod.json

- 为nginx RC创建服务，启用本地80端口连接到容器上的8000端口

  > kubectl expose rc nginx --port=80 --target-port=8000

- 更新单容器pod的镜像版本（tag）到v4

  > kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

- 添加标签

  > kubectl label pods my-pod new-label=awesome

- 添加注解

  > kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq

- 自动扩展deployment “foo”

  > kubectl autoscale deployment foo --min=2 --max=10

#### 修补资源

- 部分更新节点

  > kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

- 更新容器镜像

  > kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

- 使用具有位置数组的json补丁更新容器镜像

  > kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

- 使用具有位置数组的json补丁禁用deployment的livenessProbe

  > kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

#### 编辑资源

- 编辑名为docker-registry的service

  > kubectl edit svc/docker-registry

- 使用其它编辑器

  > KUBE_EDITOR="nano" kubectl edit svc/docker-registry

#### scale资源

- 将名为foo的replicaset副本数设为3

  > kubectl scale --replicas=3 rs/foo

- 将文件中指定的resource副本数设为3

  > kubectl scale --replicas=3 -f foo.yaml

- 如果名为mysql的deployment当前副本数为2，则设为3

  > kubectl scale --current-replicas=2 --replicas=3 deployment/mysql

- 设置多个replication中的副本数

  > kubectl scale --replicas=5 rc/foo rc/bar rc/baz

#### 删除资源

- 删除pod.json文件中定义的类型和名称的pod

  > kubectl delete -f ./pod.json

- 删除名为baz的pod和名为foo的service

  > kubectl delete pod,service baz foo

- 删除具有name=myLabel标签的pod和serivce

  > kubectl delete pods,services -l name=myLabel

- 删除具有name=myLabel标签的pod和service，包括尚未初始化的

  > kubectl delete pods,services -l name=myLabel --include-uninitialized

- 删除my-ns namespace下的所有pod和serivce，包括尚未初始化的

  > kubectl -n my-ns delete po,svc --all

### Pod交互

- dump输出pod的日志（stdout）

  > kubectl logs my-pod

- dump输出pod中容器的日志（stdout，pod中有多个容器的情况下使用）

  > kubectl logs my-pod -c my-container

- 流式输出 pod的日志（stdout）

  > kubectl logs -f my-pod

- 流式输出pod中容器的日志（stdout，pod中有多个容器的情况下使用）

  > kubectl logs -f my-pod -c my-container

- 交互式 shell 的方式运行 pod

  > kubectl run -i --tty busybox --image=busybox -- sh

- 连接到运行中的容器

  > kubectl attach my-pod -i

- 转发pod中的6000端口到本地的5000端口

  > kubectl port-forward my-pod 5000:6000

- 在已存在的容器中执行命令（只有一个容器的情况下）

  > kubectl exec my-pod -- ls /

- 在已存在的容器中执行命令（pod中有多个容器的情况下）

  > kubectl exec my-pod -c my-container -- ls /

- 显示指定pod和容器的指标度量

  > kubectl top pod POD_NAME --containers

### 节点和集群交互

- 标记my-node不可调度

  > kubectl cordon my-node

- 清空my-node以待维护

  > kubectl drain my-node

- 标记my-node可调度

  > kubectl uncordon my-node

- 显示my-node的指标度量

  > kubectl top node my-node

- 显示master和服务的地址

  > kubectl cluster-info

- 将当前集群状态输出到stdout

  > kubectl cluster-info dump

- 将当前集群状态输出到/path/to/cluster-state

  > kubectl cluster-info dump --output-directory=/path/to/cluster-state

- 如果该键和影响的污点（taint）已存在，则使用指定的值替换

  > kubectl taint nodes foo dedicated=special-user:NoSchedule

