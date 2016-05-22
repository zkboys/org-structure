var mongoose = require('mongoose');
var BaseModel = require("./base_model");
var renderHelper = require('../common/render_helper');
var Schema = mongoose.Schema;
var utility = require('utility');
var _ = require('lodash');

var UserSchema = new Schema({
    name: {type: String},
    loginname: {type: String},
    pass: {type: String},
    salt: {type: String},
    email: {type: String},
    avatar: {type: String},
    is_locked: {type: Boolean},
    is_deleted: {type: Boolean},
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},
});

UserSchema.plugin(BaseModel);
UserSchema.virtual('avatar_url').get(function () {
    var url = this.avatar;
    return url;
});

UserSchema.index({loginname: 1}, {unique: true});
mongoose.model('User', UserSchema);
