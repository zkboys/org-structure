var validator = require('validator');
var eventProxy = require('eventproxy');
var authMiddleWare = require('../middlewares/auth');
var config = require('../config');
var tools = require('../common/tools');
var User = require('../proxy/user');
var Menu = require('../proxy/menu');


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

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function (req, res, next) {
    var loginname = validator.trim(req.body.name).toLowerCase();
    var pass = validator.trim(req.body.pass);
    var ep = new eventProxy();

    ep.fail(function (err) {
        res.sendError(err, '登录失败', 422)
    });

    if (!loginname || !pass) {
        return res.sendError(null, '用户名或者密码不能为空！', 422);
    }

    ep.on('login_error', function (login_error) {
        res.sendError(null, login_error, 403);
    });

    User.getUserByLoginName(loginname, function (err, user) {
        if (err) {
            return res.sendError(null, '登录失败！', 422);
        }
        if (!user) {
            return ep.emit('login_error', '用户名或密码错误！');
        }
        if (user.is_locked) {
            return ep.emit('login_error', '您已经被管理员屏蔽，如有疑问，请与管理员联系！')
        }
        var passhash = user.pass;
        tools.bcompare(pass + user.salt, passhash, ep.done(function (bool) {
            if (!bool) {
                return ep.emit('login_error', '用户名或密码错误！');
            }
            //check at some page just jump to home page
            var refer = req.session._loginReferer || '/';
            for (var i = 0, len = notJump.length; i !== len; ++i) {
                if (refer.indexOf(notJump[i]) >= 0) {
                    refer = '/';
                    break;
                }
            }
            // 清除上一个用户的session
            req.session.destroy();
            // store session cookie
            authMiddleWare.gen_session(user, res);
            var safeUSer = {
                _id: user._id,
                name: user.name,
                loginname: user.loginname,
                email: user.email,
                avatar: user.avatar,
                is_first_login: user.is_first_login,
            };
            Menu.getMenusByUser(user, function (err, menus) {
                if (err) return res.sendError(err, '登录失败！', 422);
                res.send({refer: refer, user: safeUSer, menus: menus});
            })
        }));
    });
};
/**
 * 首次登录，修改密码
 * @param req
 * @param res
 * @param next
 */
exports.firstLogin = function (req, res, next) {
    var currentLoginUser = req.session.user;
    var pass = validator.trim(req.body.pass);
    var rePass = validator.trim(req.body.rePass);
    if (!pass) {
        return res.sendError(null, '密码不能为空！', 422);
    }
    if (!rePass) {
        return res.sendError(null, '确认密码不能为空！', 422);
    }
    if (pass !== rePass) {
        return res.sendError(null, '两次输入密码不一致！', 422);
    }

    tools.bhash(pass + currentLoginUser.salt, function (err, hashPass) {
        if (err) {
            return res.sendError(null, '保存密码失败！', 422);
        }
        currentLoginUser.pass = hashPass;
        currentLoginUser.is_first_login = false;
        User.update(currentLoginUser, function (err, user) {
            if (err) {
                return res.sendError(null, '保存密码失败！', 422);
            }
            // 清除上一个用户的session
            req.session.destroy();
            // store session cookie
            authMiddleWare.gen_session(user, res);
            var safeUSer = {
                _id: user._id,
                name: user.name,
                loginname: user.loginname,
                email: user.email,
                avatar: user.avatar,
                is_first_login: user.is_first_login,
            };
            Menu.getMenusByUser(user, function (err, menus) {
                if (err) return res.sendError(err, '保存密码失败！', 422);
                res.send({refer: '/', user: safeUSer, menus: menus});
            })
        });
    });
};
/**
 * 退出登录
 * @param req
 * @param res
 * @param next
 */
exports.signout = function (req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {path: '/'});
    res.send({});
};
