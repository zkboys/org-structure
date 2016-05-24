var EventProxy = require('eventproxy');
var _ = require('lodash');

var Menu = require('../models').Menu;

/**
 * 获取所有菜单
 * callback(err, docs):
 * - err, 数据库错误
 * - docs，返回的数据
 * */
exports.getAllMenus = function (callback) {
    Menu.find(callback);
};
/**
 * 更新所有菜单
 * callback(err, jellybean, snickers):
 *
 *
 *
 * */
exports.updateAllMenus = function (newMenus, callback) {
    Menu.remove({}, function (err, docs) {
        Menu.create(newMenus, callback)
    });
}
/**
 * 根据用户，获取此用户有权限得菜单
 * callback(err, docs):
 * - err, 数据库错误
 * - docs，返回的数据
 * */
exports.getMenusByUser = function (user, callback) {
    // TODO 添加权限判断
    Menu.find(callback);
};
