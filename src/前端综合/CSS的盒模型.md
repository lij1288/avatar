## **CSS的盒模型**

- 盒模型的可见大小由内容区、内边距和边框决定，外边距影响位置

### 内容区 content

- width
  - 宽度
- height
  - 高度

### 内边距 padding

- background-color会延申到内边距
- padding
  - 简写属性
  - 取值
    - 上下左右、上下 左右、上 左右 下、上 右 下 左

- 分别指定
  - padding-top/right/bottom/left

### 边框 border

- border
  - 简写属性
    - border: [width] [color] [style]

- border-width

  - 边框宽度

- border-color

  - 边框颜色
    - 默认使用color值

- border-style

  - 边框样式
    - none：无边框（默认）
    - solid：实线
    - dashed：线状虚线
    - dotted：点状虚线
    - double：双实线

- 取值

  - 上下左右、上下 左右、上 左右 下、上 右 下 左

- 分别指定

  - border-top/right/bottom/left

  - border-top/right/bottom/left-width/color/style

### 外边距 margin

- margin
  - 简写属性
  - 取值
    - 上下左右、上下 左右、上 左右 下、上 右 下 左
- 分别指定
  - margin-top/right/bottom/left
- 将外边距margin-right和margin-left设置为auto可使元素在父元素中水平居中

### 行内元素的盒模型

- 行内元素不能设置width和height
- 行内元素可以设置padding、border和margin，但不影响垂直方向的布局

### 盒模型的尺寸

- box-sizing：设置width和height的作用
  - content-box：默认，width和height设置内容区的大小
  - border-box：width和height设置可见框的大小（内容区+内边距+边框）

### 轮廓、阴影和圆角

- outline：轮廓，用法同border，不会影响页面布局
  - outline-width

  - outline-color

  - outline-style

- box-shadow：阴影，不会影响页面布局
  - 水平偏移量 垂直偏移量 模糊半径 阴影颜色

- border-radius：圆角
  - 圆角半径