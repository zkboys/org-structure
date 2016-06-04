var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var proxy = require('../proxy');
var User = proxy.User;
var Menu = proxy.Menu;
var mail = require('../common/mail');
var tools = require('../common/tools');
var utility = require('utility');
var authMiddleWare = require('../middlewares/auth');
var uuid = require('node-uuid');

//sign up
exports.showSignup = function (req, res) {
    res.render('sign/signup');
};

exports.signup = function (req, res, next) {
    var loginname = validator.trim(req.body.loginname).toLowerCase();
    var pass = validator.trim(req.body.pass);
    var rePass = validator.trim(req.body.re_pass);

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function (msg) {
        res.status(422);
        res.render('sign/signup', {error: msg, loginname: loginname});
    });

    // 验证信息的正确性
    if ([loginname, pass, rePass].some(function (item) {
            return item === '';
        })) {
        ep.emit('prop_err', '信息不完整。');
        return;
    }
    if (loginname.length < 2) {
        ep.emit('prop_err', '用户名至少需要2个字符。');
        return;
    }
    if (!tools.validateId(loginname)) {
        return ep.emit('prop_err', '用户名不合法。');
    }

    if (pass !== rePass) {
        return ep.emit('prop_err', '两次密码输入不一致。');
    }
    // END 验证信息的正确性


    User.getUserByLoginName(loginname, function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            ep.emit('prop_err', '用户名已被使用。');
            return;
        }
        var salt = uuid.v4();
        tools.bhash(pass + salt, ep.done(function (passhash) {
            // create gravatar
            var avatarUrl = '';
            var email = '';
            User.newAndSave(loginname, loginname, passhash, salt, email, avatarUrl, function (err) {
                if (err) {
                    return next(err);
                }
                res.render('sign/signup', {
                    success: '欢迎加入 ' + config.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'
                });
            });

        }));
    });
};

/**
 * Show user login page.
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 */
exports.showLogin = function (req, res) {
    res.render('sign/signin');
};
/**
 * 首次登录，修改密码页面
 * @param req
 * @param res
 */
exports.showFirstLogin = function (req, res) {
    if (!req.session.user || !req.session.user.is_first_login) {
        res.redirect('/signin');
    }else{
        res.render('sign/first-login');
    }
};

/**
 * define some page when login just jump to the home page
 * @type {Array}
 */
var notJump = [
    '/signin',
    '/active_account', //active page
    '/reset_pass',     //reset password page, avoid to reset twice
    '/signup',         //regist page
    '/search_pass'    //serch pass page
];


// sign out
exports.signout = function (req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {path: '/'});
    res.redirect('/signin');
};

exports.activeAccount = function (req, res, next) {
    var key = validator.trim(req.query.key);
    var name = validator.trim(req.query.name);

    User.getUserByLoginName(name, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error('[ACTIVE_ACCOUNT] no such user: ' + name));
        }
        var passhash = user.pass;
        if (!user || utility.md5(user.email + passhash + config.session_secret) !== key) {
            return res.render('notify/notify', {error: '信息有误，帐号无法被激活。'});
        }
        if (user.active) {
            return res.render('notify/notify', {error: '帐号已经是激活状态。'});
        }
        user.active = true;
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            res.render('notify/notify', {success: '帐号已被激活，请登录'});
        });
    });
};

exports.showSearchPass = function (req, res) {
    res.render('sign/search_pass');
};

exports.updateSearchPass = function (req, res, next) {
    var email = validator.trim(req.body.email).toLowerCase();
    if (!validator.isEmail(email)) {
        return res.render('sign/search_pass', {error: '邮箱不合法', email: email});
    }

    // 动态生成retrive_key和timestamp到users collection,之后重置密码进行验证
    var retrieveKey = uuid.v4();
    var retrieveTime = new Date().getTime();

    User.getUserByMail(email, function (err, user) {
        if (!user) {
            res.render('sign/search_pass', {error: '没有这个电子邮箱。', email: email});
            return;
        }
        user.retrieve_key = retrieveKey;
        user.retrieve_time = retrieveTime;
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            // 发送重置密码邮件
            mail.sendResetPassMail(email, retrieveKey, user.loginname);
            res.render('notify/notify', {success: '我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码。'});
        });
    });
};

/**
 * reset password
 * 'get' to show the page, 'post' to reset password
 * after reset password, retrieve_key&time will be destroy
 * @param  {http.req}   req
 * @param  {http.res}   res
 * @param  {Function} next
 */
exports.resetPass = function (req, res, next) {
    var key = validator.trim(req.query.key || '');
    var name = validator.trim(req.query.name || '');

    User.getUserByNameAndKey(name, key, function (err, user) {
        if (!user) {
            res.status(403);
            return res.render('notify/notify', {error: '信息有误，密码无法重置。'});
        }
        var now = new Date().getTime();
        var oneDay = 1000 * 60 * 60 * 24;
        if (!user.retrieve_time || now - user.retrieve_time > oneDay) {
            res.status(403);
            return res.render('notify/notify', {error: '该链接已过期，请重新申请。'});
        }
        return res.render('sign/reset', {name: name, key: key});
    });
};
