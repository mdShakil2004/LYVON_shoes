const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cacheMiddleware = require('../middleware/cacheMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', cacheMiddleware(60), productController.getProducts);
router.get('/:id', cacheMiddleware(120), productController.getProductById);

// Recommendations
router.get('/recommendations/product/:id', cacheMiddleware(300), productController.getProductRecommendations);
router.get('/recommendations/cart', cacheMiddleware(180), productController.getCartRecommendations);

// Wishlist (protected)
router.get('/wishlist', authMiddleware, cacheMiddleware(60), productController.getWishlist);
router.post('/wishlist/:productId', authMiddleware, productController.addToWishlist);
router.delete('/wishlist/:productId', authMiddleware, productController.removeFromWishlist);

module.exports = router;