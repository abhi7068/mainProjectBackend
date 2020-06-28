const express = require('express');
const router = express.Router();
const userDetail = require('../../models/signUpModel');
const recieveHistoryModel = require('../../models/recieveHistoryModel');
const sendHistoryModel = require('../../models/sendHistoryModel');
const authenticateJWTUser = require('../../Middleware/userMiddleWare');
const productmodel = require('../../models/productmodel');
//const sendHistoryModel = require('../../models/sendHistoryModel');
const productModel = require('../../models/productmodel');

// router.get('/getAllUserDetails', (req, res) => {
//   userDetail.find((err, doc) => {
//     if (err) throw err;
//     res.status(200).send(doc);
//   });
// });
router.get('/getAllUserDetails', (req, res) => {
  userDetail
    .find()
    .then((doc) => {
      res.send(doc);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Something wrong while retrieving products.',
      });
    });
});

router.get('/getById/:_id', authenticateJWTUser, (req, res) => {
  userDetail
    .findById({ _id: req.params._id })
    .populate({
      path: 'sentHistory',
      model: sendHistoryModel,
      populate: {
        path: 'products.product',
        model: productmodel,
      },
    })
    .populate({
      path: 'receivedHistory',
      model: recieveHistoryModel,
      populate: {
        path: 'products.product',
        model: productmodel,
      },
    })
    // .exec((err, doc) => {
    //   if (err) return handleError(err);
    //   res.send(doc);
    // });
    .then((doc) => {
      if (!doc) {
        return res.status(404).send({
          message: 'User not found with id ' + req.params._id,
        });
      }
      res.send(doc);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: 'user not found with id ' + req.params._id,
        });
      }
      return res.status(500).send({
        message: 'Something wrong retrieving user with id ' + req.params._id,
      });
    });
});

router.put('/updateById/:_id', authenticateJWTUser, (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'userDetail content can not be empty',
    });
  }
  userDetail
    .findByIdAndUpdate(
      { _id: req.params._id },
      {
        name: req.body.name,
        email: req.body.email,
        //password: req.body.password,
        profilePicture: req.body.profilePicture,
        // updatedate: new Date()
        //  yoyobalance: req.body.yoyobalance,
      },
      { new: true }
    )
    .then((userDetail) => {
      if (!userDetail) {
        return res.status(404).send({
          message: 'userDetail not found with id ' + req.params._id,
        });
      }
      res.status(200).send(userDetail);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: 'userDetail not found with id ' + req.params._id,
        });
      }
      return res.status(500).send({
        message:
          'Something wrong updating user details with id ' + req.params._id,
      });
    });
});

router.put('/updateProfilePicture/:id', authenticateJWTUser, (req, res) => {
  userDetail.findById(req.params.id, { new: true }, (err, profilePic) => {
    if (!profilePic) {
      res.status(404).send('user not found');
    } else if (err) {
      res.status(400).send(err);
    } else {
      profilePic.profilePictrue = req.body.urlLink;
      profilePic
        .save()
        .then((updatedPic) => {
          res.status(200).json(updatedPic);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  });
});

// router.put('/updateyoyobalance/:id', authenticateJWTUser, (req, res) => {
//   //
//   userDetail.findById(req.params.id, { new: true }, (err, yoyo) => {
//
//     if (!yoyo) {
//       res.status(404).send('user not found');
//     } else if (err) {
//       res.status(400).send(err);
//     } else {
//       yoyo.yoyobalance = req.body.balance;
//       yoyo
//         .save()
//         .then((updatedbalance) => {
//           res.status(200).json(updatedbalance);
//         })
//         .catch((err) => {
//           res.send(err);
//         });
//     }
//   });
// });

// router.put('/updateyoyobalance/:_id', authenticateJWTUser, (req, res) => {
//   userDetail.findByIdAndUpdate(
//     { _id: req.params._id },
//     {
//       yoyobalance: req.body.yoyobalance,
//     },

//     function (err, doc) {
//       res.send('im updated');
//     }
//   );
// });

router.put('/updateyoyobalance/:_id', authenticateJWTUser, (req, res) => {
  userDetail.findByIdAndUpdate(
    { _id: req.params._id },
    {
      yoyobalance: req.body.yoyobalance,
    },

    function (err, doc) {
      if (!doc) {
        res.status(404).send('not found');
      } else if (err) {
        res.status(400).send('not updated');
      } else {
        res.send('im updated');
      }
    }
  );
});

router.put('/updateName/:_id', authenticateJWTUser, (req, res) => {
  console.log('imcalled', req.params._id, req.body);

  userDetail
    .findByIdAndUpdate(
      { _id: req.params._id },
      {
        name: req.body.name,
      },
      { new: true }
    )
    .then((doc) => res.send(doc))
    .catch((err) => res.json({ status: false, message: 'ID NOT FOUND' }));
});
module.exports = router;
