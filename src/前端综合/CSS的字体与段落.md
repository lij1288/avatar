## **CSS的字体与段落**

### color

- 字体颜色

### font-size

- 字体大小

- 与font-size相关的单位
  - em：相当于当前元素的一个font-size
  - rem：相当于根元素的一个font-size
- 字体框即字体存在的格子，设置font-size实际是指定字体框的高度，行高会在字体框的上下平均分配

### font-family

- 字体格式

- 指定逗号隔开的多个字体，依序选择使用

- 指定字体类别，浏览器自动使用该类别下的字体
  - serif：衬线字体
  - sans-serif：非衬线字体
  - monospace：等宽字体

### font-weight

- 加粗

- normal：正常
- bord：加粗

### font-style

- 斜体

- normal：正常
- italic：斜体

### font-face

- 将服务器中的字体直接提供给用户使用

- font-family：字体的名字
- src：字体的路径

```css
@font-face {
    font-family:'myfont';
    src:url('./fonts/***.ttf');
}
p {
    font-family:'myfont';
}
```

### font

- 简写属性

- 字体大小 字体格式 
- 字体大小/行高 字体格式 
- 加粗 斜体 字体大小/行高 字体格式 

### line-height

- 行高

- 指定一个大小（px、em）
- 指定一个整数，为字体的倍数

### text-align

- 水平对齐

- left：左端对齐
- right：右端对齐
- center：居中对齐
- justify：两端对齐

### vertical-align

- 垂直对齐

- baseline：基线对齐
- top：顶部对齐
- bottom：底部对齐
- middle：居中对齐