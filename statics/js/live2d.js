L2Dwidget.init({
    "model": {
      jsonPath: "https://unpkg.com/live2d-widget-model-haruto@1.0.5/assets/haruto.model.json",
      "scale": 1
    },
    "display": {
      "position": "right", //位置
      "width": 60,  //宽度
      "height": 120, //高度
      "hOffset": 40,
      "vOffset": -10
    },
    "mobile": {
      "show": true,
      "scale": 0.5
    },
    "react": {
      "opacityDefault": 0.6,
      "opacityOnHover": 0.2
    }
});