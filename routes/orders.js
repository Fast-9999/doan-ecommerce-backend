var express = require('express');
var router = express.Router();
let orderController = require('../controllers/orders');

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id/status', orderController.updateOrderStatus);

// MỚI THÊM: Khai báo API để nhận lệnh Xóa
router.delete('/:id', orderController.deleteOrder);

module.exports = router;