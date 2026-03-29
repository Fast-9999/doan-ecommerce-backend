var express = require('express');
var router = express.Router();
let orderController = require('../controllers/orders');

// 1. Lấy tất cả đơn hàng (Dành cho trang Admin)
router.get('/', orderController.getAllOrders);

// 🚀 THÊM MỚI TẠI ĐÂY: Lấy đơn hàng theo ID của User (Dành cho trang Lịch Sử)
// Lưu ý: Dòng này PHẢI đặt ngay đây, TRƯỚC dòng /:id để tránh bị nhận diện nhầm!
router.get('/user/:userId', orderController.getOrdersByUser);

// 2. Lấy chi tiết 1 đơn hàng
router.get('/:id', orderController.getOrderById);

// 3. Tạo đơn hàng mới
router.post('/', orderController.createOrder);

// 4. Cập nhật trạng thái đơn hàng (Dành cho Admin duyệt đơn)
router.put('/:id/status', orderController.updateOrderStatus);

// 5. MỚI THÊM: Khai báo API để nhận lệnh Xóa
router.delete('/:id', orderController.deleteOrder);

module.exports = router;