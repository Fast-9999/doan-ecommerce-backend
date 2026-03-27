var express = require('express');
var router = express.Router();
let cartController = require('../controllers/carts');

// Định nghĩa các API Giỏ hàng (dựa trên ID của User)
router.get('/:userId', cartController.getCartByUser);                    // Lấy giỏ hàng
router.post('/:userId', cartController.addToCart);                       // Thêm hàng vào giỏ
router.delete('/:userId/item/:productId', cartController.removeItemFromCart); // Xoá 1 món khỏi giỏ

module.exports = router;