var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 50},
        category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        price: {type: Number, required: true},
        number_in_stock: {type: Number, required: true},
        image_filename: {type: String, required: false}
    }
);

ItemSchema
.virtual('url')
.get(function() {
    return '/item/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);