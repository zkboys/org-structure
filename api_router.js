var express = require('express');
var config = require('./config');
var router = express.Router();
var menu = require('./api/Menu');
var organization = require('./api/Organization');
var user = require('./api/User');
var role = require('./api/Role');
var sign = require('./api/Sign');
var permission = require('./middlewares/permission').permission;

// 登录 登出
router.post('/signout', sign.signout);
router.post('/signin', sign.login);
router.put('/first_login', sign.firstLogin);

// 菜单
router.get('/system/menus', menu.getAllMenus);
router.post('/system/menus', menu.updateAllMenus);

// 组织架构
router.get('/organization/organizations', organization.getAll);
router.post('/organization/organizations', organization.updateAll);

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
router.put('/organization/users/toggle_lock', permission('user-toggleLock'), user.toggleLock);

// 角色
router.get('/organization/roles', role.getByPage);
router.get('/organization/roles/:id', role.getById);
router.post('/organization/roles', role.addAndSave);
router.put('/organization/roles', role.update);
router.delete('/organization/roles', role.delete);

module.exports = router;
