## **Docsify的多页设置**

```
└── avatar
    ├── README.md
    └── test
        ├── README.md
        └── test1.md
    └── demo
        ├── README.md
        └── demo1.md
```

| 页面路径        | 访问路径                    | 引用路径    |
| --------------- | --------------------------- | ----------- |
| README.md       | localhost:3000              | /           |
| README.md的标题 | localhost:3000/#/?id=标题   | /?id=标题   |
| test/README.md  | localhost:3000/#/test/      | /test/      |
| test/test1.md   | localhost:3000/#/test/test1 | /test/test1 |
| demo/README.md  | localhost:3000/#/demo/      | /demo/      |
| demo/test1.md   | localhost:3000/#/demo/demo1 | /demo/demo1 |



