const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sendHistorySchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
      },
      count: Number,
    },
  ],
  redeemedAt: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model(
  'recieveHistory',
  sendHistorySchema,
  'recieveHistory'
);
