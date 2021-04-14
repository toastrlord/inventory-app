var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: {type: String, required: true, maxLength: 50},
    description: {type: String, maxLength: 100}
});

CategorySchema
.virtual('url')
.get(function () {
    return '/category/' + this_id;
});

module.exports = mongoose.model('Category', CategorySchema);