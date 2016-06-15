# PreviewImage 图片预览
点击图片,放大预览,可拖动,可旋转.其实,就像使用正常的img标签一样,只是对它进行了扩展,正常的img属性都可以写.

## API
属性|必填|说明|类型|默认值
----|----|---|------
src|是|图片预览的资源地址|string|![默认图片](http://www.gbtags.com/gb/laitu/400x200&text=默认图片/dd4814/ffffff)[参考这里](http://www.gbtags.com/gb/gblaitu.htm)
imgSize|否|阿里云图片裁剪参数|string|@50h_70w_1e_1c
noImgSize|否|如果不需要图片裁剪,添加noImgSize标记即可|-|-

## 不足
由于react中获取dom元素的高宽比较困难,因此,可拖动窗口的居中定位显示,是给的定宽 500px.后续看有没有办法解决.(思路一 采用相对对位,先让元素居中显示,然后控制,top left值.)

