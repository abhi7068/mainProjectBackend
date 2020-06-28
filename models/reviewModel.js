const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
  rating: Number,
  comment: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
  },

  created_at: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model('review', reviewSchema, 'review');
