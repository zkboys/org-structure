var validator = require('validator');
var uuid = require('node-uuid');
var eventProxy = require('eventproxy');
var tools = require('../common/tools');
var User = require('../proxy/user');

exports.getUserById = function (req, res, next) {
    var id = req.params.id;
    User.getUserById(id, function(err, doc){
        if(err){
            return res.sendError(err, '获取用户信息失败！', 422);
        }
        res.send(doc)
    })
}

exports.getAllUsersByPage = function (req, res, next) {
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

exports.getUserByLoinName = function (req, res, next) {
    var loginName = req.params.loginname;
    User.getUserByLoginName(loginName, function (err, docs) {
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
            res.send({})
        });
    } else {
        User.lock(id, function (err, docs) {
            if (err) {
                return res.sendError(err, '锁定用户失败！', 422);
            }
            res.send({})
        });
    }
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
    User.getUserByLoginName(loginname, function (err, user) {
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
