var mongoose = require('mongoose');
var config = require('../config');
var logger = require('../common/logger');
var BaseModel = require("./base_model");

mongoose.connect(config.db, {
    server: {poolSize: 20}
}, function (err) {
    if (err) {
        logger.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});
mongoose.plugin(BaseModel);


// models
require('./organization');
require('./user');
require('./menu');
require('./topic');
require('./reply');
require('./topic_collect');
require('./message');

exports.Organization = mongoose.model('Organization');
exports.Menu = mongoose.model('Menu');
exports.User = mongoose.model('User');
exports.Topic = mongoose.model('Topic');
exports.Reply = mongoose.model('Reply');
exports.TopicCollect = mongoose.model('TopicCollect');
exports.Message = mongoose.model('Message');
