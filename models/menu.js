var mongoose = require('mongoose');
var BaseModel = require("./base_model");
var Schema = mongoose.Schema;


var MenuSchema = new Schema({
    key: {type: String},
    parentKey: {type: String},
    order: {type: Number},
    icon: {type: String},
    text: {type: String},
    path: {type: String},
    is_deleted: {type: Boolean},
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},
});

MenuSchema.plugin(BaseModel);
MenuSchema.index({key: 1}, {unique: true});
mongoose.model('Menu', MenuSchema);
