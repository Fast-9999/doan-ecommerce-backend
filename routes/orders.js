var express = require('express');
var router = express.Router();
let orderController = require('../controllers/orders');

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;