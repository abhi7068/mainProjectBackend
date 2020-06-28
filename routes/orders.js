var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const sendHistoryModel = require('../models/sendHistoryModel');
const userModel = require('../models/signUpModel');
router.post('/sendHistory', function (req, res, next) {
  userModel.findById({ _id: req.body.userId }, function (err, user) {
    const carts = user.cart;
    makesent(carts);
  });
  function pushsend(id) {
    userModel.findByIdAndUpdate(
      { _id: req.body.userId },
      {
        $push: { sentHistory: id },
        $set: { cart: [], yoyobalance: Number(req.body.balance) },
      },
      function (err, doc) {}
    );
    sendMail(id);
  }
  function makesent(cart) {
    let sendHistory = new sendHistoryModel({
      user_id: req.body.userId,
      products: cart,
      coupon_code: 'YOYO' + Math.floor(Math.random() * 100000),
    });

    sendHistory
      .save()
      .then((result) => {
        pushsend(result._id);
        res.json({ success: true, result: result });
      })
      .catch((err) => {
        res.json({ success: false, result: err });
      });
  }
  function sendMail(id) {
    sendHistoryModel.findById({ _id: id }, function (err, history) {
      const coupon = history.coupon_code;
      sendEmail(coupon);
    });
  }
  function sendEmail(code) {
    let mailTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'giftyoyo008@gmail.com',
        pass: 'Admin@123',
      },
    });

    let mailDetails = {
      from: 'giftyoyo008@gmail.com',
      to: req.body.mailId,
      subject: 'Test mail',
      //text: 'redeem your gift',
      html: 'redeem your coupon code ' + code,
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({ success: true });
      }
    });
  }

  // sendHistory
  //   .save()
  //   .then((result) => {
  //     res.json({ success: true, result: result });
  //   })
  //   .catch((err) => {
  //     res.json({ success: false, result: err });
  //   });
});

module.exports = router;
