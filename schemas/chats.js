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
            enum: ['text', 'file'], 
            default: 'text' 
        },
        text: { 
            type: String, 
            required: true 
        } // Nếu type là 'file' thì cái này sẽ lưu đường dẫn link ảnh/file
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('chat', chatSchema);