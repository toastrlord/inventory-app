var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/categoryController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/category', categoryController.category_list);

module.exports = router;
