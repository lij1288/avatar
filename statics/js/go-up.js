$(document).ready(function () {
    $.goup({
      location: 'right', // 按钮位置
      trigger: 150, // 显示按钮前的滚动像素
      bottomOffset: 38, // 距离底部边缘距离
      locationOffset: 25, // 距离两侧边缘距离
      containerSize: 45, // 按钮大小
      containerRadius: 10, // 圆角大小
      containerColor: '#87b1de', // 按钮颜色
      arrowColor: '#fff', // 箭头颜色
      entryAnimation: 'fade', // 显示动画：fade/slide
      goupSpeed: 'normal', // 返回顶部速度：slow/normal/fast
    });
});