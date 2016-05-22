项目中使用到的一些modules的介绍
## [ejs-mate](https://www.npmjs.com/package/ejs-mate)
模板语言

## [oneapm](http://www.oneapm.com/)
oneapm 是个用来监控网站性能的服务,性能监控解决方案 

## [colors](https://www.npmjs.com/package/colors)
get colors in your node.js console.

两种使用方式：

扩展String.prototype
```
require('colors');

 console.log('hello'.green); // outputs green text
 console.log('i like cake and pies'.underline.red) // outputs red underlined text
 console.log('inverse the color'.inverse); // inverses the color
 console.log('OMG Rainbows!'.rainbow); // rainbow
 console.log('Run the trap'.trap); // Drops the bass
```

不扩展String.prototype
```
var colors = require('colors/safe');
 
console.log(colors.green('hello')); // outputs green text 
console.log(colors.red.underline('i like cake and pies')) // outputs red underlined text 
console.log(colors.inverse('inverse the color')); // inverses the color 
console.log(colors.rainbow('OMG Rainbows!')); // rainbow 
console.log(colors.trap('Run the trap')); // Drops the bass 
```

## [loader](https://www.npmjs.com/package/loader)
Node静态资源加载器。该模块通过两个步骤配合完成，代码部分根据环境生成标签。上线时，需要调用minify方法进行静态资源的合并和压缩。

## [express](http://www.expressjs.com.cn/)
基于 Node.js 平台，快速、开放、极简的 web 开发框架。

## [express-session](https://www.npmjs.com/package/express-session)
Simple session middleware for Express

## [passport](https://www.npmjs.com/package/passport)
兼容express的身份认证中间件

## [loadash](https://lodash.com/)
javascript 的一个工具库，类似underscore的一个东西

## [csurf](https://www.npmjs.com/package/csurf)
Node.js CSRF protection middleware. Cross-site request forgery跨站请求伪造

## [compression](https://www.npmjs.com/package/compression)
nodejs 压缩中间件,http请求返回的资源进行压缩？

## [body-parser](https://www.npmjs.com/package/body-parser)
Node.js body parsing middleware.

## [connect-busboy](https://www.npmjs.com/package/connect-busboy)
Connect middleware for busboy

## [errorhandler](https://www.npmjs.com/package/errorhandler)

## [helmet](https://www.npmjs.com/package/helmet)
Helmet是一系列帮助增强Node.JS之Express/Connect等Javascript Web应用安全的中间件。

一些著名的对Web攻击有XSS跨站脚本， 脚本注入 clickjacking 以及各种非安全的请求等对Node.js的Web应用构成各种威胁，使用Helmet能帮助你的应用避免这些攻击。

## [url](https://www.npmjs.com/package/url)
提取url的各种信息

## [response-time](https://www.npmjs.com/package/response-time)
This module creates a middleware that records the response time for requests in HTTP servers. The "response time" is defined here as the elapsed time from when a request enters this middleware to when the headers are written out to the client.

## [method-override](https://www.npmjs.com/package/method-override)
Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.

## [cookie-parser](https://www.npmjs.com/package/cookie-parser)
cookie parsing with signatures





