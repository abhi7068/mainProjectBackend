var express = require('express');
var router = express.Router();
const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productmodel');
const authenticateJWTAdmin = require('../../Middleware/adminMiddleWare');

router.delete('/category/:_id', authenticateJWTAdmin, function (req, res) {
  categoryModel
    .findById({ _id: req.params._id })
    .then(
      (got) =>
        // function (err, got) {
        productModel.updateMany(
          { category: got._id },
          { $unset: { category: 1 } },
          { new: true },
          function (err, doc) {
            if (err) return err;

            got.remove();
            res.json({ status: true, message: 'Item deleted' });
          }
        )
      // }
    )
    .catch((err) => res.json({ status: false, message: 'Id not found' }));
});

module.exports = router;
