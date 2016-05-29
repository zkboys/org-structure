var validator = require('validator');
var eventproxy = require('eventproxy');
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
    var ep = new eventproxy();

    ep.fail(function(err){
        res.sendError(err,'登录失败', 422)
    });

    if (!loginname || !pass) {
        return res.sendError(null,'用户名或者密码不能为空！', 422);
    }

    ep.on('login_error', function (login_error) {
        res.sendError(null, '用户名或密码错误', 403);
    });

    User.getUserByLoginName(loginname, function (err, user) {
        if (err) {
            return res.sendError(null,'登录失败！', 422);
        }
        if (!user) {
            return ep.emit('login_error');
        }
        var passhash = user.pass;
        tools.bcompare(pass + user.salt, passhash, ep.done(function (bool) {
            if (!bool) {
                return ep.emit('login_error');
            }
            // store session cookie
            authMiddleWare.gen_session(user, res);
            //check at some page just jump to home page
            var refer = req.session._loginReferer || '/';
            for (var i = 0, len = notJump.length; i !== len; ++i) {
                if (refer.indexOf(notJump[i]) >= 0) {
                    refer = '/';
                    break;
                }
            }

            var safeUSer = {
                name: user.name,
                loginname: user.loginname,
                email: user.email,
                avatar: user.avatar,
            };
            Menu.getMenusByUser(user, function (err, menus) {
                if (err) return res.sendError(err,'登录失败！', 422);
                res.send({refer: refer, user: safeUSer, menus: menus});
            })
        }));
    });
};
// sign out
exports.signout = function (req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {path: '/'});
    res.send({});
};
