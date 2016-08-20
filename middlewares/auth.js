var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var Message = require('../proxy').Message;
var config = require('../config');
var eventproxy = require('eventproxy');
var UserProxy = require('../proxy').User;
var RoleProxy = require('../proxy/Role');

/**
 * 需要管理员权限
 */
exports.adminRequired = function (req, res, next) {
    if (!req.session.user) {
        return res.render('notify/notify', {error: '你还没有登录。'});
    }

    if (!req.session.user.is_admin) {
        return res.render('notify/notify', {error: '需要管理员权限。'});
    }

    next();
};

function unneedLogin(req) {
    return req.path === '/signout'
        || req.path === '/signin'
        || req.path === '/signup'
        || req.path === '/api/signout'
        || req.path === '/api/signin'
        || req.path === '/api/first_login'
        || req.path === '/api/signup'
        || req.path === '/favicon.ico';
}
/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
    if (!req.session || !req.session.user || !req.session.user._id || req.session.user.is_first_login) {
        if (unneedLogin(req)) {
            return next();
        }
        //TODO 区分ajax请求还是http请求
        if (req.path.indexOf('/api') === 0) {
            return res.sendError(null, '用户未登录，或登录已过期', 401);
        }
        if (req.path.indexOf('/public') === 0) {
            return next();
        }
        console.log(req.path);
        req.session._loginReferer = req.path;
        return res.redirect('/signin');
    }
    next();
};

exports.blockUser = function () {
    return function (req, res, next) {
        if (unneedLogin(req)) {
            return next();
        }
        if (req.session && req.session.user && req.session.user.is_locked) {
            return res.sendError('', '您已被管理员屏蔽了。有疑问请联系 管理员。', 403);
        }
        next();
    };
};


function gen_session(user, res) {
    var auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
    var opts = {
        path: '/',
        //maxAge: 1000 * 3, //cookie 有效期30天，30天都不用登录了,记住用户可以用这个做。
        signed: true,
        httpOnly: true
    };
    res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
}

exports.gen_session = gen_session;

// 存user到session locals
exports.authUser = function (req, res, next) {
    var ep = new eventproxy();
    ep.fail(next);

    // Ensure current_user always has defined.
    res.locals.current_user = null;


    if (config.debug) {
        var mockUser = req.params.mock_user || req.body.mock_user;
        req.session.user = new UserModel(mockUser);
        if (mockUser.is_admin) {
            req.session.user.is_admin = true;
        }
        return next();
    }

    ep.all('get_user', function (user) {
        if (!user) {
            return next();
        }
        user = new UserModel(user);
        RoleProxy.getRoleById(user.role_id, function (err, role) {
            if (err) {
                next();
            } else {
                if (role) {
                    user.permissions = role.permissions;
                }
                res.locals.current_user = req.session.user = user;
                req.session.lastVisitAt = new Date().getTime();
                next();
            }
        });
    });

    if (req.session.user) {
        if (req.session.lastVisitAt && (new Date().getTime() - req.session.lastVisitAt >= config.session_time_out)) {
            req.session.user = null;
            res.clearCookie(config.auth_cookie_name, {path: '/'});
        }
        ep.emit('get_user', req.session.user);
    } else {
        var auth_token = req.signedCookies[config.auth_cookie_name];
        if (!auth_token) {
            return next();
        }

        var auth = auth_token.split('$$$$');
        var user_id = auth[0];
        UserProxy.getUserById(user_id, ep.done('get_user'));
    }
};
