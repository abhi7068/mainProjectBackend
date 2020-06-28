var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const productModel = require('../../models/productmodel');
const categoryModel = require('../../models/categoryModel');
const reviewModel = require('../../models/reviewModel');
const userModel = require('../../models/signUpModel');
/* GET home page. */

let Schema = mongoose.Schema;
let findProducts = mongoose.model('findProducts', new Schema({}), 'products');
router.get('/getAllProducts', function (req, res, next) {
  productModel
    .find({})
    .populate({
      path: 'category',
      model: categoryModel,
    })
    .populate({
      path: 'reviews',
      model: reviewModel,
      populate: {
        path: 'user',
        model: userModel,
      },
    })

    .then((doc) => {
      let filterData = doc.filter((item) => item.disabled === false);
      res.send(filterData);
    })
    .catch((err) =>
      res.json({
        status: false,
        message: 'Something went wrong while fetching',
      })
    );

  //var F = mongoose.model("F", new Schema({}), "tracks");
});
router.get('/getProductById/:_id', function (req, res, next) {
  productModel
    .findOne({ _id: req.params._id })
    .populate({
      path: 'category',
      model: categoryModel,
    })
    .populate({
      path: 'reviews',
      model: reviewModel,
      populate: {
        path: 'user',
        model: userModel,
      },
    })

    // .exec((err, doc) => {
    //   res.send(doc);
    // });
    .then((doc) => res.send(doc))
    .catch((err) => res.json({ status: false, message: 'ID NOT FOUND' }));

  //const User = mongoose.model("User", track, "tracks");
});

router.get('/getProductByCategory/:_id', function (req, res, next) {
  productModel
    .find({ category: req.params._id })
    .populate({
      path: 'category',
      model: categoryModel,
    })
    .populate({
      path: 'reviews',
      model: reviewModel,
      populate: {
        path: 'user',
        model: userModel,
      },
    })

    .exec((err, doc) => {
      let filterData = doc.filter((item) => item.disabled === false);
      res.send(filterData);
    });
});

router.get('/search/:key', function (req, res) {
  productModel
    .find({ product_name: { $regex: req.params.key, $options: 'i' } })
    .populate({ path: 'category', model: categoryModel })
    .then((doc) => {
      let filterData = doc.filter((item) => item.disabled === false);
      res.send(filterData);
    })
    .catch((err) => res.json({ status: false, message: 'ID NOT FOUND' }));

  // .exec((err, doc) => {
  //   let filterData = doc.filter((item) => item.disabled === false);
  //   res.send(filterData);
  // });
});

module.exports = router;
