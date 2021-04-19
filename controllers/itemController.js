const Item = require('../models/item');
const Category = require('../models/category');
const { body, validationResult } = require('express-validator');
const item = require('../models/item');
const async = require('async');

exports.item_list = function(req, res, next) {
    Item.find({})
    .populate('category')
    .exec(function(err, items) {
        if(err) { return next(err); }
        res.render('item_list', {title: 'Items List', items: items});
    });
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
    Category.find({}).exec(function(err, categories) {
        if (err) { return next(err); }
        res.render('item_form', { title: 'Create new item', categories: categories});
    });
    
}

exports.item_create_post = [
    body('name', 'Name is required').trim().isLength({min: 1}).escape(),
    body('price').trim().isLength({min: 1}).isCurrency().escape(),
    body('number_in_stock').trim().isLength({min: 1}).isInt({min: 0}).withMessage('Please input a non-negative whole number').escape(),
    (req, res, next) => {
        const newItem = new Item({
            name: req.body.name,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            category: req.body.category
        });
        const errors = validationResult(req);

        if (!errors.isEmpty) {
            Category.find({}).exec(function(err, categories) {
                if (err) { return next(err); }
                res.render('item_form', { title: 'Create new item', categories: categories, item: newItem, errors: errors.array()});
            });
        }
        else {
            Item.create(newItem, function(err, theItem) {
                if (err) { return next(err); }
                res.redirect(theItem.url);
            })
        }
    }
];

exports.item_update_get = function(req, res, next) {
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id).populate('category').exec(callback);
        },
        categories: function(callback) {
            Category.find({}).exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('item_form', {title: `Update ${results.item.name}`, item: results.item, categories: results.categories});
    }
    );
}

exports.item_update_post = [
    body('name', 'Name is required').trim().isLength({min: 1}).escape(),
    body('price').trim().isLength({min: 1}).isCurrency({requireSymbol: true, allow_negatives: false}).withMessage('Please enter positive number').escape(),
    body('number_in_stock').trim().isLength({min: 1}).isInt({min: 0}).withMessage('Please input a non-negative whole number').escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        const updatedItem = new Item({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            number_in_stock: req.body.number_in_stock,
            image_filename: req.file ? req.file.filename : '',
            _id: req.params.id
        });
        if (!errors.isEmpty()) {
            Category.find({}).exec(function (err, categories) {
                if (err) { return next(err); }
                res.render('item_form', {title: `Update ${item.name}`, item: updatedItem, categories: categories, errors: errors.array()})
            });
        }
        else {
            Item.findByIdAndUpdate(req.params.id, updatedItem, function(err, theItem) {
                if (err) { return next(err); }
                res.redirect(theItem.url);
            });
        }
    }
];

exports.item_delete_get = function(req, res, next) {
    Item.findById(req.params.id)
    .exec(function(err, item) {
        if (err) { return next(err); }
        res.render('item_delete', {title: `Delete ${item.name}?`, item: item});
    });
    
}

exports.item_delete_post = function(req, res, next) {
    Item.findByIdAndDelete(req.params.id)
    .exec(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}