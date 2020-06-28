var express = require('express');
var router = express.Router();
const authenticateJWTUser = require('../Middleware/userMiddleWare');
var User = require('../models/signUpModel');

router.post('/addInCart', authenticateJWTUser, async (req, res) => {
  const { userId, productId, productCount } = req.body;
  if (userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { cart: { product: productId, count: productCount } } },
      { new: true }
    ).populate({
      path: 'cart.product',
      modal: 'products',
      populate: {
        path: 'category',
        modal: 'categories',
      },
    });
    if (user) {
      res.send(user.cart);
    }
  } else res.send(null);
});
router.post('/removeFromCart', authenticateJWTUser, async (req, res) => {
  const { userId, productId } = req.body;
  if (userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: { product: productId } } },
      { new: true }
    );
    if (user) {
      res.send(user);
    }
  } else res.send(null);
});
router.get('/getCart/:userId', authenticateJWTUser, async (req, res) => {
  const { userId } = req.params;
  if (userId) {
    const user = await User.findById(userId).populate({
      path: 'cart.product',
      model: 'products',
      populate: {
        path: 'category',
        modal: 'categories',
      },
    });
    if (user) {
      res.send(user.cart);
    }
  } else res.send(null);
});
router.get(
  '/increment/:cartId/:userId',
  authenticateJWTUser,
  async (req, res) => {
    const { cartId, userId } = req.params;
    if (cartId && userId) {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $inc: {
            'cart.$[item].count': 1,
          },
        },
        {
          arrayFilters: [
            {
              'item._id': { $eq: cartId },
            },
          ],
          new: true,
        }
      ).populate({
        path: 'cart.product',
        model: 'products',

        populate: {
          path: 'category',
          modal: 'categories',
        },
      });
      if (user) {
        res.send(user.cart);
      }
    } else res.send(null);
  }
);
router.get(
  '/decrement/:cartId/:userId',
  authenticateJWTUser,
  async (req, res) => {
    const { cartId, userId } = req.params;
    if (cartId && userId) {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $inc: {
            'cart.$[item].count': -1,
          },
        },
        {
          arrayFilters: [
            {
              'item._id': { $eq: cartId },
            },
          ],
          new: true,
        }
      ).populate({
        path: 'cart.product',
        model: 'products',
        populate: {
          path: 'category',
          modal: 'categories',
        },
      });
      if (user) {
        res.send(user.cart);
      }
    } else res.send(null);
  }
);
router.post('/addManyToCart', authenticateJWTUser, async (req, res) => {
  const { cart, userId } = req.body;
  let doc = [];
  if (cart && cart.length) {
    doc = cart.map((product) => {
      return {
        product: product.product._id,
        count: product.count,
      };
    });
  }
  if (userId && doc.length) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { cart: doc } },
      { new: true }
    ).populate({
      path: 'cart.product',
      modal: 'products',
      populate: {
        path: 'category',
        modal: 'categories',
      },
    });
    if (user) {
      res.send(user.cart);
    }
  } else res.send(null);
});
module.exports = router;
