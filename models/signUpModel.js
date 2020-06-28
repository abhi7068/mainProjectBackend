const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Schema For Campus Mind
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profilePictrue: String,
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
      },
      count: { type: Number, default: 1, min: 1 },
    },
  ],
  yoyobalance: Number,
  isAdmin: Boolean,
  sentHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'sendHistory' }],
  receivedHistory: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'receiveHistory' },
  ],
  createdAt: Date,
});
const UserModel = new mongoose.model('user', UserSchema);
module.exports = UserModel;
