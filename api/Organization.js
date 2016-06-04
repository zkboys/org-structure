var Organization = require('../proxy/Organization');
exports.getAll = function (req, res, next) {
    Organization.getAllOrganizations(function (err, organizations) {
        if (err) {
            return res.sendError(err,'获取组织信息失败',422)
        }
        res.send(organizations)
    });
};
exports.updateAll = function (req, res, next) {
    var organizations = req.body.organizations;
    Organization.updateAllOrganizations(organizations, function (err) {
        if (err) {
            return res.sendError(err, '更新组织失败', 422);
        }
        res.send({})
    });
};
