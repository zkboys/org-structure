var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrganizationSchema = new Schema({
    org_id: {type: String},
    parent_org_id: {type: String},
    name: {type: String},
    description: {type: String},
    remark: {type: String},
});

OrganizationSchema.index({org_id: 1}, {unique: true});
mongoose.model('Organization', OrganizationSchema);
