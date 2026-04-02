let ChatModel = require('../schemas/chats');
let mongoose = require('mongoose');

module.exports = {
    // 1. [GET /:userID] Lấy toàn bộ tin nhắn giữa mình (req.userId) và người kia (req.params.userID)
    getConversation: async (req, res) => {
        try {
            let myId = req.userId; // ID của mình (được middleware checkLogin cấp)
            let otherId = req.params.userID; // ID của người đang chat cùng

            let messages = await ChatModel.find({
                $or: [
                    { sender: myId, receiver: otherId }, // Mình gửi cho họ
                    { sender: otherId, receiver: myId }  // Họ gửi cho mình
                ]
            }).sort({ createdAt: 1 }); // Sắp xếp cũ nhất -> mới nhất để hiển thị từ trên xuống dưới

            res.status(200).send({ success: true, data: messages });
        } catch (error) {
            res.status(500).send({ success: false, message: error.message });
        }
    },

    // 2. [POST /] Gửi tin nhắn (Hỗ trợ cả text và file)
    sendMessage: async (req, res) => {
        try {
            let senderId = req.userId; // Người gửi là mình
            let receiverId = req.body.to; // Lấy ID người nhận từ body gửi lên

            // Xác định xem gửi text hay gửi file
            let msgType = 'text';
            let msgText = req.body.text; // Giả sử ban đầu là text

            // Nếu người dùng có upload file đính kèm (qua middleware multer)
            if (req.file) {
                msgType = 'file';
                msgText = req.file.path; // Lưu đường dẫn file/ảnh vào trường text
            }

            if (!msgText) {
                return res.status(400).send({ success: false, message: "Tin nhắn không được để trống!" });
            }

            let newChat = new ChatModel({
                sender: senderId,
                receiver: receiverId,
                messageContent: {
                    type: msgType,
                    text: msgText
                }
            });

            await newChat.save();
            res.status(201).send({ success: true, data: newChat });
        } catch (error) {
            res.status(500).send({ success: false, message: error.message });
        }
    },

    // 3. [GET /] Lấy tin nhắn cuối cùng của mỗi cuộc hội thoại (Làm danh sách Inbox)
    getInbox: async (req, res) => {
        try {
            let myId = new mongoose.Types.ObjectId(req.userId);

            // Dùng Tuyệt kỹ Aggregation của MongoDB để gom nhóm tin nhắn
            let inbox = await ChatModel.aggregate([
                // Bước 1: Tìm tất cả tin nhắn có dính dáng tới mình (gửi hoặc nhận)
                { $match: { $or: [{ sender: myId }, { receiver: myId }] } },
                // Bước 2: Sắp xếp tin nhắn mới nhất lên đầu
                { $sort: { createdAt: -1 } },
                // Bước 3: Gom nhóm (Group) theo người kia
                {
                    $group: {
                        // Nếu mình là sender, thì gom theo receiver. Ngược lại thì gom theo sender
                        _id: {
                            $cond: [{ $eq: ["$sender", myId] }, "$receiver", "$sender"]
                        },
                        // Lấy nguyên cái tin nhắn đầu tiên (mới nhất) của nhóm đó
                        lastMessage: { $first: "$$ROOT" }
                    }
                },
                // Bước 4: Lookup (JOIN) để lấy thông tin (tên, avatar) của người kia từ bảng users
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                { $unwind: "$userInfo" }, // Gỡ cái mảng userInfo ra
                // Bước 5: Lọc lại dữ liệu cho đẹp trước khi trả về
                {
                    $project: {
                        _id: 0,
                        partnerId: "$_id",
                        partnerName: "$userInfo.username",
                        partnerAvatar: "$userInfo.avatarUrl", // Thêm nếu bảng user có avatar
                        lastMessage: "$lastMessage.messageContent",
                        isRead: "$lastMessage.isRead",
                        createdAt: "$lastMessage.createdAt"
                    }
                },
                // Cuối cùng: Sắp xếp lại danh sách inbox theo thời gian tin nhắn mới nhất
                { $sort: { createdAt: -1 } }
            ]);

            res.status(200).send({ success: true, data: inbox });
        } catch (error) {
            res.status(500).send({ success: false, message: error.message });
        }
    }
};