const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  category: String,
  rating: Number,
  // ... other fields
});

module.exports = mongoose.model('Product', productSchema);