const express = require('express');
const router = express.Router();
const picUrl = require('../constants/constants');
const { check, validationResult } = require('express-validator/check');

let crypto = require('crypto'),
  hmac,
  signature;
let UserModel = require('../models/signUpModel');

/* GET home page. */
router.post(
  '/',
  [
    check('name', 'Name cannot be left blank').isLength({ min: 1 }),

    check('password')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 chars long')
      .matches(/\d/)
      .withMessage('Password must contain one number')
      .custom((value, { req, loc, path }) => {
        if (value !== req.body.confirmPassword) {
          // throw error if passwords do not match
          throw new Error("Passwords don't match");
        } else {
          return value;
        }
      }),
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .trim()
      .custom((value, { req, loc, path }) => {
        return new Promise((resolve, reject) => {
          UserModel.findOne({ email: req.body.email }, function (err, user) {
            if (err) {
              reject(new Error('Server Error'));
            }
            if (Boolean(user)) {
              reject(new Error('E-mail already in use'));
            }
            if (value !== req.body.confirmEmail) {
              reject(new Error('E-mail didnt match'));
            }
            resolve(true);
          });
        });
      }),
  ],
  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send(errors.array());
    } else {
      hmac = crypto.createHmac('sha1', 'auth secret');
      let encpassword = '';
      if (req.body.password) {
        hmac.update(req.body.password);
        encpassword = hmac.digest('hex'); //converting password in encrypt form
      }
      const userDetails = {
        name: req.body.name,
        password: encpassword,
        email: req.body.email,
        profilePictrue: picUrl,
        cart: [],
        yoyobalance: 1000,
        isAdmin: false,
        createdAt: Date(Date.now).toString(),
      };

      let finalInsertionToDataBase = new UserModel(userDetails);
      finalInsertionToDataBase
        .save()
        .then((user) => {
          res.json({
            message: 'Data saved successfully.',
            status: 'success',
            id: user._id,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || 'Something wrong while creating the userss.',
          });
        });
    }
  }
);

module.exports = router;
