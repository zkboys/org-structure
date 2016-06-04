var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MenuSchema = new Schema({
    key: {type: String},
    parentKey: {type: String},
    order: {type: Number},
    icon: {type: String},
    text: {type: String},
    path: {type: String},
});
MenuSchema.index({key: 1}, {unique: true});
mongoose.model('Menu', MenuSchema);
