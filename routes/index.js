var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/categoryController');
var itemController = require('../controllers/itemController');
const async = require('async');
const Item = require('../models/item');
const Category = require('../models/category');
const multer = require('multer');
const upload = multer({dest: './images', limits: { fileSize: 200000}}); // check units, want to limit to 200kb

/* GET home page. */
router.get('/', function(req, res, next) {
  async.parallel({
      items: function(callback) {
        Item.find({}).sort([['name', 'ascending']]).exec(callback);
      },
      categories: function(callback) {
        Category.find({}).sort([['name', 'ascending']]).exec(callback);
      }
    }, function(err, results) {
    if (err) { return next(err); }
    res.render('index', { title: 'Homepage', categories: results.categories, items: results.items});
  });
});


// category routes

router.get('/category', categoryController.category_list);

router.get('/category/create', categoryController.category_create_get);

router.post('/category/create', categoryController.category_create_post);

router.get('/category/:id', categoryController.category_detail);

router.get('/category/:id/update', categoryController.category_update_get);

router.post('/category/:id/update', categoryController.category_update_post);

router.get('/category/:id/delete', categoryController.category_delete_get);

router.post('/category/:id/delete', categoryController.category_delete_post);

// item routes

router.get('/item', itemController.item_list);

router.get('/item/create', itemController.item_create_get);

router.post('/item/create', upload.single('image-file'), itemController.item_create_post);

router.get('/item/:id', itemController.item_detail);

router.get('/item/:id/update', itemController.item_update_get);

router.post('/item/:id/update', upload.single('image-file'), itemController.item_update_post);

router.get('/item/:id/delete', itemController.item_delete_get);

router.post('/item/:id/delete', itemController.item_delete_post);

module.exports = router;
