const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);
const { vectorizeProduct, cosineSimilarity } = require('../utils/vectorize');

exports.getPersonalizedRecommendations = async (req, res) => {
  const cacheKey = `recs:user:${req.user.userId}`;
  try {
    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    // Get user's past orders
    const orders = await Order.find({ userId: req.user.userId }).populate('items.productId');
    const purchasedIds = new Set();
    const userVectors = [];

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.productId) {
          purchasedIds.add(item.productId._id.toString());
          userVectors.push(vectorizeProduct(item.productId));
        }
      });
    });

    // User profile: average vector
    let userProfile = userVectors.length
      ? userVectors.reduce((acc, vec) => acc.map((v, i) => v + vec[i])).map(v => v / userVectors.length)
      : null;

    // All products
    const allProducts = await Product.find({});

    // Score and sort
    const scored = allProducts
      .filter(p => !purchasedIds.has(p._id.toString()))
      .map(product => ({
        product,
        score: userProfile ? cosineSimilarity(userProfile, vectorizeProduct(product)) : product.rating // Fallback to rating
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(item => item.product);

    // Cache 5min
    await redis.set(cacheKey, JSON.stringify(scored), 'EX', 300);
    res.json(scored);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};