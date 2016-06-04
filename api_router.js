var express = require('express');
var config = require('./config');
var router = express.Router();
var menu = require('./api/Menu');
var organization = require('./api/Organization');
var user = require('./api/User');
var sign = require('./api/Sign');

// 登录 登出
router.post('/signout', sign.signout);
router.post('/signin', sign.login);
router.put('/first_login', sign.firstLogin);

// 菜单
router.get('/system/menus', menu.getAllMenus);
router.post('/system/menus', menu.updateAllMenus);

// 组织架构
router.get('/organization/organizations', organization.getAllOrganizations);
router.post('/organization/organizations', organization.updateAllOrganizations);

// 用户
router.put('/system/pass', /*needCurrentUser*/ user.updatePass);
router.put('/system/message', /*needCurrentUser*/ user.update); // 跟组织同样是update方法，但是权限不一样

// 组织架构
router.get('/organization/users', user.getAllUsersByPage);
router.get('/organization/users/:id', user.getUserById);
router.get('/organization/users/loginname/:loginname', user.getUserByLoginNameFromAllUsers);
router.post('/organization/users', user.addAndSave);
router.put('/organization/users', user.update);
router.delete('/organization/users', user.delete);
router.put('/organization/users/toggle_lock', user.toggleLock);


module.exports = router;
