var express = require('express');
var router = express.Router();
const authenticateJWTUser = require('../Middleware/userMiddleWare');
var User = require('../models/signUpModel');
var sentHistory = require('../models/sendHistoryModel');
var recieveHistory = require('../models/recieveHistoryModel');

router.post('/redeemGift', authenticateJWTUser, async (req, res) => {
  const { couponCode, userId } = req.body;
  if (couponCode) {
    const gift = await sentHistory.findOneAndUpdate(
      { coupon_code: couponCode, isRedeemed: false },
      { isRedeemed: true }
    );
    if (gift) {
      const recieved = await new recieveHistory({
        user_id: gift.user_id,
        products: gift.products,
      }).save();
      if (recieved) {
        const user = await User.findByIdAndUpdate(
          userId,
          {
            $push: { receivedHistory: recieved._id },
          },
          { new: true }
        ).populate({ path: 'recievedHistory', model: 'recieveHistory' });
        if (user) {
          res.send({ success: 'Redeemed Successfully' });
        }
      }
    } else res.status(401).send({ error: 'No Coupon Found' });
  } else res.status(401).send({ error: 'No Coupon Found' });
});

module.exports = router;
