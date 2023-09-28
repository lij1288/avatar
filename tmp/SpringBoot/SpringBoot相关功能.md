SpringBoot核心功能

## 配置文件

### 文件类型

#### properties

#### yaml

- 基本语法

  - key: value
  - 大小写敏感
  - 使用缩进表示层级关系，缩进使用空格，相同层级的元素左对齐
  - '#'表示注释
  - 字符串无需加引号，若加引号，单引号/双引号分别表示字符串内容会/不会被转义

- 数据类型

  - 字面量：string、number、date、boolean、null

    ```yaml
    k: v
    ```

  - 对象：object、map、hash、set

    ```yaml
    k: {k1:v1,k2:v2,k3:v3}
    ```

    ```yaml
    k:
     k1: v1
     k2: v2
     k3: v3
    ```

  - 数组：array、list、queue

    ```yaml
    k: [v1,v2,v3]
    ```

    ```yaml
    k: 
     - v1
     - v2
     - v3
    ```

    

    