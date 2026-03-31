const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservations');

// [POST] Khách tạo đơn giữ hàng
router.post('/', reservationController.createReservation);

// [GET] Admin xem toàn bộ danh sách giữ hàng
router.get('/', reservationController.getAllReservations);

// [GET] Khách xem danh sách giữ hàng của riêng mình
router.get('/user/:userId', reservationController.getUserReservations);

// [PUT] Hủy đơn giữ hàng
router.put('/:id/cancel', reservationController.cancelReservation);

module.exports = router;