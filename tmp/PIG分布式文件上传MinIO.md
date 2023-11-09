## **PIG分布式文件上传MinIO**

### 创建Bucket

![](assets/PIG分布式文件上传MinIO/创建Bucket.jpg)

### 配置MinIO信息

```yaml
file:
  bucketName: test
  oss:
    enable: true
    endpoint: http://localhost:9000
    access-key: minioadmin
    secret-key: minioadmin
```



![](assets/PIG分布式文件上传MinIO/配置minio信息.jpg)

### 重启admin服务

### 上传测试

![](assets/PIG分布式文件上传MinIO/上传测试1.jpg)

![](assets/PIG分布式文件上传MinIO/上传测试2.jpg)