var eventProxy = require('eventproxy');
var Role = require('../proxy/Role');

exports.getById = function (req, res, next) {
    var id = req.params.id;
    Role.getRoleById(id, function (err, doc) {
        if (err) {
            return res.sendError(err, '获取信息失败！', 422);
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
    ['name'].forEach(function (v) {
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
        res.sendError(err, '获取信息失败！', 422);
    })
    Role.getRolesByQuery(query, options, ep.done('results'));
    Role.getRolesCountByQuery(query, ep.done('count'));
};

exports.delete = function (req, res, next) {
    var id = req.body.id;
    Role.delete(id, function (err, doc) {
        if (err) {
            return res.sendError(err, '删除失败！', 422);
        }
        res.sendSuccess()
    });
};

exports.update = function (req, res, next) {
    var data = req.body;
    Role.update(data, function (err, doc) {
        if (err) {
            return res.sendError(err, '修改失败！', 422);
        }
        res.send(doc)
    })

};

exports.addAndSave = function (req, res, next) {
    function error(msg) {
        res.sendError('', msg);
    }
    var data = req.body;
    if (data.name === '') {
        return error('名称不能为空！');
    }
    // END 验证信息的正确性
    Role.newAndSave(data, function (err, doc) {
        if (err) {
            return res.sendError(err, '保存失败！', 422);
        }
        return res.sendSuccess()
    });
};
