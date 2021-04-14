#! /usr/bin/env node

console.log('This script populates the database with some simple items and categories');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item');
var Category = require('./models/category');


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
console.log(mongoDB);
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = [];
var categories = [];

function itemCreate(name, category, price, number_in_stock, cb) {
  var itemDetail = {name, category, price, number_in_stock}
  
  var item = new Item(itemDetail);
       
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}

function categoryCreate(name, description, cb) {
  var categoryDetail = {name, description}
    
  var category = new Category(categoryDetail);    
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}


function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Hardware', 'Stuff to put stuff together', callback);
        },
        function(callback) {
          categoryCreate('Tools', 'Things to help you put the hardware in', callback);
        },
        function(callback) {
          categoryCreate('Snacks', 'Stuff to munch on', callback);
        },
        ],
        // optional callback
        cb);
}


function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Screw', categories[0], 2.50, 3, callback);
        },
        function(callback) {
          itemCreate('Nail', categories[0], 0.75, 12, callback);
        },
        function(callback) {
          itemCreate('Washer', categories[0], 0.97, 20, callback);
        },
        function(callback) {
          itemCreate('Screwdriver', categories[1], 5.25, 0, callback);
        },
        function(callback) {
          itemCreate('Hammer', categories[1], 4.50, 12, callback);
        },
        function(callback) {
          itemCreate('Chips', categories[2], 1.50, 25, callback);
        }
        ],
        // optional callback
        cb);
}


async.series([
    createCategories,
    createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('ITEMS: '+items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




