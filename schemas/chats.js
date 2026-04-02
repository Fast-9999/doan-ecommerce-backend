let mongoose = require('mongoose');

let chatSchema = mongoose.Schema({
    sender: { // Tương đương 'from'
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiver: { // Tương đương 'to'
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    messageContent: {
        type: {
            type: String,
            // 🚀 Thêm 'image' vào danh sách VIP được phép đi qua
            enum: ['text', 'file', 'image'],
            default: 'text'
        },
        text: {
            type: String,
            required: true
        },
        // 🚀 Mở thêm cái cột chứa Link Ảnh cho Backend nó lưu vô
        image: {
            type: String,
            default: null
        }
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('chat', chatSchema);