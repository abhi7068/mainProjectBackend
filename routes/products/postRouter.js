var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const productModel = require("../../models/productmodel");
const categoryModel = require("../../models/categoryModel");
const authenticateJWTAdmin=require('../../Middleware/adminMiddleWare')
/* GET home page. */

router.post("/addProducts",authenticateJWTAdmin, function(req, res, next) {
	let products = new productModel({
		product_name: req.body.product_name,
		description: req.body.description,
		price: req.body.price,
		discount: req.body.discount,
		category: req.body.category
	});
	products
		.save()
		.then(result => {
			res.json({ success: true, result: result });
		})
		.catch(err => {
			res.json({ success: false, result: err });
		});
});

module.exports = router;
