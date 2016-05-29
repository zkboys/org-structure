var express = require('express');
var config = require('./config');
var router = express.Router();
var menu = require('./api/menu');
var organization = require('./api/organization');
var user = require('./api/user');
var sign = require('./api/sign');

// 登录 登出
router.post('/signout', sign.signout);
router.post('/signin', sign.login);

// 菜单
router.get('/system/menus', menu.getAllMenus);
router.post('/system/menus', menu.updateAllMenus);

// 组织架构
router.get('/organization/organizations', organization.getAllOrganizations);
router.post('/organization/organizations', organization.updateAllOrganizations);

// 用户
router.get('/organization/users', user.getAllUsersByPage);
router.get('/organization/users/:id', user.getUserById);
router.get('/organization/users/loginname/:loginname', user.getUserByLoginNameFromAllUsers);
router.post('/organization/users', user.addAndSave);
router.put('/organization/users', user.update);
router.delete('/organization/users', user.delete);
router.put('/organization/users/toggle_lock', user.toggleLock);


module.exports = router;
