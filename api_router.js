var express = require('express');
var config = require('./config');
var router = express.Router();
var menu = require('./api/Menu');
var organization = require('./api/Organization');
var user = require('./api/User');
var role = require('./api/Role');
var sign = require('./api/Sign');
var permission = require('./middlewares/permission').permission;
// 查询条件模拟数据
router.get('/options', function (req, res, next) {
    var data = [];
    for (var i = 0; i < 30; i++) {
        data.push({
            label: '模拟数据' + i,
            value: i,
        })
    }
    res.send(data);
});
// 登录 登出
router.post('/signout', sign.signout);
router.post('/signin', sign.login);
router.put('/first_login', sign.firstLogin);

// 菜单
router.get('/system/menus', menu.getAllMenus);
router.post('/system/menus', menu.updateAllMenus);

// 组织架构
router.get('/organization/organizations', /*permission('organization-search'),*/ organization.getAll);// 这里不要添加权限限制，也不会产生安全性问题，而且用户相关会用到这个接口。
router.post('/organization/organizations', permission('organization-update'), organization.updateAll);

// 用户
router.put('/system/pass', /*needCurrentUser*/ user.updatePass);
router.put('/system/message', /*needCurrentUser*/ user.update); // 跟组织同样是update方法，但是权限不一样

// 组织架构
// 用户
router.get('/organization/users', permission('user-search'), user.getByPage);
router.get('/organization/users/:id', user.getById);
router.get('/organization/users/loginname/:loginname', user.getByLoginNameFromAll);
router.post('/organization/users', permission('user-add'), user.addAndSave);
router.put('/organization/users', permission('user-update'), user.update);
router.put('/organization/users/reset_pass', permission('user-reset-pass'), user.resetPass);
router.delete('/organization/users', permission('user-delete'), user.delete);
router.put('/organization/users/toggle_lock', permission('user-toggle-lock'), user.toggleLock);

// 角色
router.get('/organization/roles', /* permission('role-search'), */role.getByPage); // 这里不要添加权限限制，也不会产生安全性问题，而且用户相关会用到这个接口。
router.get('/organization/roles/:id', role.getById);
router.post('/organization/roles', permission('role-add'), role.addAndSave);
router.put('/organization/roles', permission('role-update'), role.update);
router.delete('/organization/roles', permission('role-delete'), role.delete);

module.exports = router;
