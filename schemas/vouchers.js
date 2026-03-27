let mongoose = require('mongoose');

let voucherSchema = mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true,
        uppercase: true // Tự động viết hoa mã Code (VD: TET2026)
    },
    discountPercent: { 
        type: Number, 
        required: true,
        min: 1,
        max: 100
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