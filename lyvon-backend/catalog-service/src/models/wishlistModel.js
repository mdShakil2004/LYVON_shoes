const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('Wishlist', wishlistSchema);