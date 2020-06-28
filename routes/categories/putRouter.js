var express = require('express');
var router = express.Router();
var categoryModel = require('../../models/categoryModel');
const authenticateJWTAdmin = require('../../Middleware/adminMiddleWare');

/* GET home page. */
router.put('/category/:_id', authenticateJWTAdmin, (req, res) => {
  categoryModel
    .findByIdAndUpdate(
      { _id: req.params._id },
      {
        title: req.body.title,
      },
      { new: true }
    )
    .then((doc) => res.send(doc))
    .catch((err) => res.json({ status: false, messsage: 'ID NOT FOUND' }));
});

module.exports = router;
