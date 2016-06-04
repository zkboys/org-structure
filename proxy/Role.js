var models = require('../models');
var Role = models.Role;
/**
 * 根据id获取数据
 * @param id
 * @param callback
 * @returns {*}
 */
exports.getRoleById = function (id, callback) {
    if (!id) {
        return callback();
    }
    Role.findOne({_id: id}, callback);
};

/**
 * 根据关键字，获取一组数据
 * Callback:
 * - err, 数据库异常
 * - docs, 数据列表
 * @param {Object} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getRolesByQuery = function (query, opt, callback) {
    if (query.is_deleted === undefined) {
        query.is_deleted = false;
    }
    Role.find(query, '', opt, callback);
};
/**
 * 根据关键字，获取数量
 * @param query
 * @param callback
 */
exports.getRolesCountByQuery = function (query, callback) {
    if (query.is_deleted === undefined) {
        query.is_deleted = false;
    }
    Role.count(query, callback);
};

/**
 * 修改
 * @param data {Object}
 * @param callback {Function}
 */
exports.update = function (data, callback) {
    Role.update_at = new Date();
    Role.findOneAndUpdate({_id: data._id}, data, callback)
};

/**
 * 逻辑删除
 * @param id {String}
 * @param callback {Function}
 */
exports.delete = function (id, callback) {
    Role.findOneAndUpdate({_id: id}, {is_deleted: true, update_at: new Date()}, callback)
};

/**
 * 新建
 * @param data {Object}
 * @param callback {Function}
 */
exports.newAndSave = function (data, callback) {
    new Role(data).save(callback);
};

