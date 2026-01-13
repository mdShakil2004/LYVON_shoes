const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: String,
  items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } }]
});

module.exports = mongoose.model('Order', orderSchema);