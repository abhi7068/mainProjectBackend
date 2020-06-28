var express = require('express');
var router = express.Router();
var passport = require('passport');
var UserModel = require('../models/signUpModel');
var keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
/* GET Google Authentication API. */
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    function newUserGivingReview() {
      const userDetails = new UserModel({
        name: req.user.name,
        email: req.user.email,
        isAdmin: false,
      });

      userDetails.save((error, user) => {
        if (error) {
          throw error;
        }
        const accessToken = jwt.sign(
          { email: user.email, isAdmin: user.isAdmin },
          accessTokenSecret
        );
        const token = {
          accessToken: accessToken,
          id: user._id,
          isAdmin: user.isAdmin,
          status: true,
          check: 200,
        };

        res.redirect(
          `${keys.REDIRECT_URI}/login?token=${JSON.stringify(token)}`
        );
      });
    }
    function checkAvailabilityAndUpdate() {
      UserModel.findOne(
        { email: req.user.email },

        function (err, user) {
          if (err) {
            throw err;
          }
          const accessToken = jwt.sign(
            { email: user.email, isAdmin: user.isAdmin },
            accessTokenSecret
          );
          const token = {
            accessToken: accessToken,
            id: user._id,
            isAdmin: user.isAdmin,
            status: true,
            check: 200,
          };

          res.redirect(
            `${keys.REDIRECT_URI}/login?token=${JSON.stringify(token)}`
          );
          //
          // res.send('i am updated rating');
        }
      );
    }
    UserModel.findOne({ email: req.user.email }, function (err, doc) {
      if (doc === null) {
        newUserGivingReview();
      } else {
        checkAvailabilityAndUpdate();
      }
    });
  }
);

module.exports = router;
