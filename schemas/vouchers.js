let mongoose = require('mongoose');

let voucherSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true // Tự động viết hoa mã Code (VD: SIEUSALE)
    },
    discountType: {
        type: String,
        enum: ['percent', 'fixed'], // Phân loại giảm % hay giảm thẳng tiền mặt
        default: 'percent'
    },
    discountValue: {
        type: Number,
        required: true,
        min: 1 // Gộp chung cho cả % và tiền mặt, tối thiểu là 1
    },
    minOrderValue: {
        type: Number,
        default: 0 // Đơn hàng tối thiểu (0 là áp dụng mọi đơn)
    },
    usageLimit: {
        type: Number,
        default: 100 // Tổng số lần được xài mã này
    },
    usedCount: {
        type: Number,
        default: 0 // Đếm số người đã xài (để trừ hao với usageLimit)
    },
    expirationDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('voucher', voucherSchema);