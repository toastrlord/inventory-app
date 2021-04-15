const Category = require("../models/category");

exports.category_list = function(req, res, next) {
    Category.find()
        .sort([['name', 'ascending']])
        .exec(function(err, categories) {
            if (err) { return next(err); }
            res.render('category_list', { title: 'Categories: ', category_list: categories});
        });
}

exports.category_detail = function(req, res, next) {
    res.send('NOT IMPLEMENTED: CATEGORY_DETAIL');
}

exports.category_create_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: CATEGORY_CREATE_GET');
}

exports.category_create_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: CATEGORY_CREATE_POST');
}

exports.category_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: CATEGORY_DELETE_GET');
}

exports.category_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: CATEGORY_DELETE_POST');
}