const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviews');

// Route 1: Lấy danh sách đánh giá của 1 sản phẩm (Truyền ID sản phẩm lên URL)
router.get('/product/:productId', reviewController.getProductReviews);

// Route 2: Đăng đánh giá mới (Gửi data qua Body)
router.post('/', reviewController.createReview);

module.exports = router;