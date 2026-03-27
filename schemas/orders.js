let mongoose = require('mongoose');

let orderSchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', // Trỏ tới bảng users
        required: true 
    },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }
    }],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'Online'],
        default: 'COD'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    orderStatus: {
        type: String,
        enum: ['Processing', 'Shipping', 'Delivered', 'Cancelled'],
        default: 'Processing'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('order', orderSchema);