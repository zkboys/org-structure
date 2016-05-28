var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrganizationSchema = new Schema({
    key: {type: String},
    parentKey: {type: String},
    name: {type: String},
    description: {type: String},
    remark: {type: String},
});
OrganizationSchema.index({key: 1}, {unique: true});
mongoose.model('Organization', OrganizationSchema);
