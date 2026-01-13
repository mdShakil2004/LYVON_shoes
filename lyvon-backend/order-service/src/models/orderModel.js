const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    size: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    countryCode: String,
    mobileNumber: String
  },
  paymentStatus: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);