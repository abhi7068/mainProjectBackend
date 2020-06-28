var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const categoryModel = require('../../models/categoryModel');
const authenticateJWTAdmin = require('../../Middleware/adminMiddleWare');

router.post('/addCategory', authenticateJWTAdmin, function (req, res, next) {
  let category = new categoryModel({
    title: req.body.title,
  });
  category
    .save()
    .then((result) => {
      res.json({ success: true, result: result });
    })
    .catch((err) => {
      res.json({ success: false, result: err });
    });
});

module.exports = router;
