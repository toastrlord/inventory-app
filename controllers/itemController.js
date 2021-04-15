const Item = require('../models/item');

exports.item_list = function(req, res, next) {
    res.send('NOT YET IMPLEMENTED: ITEM_LIST');
}

exports.item_detail = function(req, res, next) {
    Item.findById(req.params.id)
    .populate('category')
    .exec(function (err, item) {
        if (err) { return next(err); }
        if (item == null) {
            const error = new Error('Item not found');
            error.status = 404;
            return next(error);
        }
        res.render('item_detail', {title: item.name, item: item});
    });
}

exports.item_create_get = function(req, res, next) {
    res.render('item_form', { title: 'Create new item'});
}

exports.item_create_post = function(req, res, next) {
    res.send('NOT YET IMPLEMENTED: ITEM_CREATE_POST');
}

exports.item_update_get = function(req, res, next) {
    res.send('NOT YET IMPLEMENTED: ITEM_UPDATE_GET');
}

exports.item_update_post = function(req, res, next) {
    res.send('NOT YET IMPLEMENTED: ITEM_UPDATE_POST');
}

exports.item_delete_get = function(req, res, next) {
    res.send('NOT YET IMPLEMENTED: ITEM_DELETE_GET');
}

exports.item_delete_post = function(req, res, next) {
    res.send('NOT YET IMPLEMENTED: ITEM_DELETE_POST');
}