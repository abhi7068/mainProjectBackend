var express = require('express');
var router = express.Router();
var reviewModel = require('../models/reviewModel');
const productModel = require('../models/productmodel');
const authenticateJWTUser = require('../Middleware/userMiddleWare');
router.post('/', authenticateJWTUser, function (req, res, next) {
  function checkAvailabilityAndUpdate() {
    reviewModel
      .findOneAndUpdate(
        { user: req.body.user, product: req.body.productId },
        { rating: req.body.rating }
      )
      .then((doc) => {
        res.json({
          message: ' rating is successfully updated',
          status: 'success',
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Something wrong while updating the comment.',
        });
      });
  }
  function newUserGivingReview() {
    let review = new reviewModel({
      rating: req.body.rating,
      comment: '',
      user: req.body.user,
      product: req.body.productId,
    });
    review
      .save()
      .then((result) => {
        pushReview(result._id);
        res.json({ success: true, result: result });
      })
      .catch((err) => {
        res.json({ success: false, result: err });
      });
  }
  function pushReview(id) {
    productModel
      .findByIdAndUpdate(
        { _id: req.body.productId },
        { $push: { reviews: id } }
      )
      .then((user) => {
        res.json({
          message: 'Data pushed successfully.',
          status: 'success',
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            'Something wrong while pushing reting to the product.',
        });
      });
  }
  reviewModel
    .findOne({ user: req.body.user, product: req.body.productId })
    .then((doc) => {
      if (doc === null) {
        newUserGivingReview();
      } else {
        checkAvailabilityAndUpdate();
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Something wrong while creating the userss.',
      });
    });
});
module.exports = router;
