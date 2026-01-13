const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../../catalog-service/src/middleware/authMiddleware'); // Copy or share

router.get('/personalized', authMiddleware, recommendationController.getPersonalizedRecommendations);

module.exports = router;