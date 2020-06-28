var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
/* GET home page. */

let Schema = mongoose.Schema;

let findc = mongoose.model('findc', new Schema({}), 'categories');

router.get('/getAllCatagory', function (req, res, next) {
  findc
    .find({})
    .then((doc) => res.send(doc))
    .catch((err) =>
      res.json({
        status: false,
        message: 'something went wrong while fetching',
      })
    );
});
router.get('/getCategoryById/:_id', function (req, res, next) {
  findc
    .findById({ _id: req.params._id })
    .then((doc) => res.send(doc))
    .catch((err) =>
      res.json({
        status: false,
        message: 'ID NOT FOUND',
      })
    );
  //
});

module.exports = router;
