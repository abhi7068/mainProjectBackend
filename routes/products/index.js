var express = require('express');
//var app = express();
var products = express();

var productGetRouter = require('./getRouter');
var productPostRouter = require('./postRouter');
var productPutRouter = require('./putRouter');
var productDeleteRouter = require('./deleteRouter');

products.use('/find', productGetRouter);
products.use('/gifts', productPostRouter);
products.use('/change', productPutRouter);
products.use('/delete', productDeleteRouter);

module.exports = products;
