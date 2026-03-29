let OrderModel = require('../schemas/orders');

module.exports = {
    // 1. [GET] Lấy tất cả đơn hàng
    getAllOrders: async (req, res) => {
        try {
            // 🚀 ĐỘ LẠI: Lấy thêm thông tin user nhưng giữ nguyên ID để Frontend dễ lọc
            let orders = await OrderModel.find()
                .populate('user', 'username email name') 
                .populate('items.product', 'title price images')
                .populate('orderItems.product', 'title price images') // Populate luôn cả tên này cho chắc
                .sort({ createdAt: -1 }); // Sắp xếp mới nhất lên đầu ngay từ Backend luôn

            res.status(200).send({ success: true, data: orders });
        } catch (error) {
            res.status(500).send({ success: false, message: error.message });
        }
    },

    // 2. [GET] Lấy chi tiết 1 đơn hàng
    getOrderById: async (req, res) => {
        try {
            let order = await OrderModel.findById(req.params.id)
                .populate('user', 'username email name')
                .populate('items.product', 'title price images');
            
            if (!order) return res.status(404).send({ message: "Không tìm thấy đơn hàng" });
            res.status(200).send({ success: true, data: order });
        } catch (error) {
            res.status(500).send({ success: false, message: error.message });
        }
    },

    // 3. [POST] Tạo đơn hàng mới
    createOrder: async (req, res) => {
        try {
            // 🚀 ĐỘ LẠI: Ép kiểu dữ liệu đồng bộ
            let orderData = req.body;
            
            // Nếu Frontend gửi totalPrice mà Schema cần totalAmount (hoặc ngược lại)
            if (orderData.totalPrice && !orderData.totalAmount) {
                orderData.totalAmount = orderData.totalPrice;
            }

            let newOrder = new OrderModel(orderData);
            await newOrder.save();
            res.status(201).send({ success: true, message: "Đặt hàng thành công", data: newOrder });
        } catch (error) {
            console.error("Lỗi tạo đơn:", error);
            res.status(400).send({ success: false, message: error.message });
        }
    },

    // 4. [PUT] Cập nhật trạng thái đơn hàng (Dành cho Admin)
    updateOrderStatus: async (req, res) => {
        try {
            // 🚀 ĐỘ LẠI: Hỗ trợ update linh hoạt cả status lẫn orderStatus
            let { orderStatus, status, paymentStatus } = req.body; 
            
            let updatedOrder = await OrderModel.findByIdAndUpdate(
                req.params.id, 
                { 
                    orderStatus: orderStatus || status, 
                    status: status || orderStatus,
                    paymentStatus 
                }, 
                { new: true }
            );
            res.status(200).send({ success: true, message: "Cập nhật trạng thái thành công", data: updatedOrder });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    },

    // 5. [DELETE] Xóa đơn hàng
    deleteOrder: async (req, res) => {
        try {
            let deletedOrder = await OrderModel.findByIdAndDelete(req.params.id);
            if (!deletedOrder) {
                return res.status(404).send({ success: false, message: "Không tìm thấy đơn hàng để xóa" });
            }
            res.status(200).send({ success: true, message: "Đã xóa đơn hàng thành công!" });
        } catch (error) {
            res.status(500).send({ success: false, message: error.message });
        }
    }
};