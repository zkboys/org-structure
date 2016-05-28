var validator = require('validator');
var uuid = require('node-uuid');
var eventProxy = require('eventproxy');
var tools = require('../common/tools');
var User = require('../proxy/user');

exports.getAllUsersByPage = function (req, res, next) {
    var currentPage = parseInt(req.query.currentPage, 10) || 1;
    var pageSize = Number(req.query.pageSize);
    var options = {skip: (currentPage - 1) * pageSize, limit: pageSize, sort: '-create_at'};
    var query = {};
    // 如下字段进行模糊查询。
    ['loginname', 'name', 'mobile'].forEach(function(v){
       var value = req.query[v];
        if(value){
            query[v] = new RegExp(value);
        }
    });
    var ep = new eventProxy();
    ep.all('count', 'results', function (count, results) {
        res.send({
            result: {
                results: results,
                totalCount: count,
            }
        })
    });
    ep.fail(function (err) {
        res.status(422);
        res.send({message: '获取人员信息失败'});
    })
    User.getUsersByQuery(query, options, ep.done(function (docs) {
        ep.emit('results', docs);
    }));
    User.getUsersCountByQuery(query, ep.done(function (docs) {
        ep.emit('count', docs);
    }));
};

exports.getUserByLoinName = function (req, res, next) {
    var loginName = req.params.loginname;
    User.getUserByLoginName(loginName, function (err, docs) {
        if (err) {
            res.status(422);
            return res.send({message: '获取人员失败'});
        }
        res.send({
            result: docs
        })
    });
};

exports.delete = function (req, res, next) {
    var id = req.body.id;
    User.delete(id, function (err, docs){
        if (err) {
            res.status(422);
            return res.send({message: '删除失败'});
        }
        res.send({
            success: true,
            result: {},
        })
    });
};

exports.addAndSave = function (req, res, next) {
    function error(msg) {
        res.status(422);
        res.send({message: msg});
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
            var name = req.body.name || loginname;
            var email = req.body.email;
            var avatarUrl = '';
            var mobile = req.body.mobile;
            var gender = req.body.gender;
            var position = req.body.position;
            var org_id = req.body.org_id;
            var is_locked = req.body.is_locked;
            User.newAndSave(name, loginname, passhash, salt, email, avatarUrl, mobile, gender, position, org_id, is_locked, function (err, doc) {
                if (err) {
                    return error(err);
                }
                return res.send({
                    success: true,
                    result: {},
                })
            });

        });
    });
};
