let mongoose = require('mongoose');

let reservationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true // Đã bỏ 'unique: true' để khách có thể giữ nhiều món khác nhau
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true // Đưa thẳng product ra ngoài cho khớp với API
    },
    quantity: {
        type: Number,
        min: 1,
        default: 1
    },
    totalAmount: { // Vẫn giữ lại cho Sếp nếu mốt cần tính tiền
        type: Number,
        min: 0
    },
    status: {
        type: String,
        // Bổ sung thêm "pending" vô danh sách từ khóa cho phép
        enum: ["pending", "actived", "expired", "cancelled", "paid"], 
        default: "pending"
    },
    expiresAt: { // Chữ 'e' viết thường để ăn khớp với Controller
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('reservation', reservationSchema);