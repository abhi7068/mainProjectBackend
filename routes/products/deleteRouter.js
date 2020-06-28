var express = require('express');
var router = express.Router();
const updateModel = require('../../models/updateProduct');
const authenticateJWTAdmin = require('../../Middleware/adminMiddleWare');

/* GET home page. */
router.delete('/byId/:_id', authenticateJWTAdmin, function (req, res, next) {
  updateModel
    .findByIdAndUpdate({ _id: req.params._id }, { disabled: true })
    .then((doc) => res.send(doc))
    .catch((err) => res.json({ status: false, message: 'ID NOT FOUND' }));
});

module.exports = router;
