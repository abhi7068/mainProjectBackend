var express = require('express');
var router = express.Router();
const authenticateJWTAdmin = require('../../Middleware/adminMiddleWare');
const updateModel = require('../../models/updateProduct');

// mongoose.connect("mongodb://localhost/yoyoGift", { useNewUrlParser: true });
// var db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function() {
//
// });
/* GET home page. */

router.put('/product/:_id', authenticateJWTAdmin, (req, res) => {
  updateModel
    .findByIdAndUpdate(
      { _id: req.params._id },
      {
        product_name: req.body.product_name,
        description: req.body.description,
        price: req.body.price,
        discount: req.body.discount,
        category: req.body.category,
        updated_at: new Date(),
        //	updated_at: Date.now
      },
      { new: true }
    )
    .then((doc) => res.send(doc))
    .catch((err) => res.json({ status: false, message: 'ID NOT FOUND' }));
});

module.exports = router;
