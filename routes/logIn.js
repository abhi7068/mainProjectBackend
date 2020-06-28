var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var accessTokenSecret = 'youraccesstokensecret';
var { check, validationResult } = require('express-validator/check');
var crypto = require('crypto'),
  hmac,
  signature;
var UserModel = require('../models/signUpModel');
router.post(
  '/',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .trim()
      .normalizeEmail()
      .custom((value, { req, loc, path }) => {
        return value;
        // if //user email already exists throw an error
      }),
    check('password')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 chars long')
      .matches(/\d/)
      .withMessage('Password must contain one number')
      .custom((value, { req, loc, path }) => {
        return value;
      }),
  ],
  function (req, res, next) {
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({ status: 'error', message: errors.array() });
    } else {
      var email = req.body.email;
      var password = req.body.password;

      if (email.length > 0 && password.length > 0) {
        hmac = crypto.createHmac('sha1', 'auth secret');
        var encpassword = '';
        if (password) {
          hmac.update(password);
          encpassword = hmac.digest('hex'); //converting password in encrypt form

          var data = {
            email: email,
            password: encpassword,
          };
        }
      } else {
        res.json({
          status: 0,
        });
      }
      UserModel.findOne(data, function (err, user) {
        if (err) {
          res.json({
            status: false,
            message: 'Invalid Username or Password',
          });
        }
        if (!user) {
          res.json({
            status: false,
            message: 'Invalid Username or Password',
          });
        } else {
          const accessToken = jwt.sign(
            { email: user.email, isAdmin: user.isAdmin },
            accessTokenSecret
          );
          res.send({
            status: true,
            isAdmin: user.isAdmin,
            id: user._id,
            cartId: user.cart,
            accessToken,
          });
        }
      });
    }
  }
);

module.exports = router;
