const Category = require('../models/category');
const Item =require('../models/item');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.category_list = function(req, res, next) {
    Category.find()
        .sort([['name', 'ascending']])
        .exec(function(err, categories) {
            if (err) { return next(err); }
            res.render('category_list', { title: 'Categories: ', category_list: categories});
        });
}

exports.category_detail = function(req, res, next) {
    async.parallel({
        category: function (callback) {
            Category.findById(req.params.id).exec(callback);
        },
        items: function (callback) {
            Item.find({'category': req.params.id})
            .sort([['name', 'ascending']])
            .exec(callback);
        }
    },
    function(err, results) {
        if (err) { return next(err); }
        if (results.category == null) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }
        res.render('category_detail', { title: 'Category: ' + results.category.name, category: results.category, items: results.items});
    });
}

exports.category_create_get = function(req, res, next) {
    res.render('category_form', { title: 'Create new category' });
}

exports.category_create_post = [
    body('name', 'Name is required').trim().isLength({min: 1}).escape(),
    body('description', 'Description is required').trim().isLength({min: 1}).escape(),
    (req, res, next) => {
        const newCategory = new Category({
            name: req.body.name,
            description: req.body.description
        });

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('category_form', { title: 'Create new category', category: newCategory, errors: errors.array()});
        }
        else {
            Category.create(newCategory, function(err, theCategory) {
                if (err) { return next(err); }
                res.redirect(theCategory.url);
            })
        }
    }
];

exports.category_update_get = function(req, res, next) {
    Category.findById(req.params.id)
    .exec(function(err, category) {
        if (err) { return next(err); }
        if (category == null) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }
        res.render('category_form', { title: `Update ${category.name} category`, category: category});
    })
}

exports.category_update_post = [
    body('name', 'Name is required').trim().isLength({min: 1}).escape(),
    body('description', 'Description is required').trim().isLength({min: 1}).escape(),
    (req, res, next) => {
        const newCategory = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        });

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('category_form', {title: `Update ${newCategory.name} category`, category: newCategory, errors: errors.array()});
            return;
        }
        else {
            Category.findByIdAndUpdate(req.params.id, newCategory, function(err, theCategory) {
                if (err) { return next(err); }
                res.redirect(theCategory.url);
            });
        }
    }
];

exports.category_delete_get = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback);
        },
        items: function(callback) {
            Item.find({'category': req.params.id}).exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('category_delete', {title: `Delete ${results.category.name} category`, category: results.category, items: results.items});
    });
}

exports.category_delete_post = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback);
        },
        items: function(callback) {
            Item.find({'category': req.params.id}).exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.items.length) {
            // prompt user to delete these items first
            res.render('category_delete', {title: `Delete ${results.category.name} category`, category: results.category, items: results.items})
        }
        else {
            // no items associated with this category, so we are free to delete it
            Category.findByIdAndRemove(req.params.id, function deleteCategory (err) {
                if (err) { return next(err); }
                res.redirect('/category');
                return;
            });
        }
    });
}