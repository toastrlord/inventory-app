var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 50},
        category: {type: Schema.Types.ObjectId, required: true},
        price: {type: Number, required: true},
        number_in_stock: {type: Number, required: true}
    }
);

ItemSchema
.virtual('url')
.get(function() {
    return '/items/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);