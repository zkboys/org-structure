var express           = require('express');
var topicController   = require('./api/v1/topic');
var topicCollectController   = require('./api/v1/topic_collect');
var userController    = require('./api/v1/user');
var toolsController   = require('./api/v1/tools');
var replyController   = require('./api/v1/reply');
var messageController = require('./api/v1/message');
var middleware        = require('./api/v1/middleware');
var limit             = require('./middlewares/limit');

var menu = require('./api/menu');
var organization = require('./api/organization');
var user = require('./api/user');

var config            = require('./config');

var router            = express.Router();

router.get('/system/menus', menu.getAllMenus);  // 获取所有菜单数据
router.post('/system/menus', menu.updateAllMenus);  // 修改所有菜单

router.get('/organization/organizations', organization.getAllOrganizations);
router.post('/organization/organizations', organization.updateAllOrganizations);
// 用户
router.get('/organization/users', user.getAllUsersByPage);
router.post('/organization/users', user.addAndSave);
router.delete('/organization/users', user.delete);
router.get('/organization/users/loginname/:loginname', user.getUserByLoinName);

// 主题
router.get('/topics', topicController.index);
router.get('/topic/:id', middleware.tryAuth, topicController.show);
router.post('/topics', middleware.auth, limit.peruserperday('create_topic', config.create_post_per_day, true), topicController.create);


// 主题收藏
router.post('/topic_collect/collect', middleware.auth, topicCollectController.collect); // 关注某话题
router.post('/topic_collect/de_collect', middleware.auth, topicCollectController.de_collect); // 取消关注某话题
router.get('/topic_collect/:loginname', topicCollectController.list);

// 用户
router.get('/user/:loginname', userController.show);



// accessToken 测试
router.post('/accesstoken', middleware.auth, toolsController.accesstoken);

// 评论
router.post('/topic/:topic_id/replies', middleware.auth, limit.peruserperday('create_reply', config.create_reply_per_day, true), replyController.create);
router.post('/reply/:reply_id/ups', middleware.auth, replyController.ups);

// 通知
router.get('/messages', middleware.auth, messageController.index);
router.get('/message/count', middleware.auth, messageController.count);
router.post('/message/mark_all', middleware.auth, messageController.markAll);

module.exports = router;
