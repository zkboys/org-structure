var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {type: String},
    loginname: {type: String},
    pass: {type: String},
    salt: {type: String},
    email: {type: String},
    mobile: {type: String},
    gender: {type: String},
    avatar: {type: String},
    position: {type: String},
    is_first_login: {type: Boolean, default: true},
    org_key: {type: String}, // 这里不要使用org_id ，org_id总是变化，key是不变的。
    is_locked: {type: Boolean, default: false},
});

UserSchema.virtual('avatar_url').get(function () {
    return this.avatar;
});

UserSchema.index({loginname: 1}, {unique: true});
mongoose.model('User', UserSchema);
