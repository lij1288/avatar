@SpringBootApplication声明是一个SpringBoot应用，主程序类

@Controller

@ResponseBody

@RequestMapping

@RestController



## 基本使用

### 相关依赖

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.3.4.RELEASE</version>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

### 主程序

```java
package cn.lijiong.boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MainApplication {
    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }
}
```

### 业务逻辑

```java
package cn.lijiong.boot.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoController {
    @RequestMapping("/test")
    public String handle(){
        return "TEST";
    }
}
```

### 修改配置

- resources目录下的application.properties

> https://docs.spring.io/spring-boot/docs/2.3.4.RELEASE/reference/html/appendix-application-properties.html

### 打包部署

- clean+package进行打包后直接在目标服务器执行

## 依赖管理

### 场景启动器

- 官方场景启动器spring-boot-starter-*
- 第三方场景启动器 *-spring-boot-starter

### 版本号

- 默认版本号位于spring-boot-dependencies
- 修改版本号

```xml
<properties>
	<mysql.version>6.0.2</mysql.version>
</properties>
```

## 自动配置

- 自动配好Tomcat、SpringMVC和Web常见功能

- 默认包结构

  - 主程序所在包及其下所有子包内的组件都被默认扫描进来

  - 更改包扫描路径

    - @SpringBootApplication(scanBasePackages="cn.lijiong")

    - @SpringBootConfiguration

      @EnableAutoConfiguration

      @ComponentScan("cn.lijiong")