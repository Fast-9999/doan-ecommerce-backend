const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/vouchers');

// POST: /api/v1/vouchers/apply (Khách nhập mã)
router.post('/apply', voucherController.applyVoucher);

// POST: /api/v1/vouchers (Admin tạo mã mới)
router.post('/', voucherController.createVoucher);

module.exports = router;