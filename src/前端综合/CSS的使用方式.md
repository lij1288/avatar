## **CSS的使用方式**

### 行内样式

- 在标签内部通过style属性设置元素样式

```html
<p style="color:red; font-size:30px">content</p>
```

### 内部样式

- 在head中的style标签设置元素样式

```html
<head>
  <style>
    p{
      color:red;
      font-size:30px;
    }
  </style>
</head>
```

### 外部样式

- 在head中的link标签引入外部的css文件

```html
<head>
  <link rel="stylesheet" href="statics/css/style.css">
</head>
```
