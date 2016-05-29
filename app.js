/**
 * Module dependencies.
 */

var config = require('./config');

/*
 * oneapm 是个用来监控网站性能的服务,性能监控解决方案 http://www.oneapm.com/
 * 非debug模式，开始oneapm监控
 * */
if (!config.debug && config.oneapm_key) {
    require('oneapm');// 直接引入，oneapm会根据/oneapm.js的配置启动
}
/*
 * https://www.npmjs.com/package/colors
 * get colors in your node.js console
 * 扩展String.prototype方式启用
 * console.log('hello'.green); // outputs green text
 * */
require('colors');
var path = require('path');
/*
 * Node静态资源加载器。该模块通过两个步骤配合完成，代码部分根据环境生成标签。上线时，需要调用minify方法进行静态资源的合并和压缩。
 * */
var Loader = require('loader');
var LoaderConnect = require('loader-connect')
/*
 *基于 Node.js 平台，快速、开放、极简的 web 开发框架。
 * */
var express = require('express');
/*
 * Simple session middleware for Express
 * */
var session = require('express-session');
/*
 * 兼容express的身份认证中间件
 * */
var passport = require('passport');
/*
 * 打印 mongodb 查询日志
 * */
require('./middlewares/mongoose_log');
/*
 * mongoose链接数据库代码在models中
 * */
require('./models');
/*
 * github用户认证
 * */
var GitHubStrategy = require('passport-github').Strategy;
var githubStrategyMiddleware = require('./middlewares/github_strategy');
/*
 * 页面跳转router
 * */
var webRouter = require('./web_router');
/*
 * apirouter
 * */
var apiRouter = require('./api_router');

/*
 * 用户是否登陆，身份验证（是否管理员）等
 * */
var auth = require('./middlewares/auth');

// 对res进行扩展方法
var resExtend = require('./middlewares/res-extend');
/*
 * 跨站？
 * */
var proxyMiddleware = require('./middlewares/proxy');
/*
 * Redis 数据库 缓存
 * */
var RedisStore = require('connect-redis')(session);
/*
 * javascript 的一个工具库，类似underscore的一个东西
 * */
var _ = require('lodash');
/*
 * Node.js CSRF protection middleware. Cross-site request forgery跨站请求伪造
 * */
var csurf = require('csurf');

/*
 * nodejs 压缩中间件,http请求返回的资源进行压缩？
 * */
var compress = require('compression');
/*
 * 对请求的req.body进行处理
 * */
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
/*
 * Development-only error handler middleware.
 * */
var errorhandler = require('errorhandler');
/*
 * 跨域，可以设置那些域名可以请求接口
 * */
var cors = require('cors');
/*
 * 输出请求时间日志，记录一次请求花费了多少时间
 * */
var requestLog = require('./middlewares/request_log');
/*
 * 输出渲染时间日志，记录一次渲染请求花费了多少时间
 * */
var renderMiddleware = require('./middlewares/render');
/*
 * 日志系统
 * */
var logger = require('./common/logger');
/*
 *
 * Helmet是一系列帮助增强Node.JS之Express/Connect等Javascript Web应用安全的中间件。
 * 一些著名的对Web攻击有XSS跨站脚本， 脚本注入 clickjacking 以及各种非安全的请求等对Node.js的Web应用构成各种威胁，使用Helmet能帮助你的应用避免这些攻击。
 * */
var helmet = require('helmet');
/*
 一个小工具。。。
 bytes('1kB');
 // output: 1024
 bytes(1024);
 // output: '1kB'
 * */
var bytes = require('bytes')


// 静态文件目录
var staticDir = path.join(__dirname, 'public');
// assets
var assets = {};

if (config.mini_assets) {
    try {
        assets = require('./assets.json');
    } catch (e) {
        logger.error('You must execute `make build` before start app when mini_assets is true.');
        throw e;
    }
}

var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

var app = express();

// configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';// 默认模板文件，可以通过<% layout('layout.html') -%>为具体文件单独指定模板文件
app.enable('trust proxy');//通过启用“信任代理”设置app.enable(“trust proxy”),Express有一些反向代理的技巧,

// Request logger。请求花费时间log
app.use(requestLog);

if (config.debug) {
    // 渲染花费时间log
    app.use(renderMiddleware.render);
}

// 静态资源
if (config.debug) {
    app.use(LoaderConnect.less(__dirname)); // 测试环境用，编译 .less on the fly
}
// 静态文件以及跨域请求代理
app.use('/public', express.static(staticDir));
app.use('/agent', proxyMiddleware.proxy);

// 通用的中间件
app.use(require('response-time')());
app.use(helmet.frameguard('sameorigin'));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));
app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));
app.use(compress());
app.use(session({// session 是使用Redis存储的。。。
    secret: config.session_secret,
    store: new RedisStore({
        port: config.redis_port,
        host: config.redis_host,
    }),
    resave: true,
    saveUninitialized: true,
}));

// oauth 中间件
app.use(passport.initialize());// 初始化

// github oauth
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
passport.use(new GitHubStrategy(config.GITHUB_OAUTH, githubStrategyMiddleware));

app.use(resExtend.resExtend);
// custom middleware
app.use(auth.authUser);// 如果用户登录了，存用户到session中，如果未登录，next
app.use(auth.userRequired);//判断用户是否登录，如果未登录，跳转到登录，否则next
app.use(auth.blockUser());//是否已锁定，未锁定，next
app.use(function (req, res, next) {
    if (req.path === '/api' || req.path.indexOf('/api') === -1) {
        csurf()(req, res, next);
        return;
    }
    next();
});
if (!config.debug) {
    app.set('view cache', true);
}

// for debug
// app.get('/err', function (req, res, next) {
//   next(new Error('haha'))
// });

// set static, dynamic helpers
/*
 * 设置全局变量，如下的变量都是给Loader用的。
 * */
_.extend(app.locals, {
    config: config,
    Loader: Loader,
    assets: assets
});

_.extend(app.locals, require('./common/render_helper'));
app.use(function (req, res, next) {
    res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
    next();
});

app.use(busboy({
    limits: {
        fileSize: bytes(config.file_limit)
    }
}));
app.use('/api', cors(), apiRouter);
app.use('/', webRouter);


// error handler
if (config.debug) {
    app.use(errorhandler());
} else {
    app.use(function (err, req, res, next) {
        logger.error(err);
        return res.status(500).send('500 status');
    });
}

if (!module.parent) {
    app.listen(config.port, function () {
        logger.info('NodeClub listening on port', config.port);
        logger.info('God bless love....');
        logger.info('You can debug your app with http://' + config.hostname + ':' + config.port);
        logger.info('');
    });
}

module.exports = app;
