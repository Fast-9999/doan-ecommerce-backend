let mongoose = require('mongoose');

let orderSchema = mongoose.Schema({
    // 👤 Thông tin người đặt
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    // 📦 Danh sách sản phẩm (Hỗ trợ cả 2 tên gọi items và orderItems)
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
        name: String,
        title: String,
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
        image: String
    }],
    orderItems: [{ // Dự phòng cho Frontend gọi tên này
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
        name: String,
        title: String,
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
        image: String
    }],

    // 📍 ĐỊA CHỈ GIAO HÀNG (CÁI NÀY QUAN TRỌNG NHẤT NÈ NÍ)
    shippingAddress: {
        fullName: { type: String },
        name: { type: String },
        phone: { type: String },
        address: { type: String },
        city: { type: String, default: 'Hồ Chí Minh' },
        postalCode: { type: String },
        country: { type: String, default: 'Việt Nam' }
    },

    // 💰 TIỀN NONG (Hỗ trợ cả Amount và Price)
    totalAmount: { type: Number, required: true },
    totalPrice: { type: Number },
    itemsPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    taxPrice: { type: Number, default: 0 },

    // 💳 THANH TOÁN
    paymentMethod: {
        type: String,
        enum: ['COD', 'Online'],
        default: 'COD'
    },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    // 🚚 TRẠNG THÁI ĐƠN HÀNG
    orderStatus: {
        type: String,
        enum: ['Processing', 'Shipping', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    status: { type: String }, // Dự phòng cho Frontend gọi ngắn gọn
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date }

}, {
    timestamps: true // Tự động tạo createdAt, updatedAt
});

module.exports = mongoose.model('order', orderSchema);