const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const updateSchema = new Schema({
  disabled: { type: Boolean },
  product_name: String,
  description: String,
  price: Number,
  discount: Number,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'review',
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
  },
  //created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true },
});

module.exports = mongoose.model('uproducts', updateSchema, 'products');
