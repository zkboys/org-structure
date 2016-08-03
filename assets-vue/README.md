# vue-demo

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

问题：
- 页面切换过程中 raphael-2.1.0.min.js 报错，是由于raphael-2.1.0.min.js执行过之后，绑定了window.resize事件，切换过程中，由于有的页面没有滚动条，有的有滚动条，出发了resize事件，但是页面并没有相应元素了，所以报错。不使用这个js就好了，也未必能用的到。
- 通过src方式拆分文件，导致webpack的preLoaders中eslint对js无效。这个eslint只对.vue文件中直接写的js有效。
```
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```
js 还是放回*.vue
```
<script lang="es6">，这样在webstorm下，可以正常提示/格式化，并且支持es6语法，但是编译报错
<script lang="js">，这样在webstorm下就有正常的提示/格式化。但是提示上不支持es6
<script lang="babel">，这样在webstorm下，可以正常提示/格式化，并且支持es6语法，编译不报错
<script type="text/javascript">，webstorm显示一个绿色的块，很不爽
```
