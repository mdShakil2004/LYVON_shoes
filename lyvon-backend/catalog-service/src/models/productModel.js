const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  sizes: [String],
  image: String,
  description: String,
    category: String,
    stock: Number,
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
        },
    ],
    Saved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: { type: Number, default: 0 },
    images360: [String],
  isPremium: { type: Boolean, default: false },
  sizeStock: { type: Map, of: Number } // e.g., { "9": 10, "10": 5 }





});

module.exports = mongoose.model('Product', productSchema);

