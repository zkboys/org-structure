var models = require('../models');
var User = models.User;
var utility = require('utility');
var uuid = require('node-uuid');
/**
 * 根据用户名列表查找用户列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByNames = function (names, callback) {
    if (names.length === 0) {
        return callback(null, []);
    }
    User.find({loginname: {$in: names}}, callback);
};

/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginName 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByLoginName = function (loginName, callback) {
    User.findOne({'loginname': new RegExp('^' + loginName + '$', "i")}, callback);
};

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
    if (!id) {
        return callback();
    }
    User.findOne({_id: id}, callback);
};

/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getUserByMail = function (email, callback) {
    User.findOne({email: email}, callback);
};

/**
 * 根据用户ID列表，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} ids 用户ID列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByIds = function (ids, callback) {
    User.find({'_id': {'$in': ids}}, callback);
};

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Object} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function (query, opt, callback) {
    if (query.is_deleted === undefined) {
        query.is_deleted = false;
    }
    User.find(query, '', opt, callback);
};

exports.getUsersCountByQuery = function (query, callback) {
    if (query.is_deleted === undefined) {
        query.is_deleted = false;
    }
    User.count(query, callback);
};
/**
 * 逻辑删除用户
 * @param id {String}
 * @param callback {Function}
 */
exports.delete = function (id, callback) {
    User.findOneAndUpdate({_id: id}, {is_deleted: true}, callback)
}

/**
 * 锁定用户
 * @param id {String}
 * @param callback {Function}
 */
exports.lock = function (id, callback) {
    User.findOneAndUpdate({_id: id}, {is_locked: true}, callback)
}
/**
 * 解锁用户
 * @param id {String}
 * @param callback {Function}
 */
exports.unlock = function (id, callback) {
    User.findOneAndUpdate({_id: id}, {is_locked: false}, callback)
}

exports.newAndSave = function (user, callback) {
    new User(user).save(callback);
};

