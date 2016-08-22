var validator = require('validator');
var uuid = require('node-uuid');
var eventProxy = require('eventproxy');
var tools = require('../common/tools');
var User = require('../proxy/User');

exports.getById = function (req, res, next) {
    var id = req.params.id;
    User.getUserById(id, function (err, doc) {
        if (err) {
            return res.sendError(err, '获取用户信息失败！', 422);
        }
        res.send(doc)
    })
}

exports.getByPage = function (req, res, next) {
    var currentPage = parseInt(req.query.currentPage, 10) || 1;
    var pageSize = Number(req.query.pageSize);
    var options = {skip: (currentPage - 1) * pageSize, limit: pageSize, sort: '-create_at'};
    var query = {};
    // 如下字段进行模糊查询。
    ['loginname', 'name', 'mobile'].forEach(function (v) {
        var value = req.query[v];
        if (value) {
            query[v] = new RegExp(value);
        }
    });
    var ep = new eventProxy();
    ep.all('count', 'results', function (count, results) {
        res.send({
            results: results,
            totalCount: count,
        })
    });
    ep.fail(function (err) {
        res.sendError(err, '获取人员信息失败！', 422);
    })
    User.getUsersByQuery(query, options, ep.done('results'));
    User.getUsersCountByQuery(query, ep.done('count'));
};

exports.getByLoginNameFromAll = function (req, res, next) {
    var loginName = req.params.loginname;
    User.getUserByLoginNameFromAllUsers(loginName, function (err, docs) {
        if (err) {
            return res.sendError(err, '获取人员信息失败！', 422);
        }
        res.send(docs)
    });
};

exports.delete = function (req, res, next) {
    var id = req.body.id;
    User.delete(id, function (err, docs) {
        if (err) {
            return res.sendError(err, '删除失败！', 422);
        }
        res.send({})
    });
};

exports.toggleLock = function (req, res, next) {
    var id = req.body.id;
    var isLocked = req.body.isLocked;
    if (isLocked) {
        User.unlock(id, function (err, docs) {
            if (err) {
                return res.sendError(err, '解锁用户失败！', 422);
            }
            res.send(docs)
        });
    } else {
        User.lock(id, function (err, docs) {
            if (err) {
                return res.sendError(err, '锁定用户失败！', 422);
            }
            res.send(docs)
        });
    }
};

exports.update = function (req, res, next) {
    var user = req.body;
    console.log(user);
    User.update(user, function (err, doc) {
        if (err) {
            return res.sendError(err, '修改用户失败！', 422);
        }
        // res.sendError('', '测试出错');
        res.send(doc)
    })

};

exports.addAndSave = function (req, res, next) {
    function error(msg) {
        res.sendError('', msg);
    }

    var loginname = req.body.loginname;
    if (!loginname) {
        return error('登录名不能为空！');
    }
    loginname = validator.trim(req.body.loginname);
    var pass = loginname[0] + 123456;

    // 验证信息的正确性
    if (loginname === '') {
        return error('登录名不能为空！');
    }
    if (loginname.length < 2) {
        return error('登录名至少需要2个字符。');
    }
    if (!tools.validateId(loginname)) {
        return error('登录名不合法。');
    }

    // END 验证信息的正确性
    User.getUserByLoginNameFromAllUsers(loginname, function (err, user) {
        if (err) {
            return error(err);
        }
        if (user) {
            return error('登录名已被使用。');
        }
        var salt = uuid.v4();
        tools.bhash(pass + salt, function (err, passhash) {
            var user = req.body;
            user.name = user.name || user.loginname;
            user.pass = passhash;
            user.salt = salt;
            User.newAndSave(user, function (err, doc) {
                if (err) {
                    return res.sendError(err, '保存用户信息失败', 422);
                }
                return res.send({})
            });

        });
    });
};

exports.updatePass = function (req, res, next) {
    var pass = validator.trim(req.body.pass) || '';
    var rePass = validator.trim(req.body.rePass) || '';
    var orPass = validator.trim(req.body.orPass) || '';
    var currrentLoginUser = req.session.user;


    var ep = new eventProxy();
    ep.fail(function (err) {
        res.sendError(err, '修改密码失败！', 422);
    });

    if (pass !== rePass) {
        return res.sendError(err, '新密码与确认密码不一直！', 422);
    }
    User.getUserById(currrentLoginUser._id, ep.done(function (user) {
        if (!user) {
            return res.sendError(null, '修改密码失败！', 422);
        }
        tools.bcompare(orPass + user.salt, user.pass, ep.done(function (bool) {
            if (!bool) {
                return res.sendError(null, '原密码错误！', 422);
            }
            tools.bhash(pass + user.salt, ep.done(function (passhash) {
                user.pass = passhash;
                user.save(function (err) {
                    if (err) {
                        return res.sendError(null, '修改密码失败！', 422);
                    }
                    return res.sendSuccess();
                });
            }));

        }));
    }));
};

exports.resetPass = function (req, res, next) {
    var userId = req.body.id;
    var ep = new eventProxy();
    ep.fail(function (err) {
        res.sendError(err, '重置密码失败！', 422);
    });
    User.getUserById(userId, ep.done(function (user) {
        if (!user) {
            return res.sendError(null, '重置密码失败！', 422);
        }
        var pass = user.loginname[0] + '123456';
        tools.bhash(pass + user.salt, ep.done(function (passhash) {
            user.pass = passhash;
            user.is_first_login = true;
            user.save(function (err) {
                if (err) {
                    return res.sendError(err, '重置密码失败！', 422);
                }
                return res.sendSuccess();
            });
        }));
    }));
};
