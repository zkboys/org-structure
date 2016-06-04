var Organization = require('../models').Organization;

/**
 * 获取所有组织架构数据
 * callback(err, docs):
 * - err, 数据库错误
 * - docs，返回的数据
 * */
exports.getAllOrganizations = function (callback) {
    Organization.find(callback);
};
/**
 *
 * @param callback
 * @param newOrganizations
 */
exports.updateAllOrganizations = function (newOrganizations, callback) {
    Organization.remove({}, function (err, docs) {
        Organization.create(newOrganizations, callback);
    });
};

