const Product = require('../models/productModel');
const Wishlist = require('../models/wishlistModel');

exports.getProducts = async (req, res) => { /* existing code */ };

exports.getProductById = async (req, res) => { /* existing code */ };

// NEW: Product-based recommendations
exports.getProductRecommendations = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const recommendations = await Product.find({
      _id: { $ne: req.params.id },
      $or: [
        { category: product.category },
        { brand: product.brand }
      ]
    })
      .sort({ rating: -1, reviews: -1 })
      .limit(8);

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NEW: Cart-based recommendations
exports.getCartRecommendations = async (req, res) => {
  try {
    const { productIds } = req.query; // Comma-separated IDs from frontend cart
    if (!productIds) return res.json([]);

    const ids = productIds.split(',');

    const cartProducts = await Product.find({ _id: { $in: ids } });
    const categories = [...new Set(cartProducts.map(p => p.category))];
    const brands = [...new Set(cartProducts.map(p => p.brand))];

    const recommendations = await Product.find({
      _id: { $nin: ids },
      $or: [
        { category: { $in: categories } },
        { brand: { $in: brands } }
      ]
    })
      .sort({ rating: -1, reviews: -1 })
      .limit(8);

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Wishlist CRUD
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.userId }).populate('productIds');
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.userId, productIds: [] });
    }
    res.json(wishlist.productIds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: req.user.userId },
      { $addToSet: { productIds: req.params.productId } },
      { upsert: true, new: true }
    ).populate('productIds');
    res.json(wishlist.productIds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: req.user.userId },
      { $pull: { productIds: req.params.productId } },
      { new: true }
    ).populate('productIds');
    res.json(wishlist ? wishlist.productIds : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};