var Organization = require('../proxy/index').Organization;
exports.getAllOrganizations = function (req, res, next) {
    Organization.getAllOrganizations(function (err, organizations) {
        if (err) {
            res.status(422);
            return res.send({message: '获取组织信息失败'});
        }
        res.send(organizations)
    });
};
exports.updateAllOrganizations = function (req, res, next) {
    var organizations = req.body.organizations;
    Organization.updateAllOrganizations(organizations, function (err) {
        if (err) {
            res.status(422);
            return res.send({message: '更新组织失败'});
        }
        res.send({success: true})
    });
};
