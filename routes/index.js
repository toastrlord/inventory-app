var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/categoryController');
var itemController = require('../controllers/itemController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Homepage' });
});


// category routes

router.get('/category', categoryController.category_list);

router.get('/category/:id', categoryController.category_detail);

// item routes

router.get('/item/:id', itemController.item_detail);

module.exports = router;
