var express = require('express');
var sign = require('./controllers/sign');
var router = express.Router();

router.get('/signin', sign.showLogin);  // 进入登录页面
router.get('/first_login', sign.showFirstLogin);  // 进入登录页面

// 所有未截获get请求都跳转到首页
router.get('*', function (req, res, next) {
    //  根据约定 区分不同得请求类型，返回不同的数据。
    if (req.path.indexOf('/api') === 0 || req.path.indexOf('/public') === 0) {
        return res.sendError('','您访问的资源不存在', 404);
    }
    res.render('index');
});

module.exports = router;
