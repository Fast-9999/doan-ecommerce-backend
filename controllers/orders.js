let OrderModel = require('../schemas/orders');

module.exports = {
    // 1. [GET] Lấy tất cả đơn hàng (Admin dùng)
    getAllOrders: async (req, res) => {
        try {
            // populate để lấy thông tin user và thông tin product lồng bên trong items
            let orders = await OrderModel.find()
                .populate('user', 'username email') 
                .populate('items.product', 'title price images');
            res.status(200).send({ success: true, data: orders });
        } catch (error) {
            res.status(500).send({ success: false, message: error.message });
        }
    },

    // 2. [GET] Lấy chi tiết 1 đơn hàng
    getOrderById: async (req, res) => {
        try {
            let order = await OrderModel.findById(req.params.id)
                .populate('user', 'username email')
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
            let newOrder = new OrderModel(req.body);
            await newOrder.save();
            res.status(201).send({ success: true, message: "Đặt hàng thành công", data: newOrder });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    },

    // 4. [PUT] Cập nhật trạng thái đơn hàng (Dành cho Admin duyệt đơn)
    updateOrderStatus: async (req, res) => {
        try {
            // Chỉ cho phép update các trường status để tránh lỗi data
            let { orderStatus, paymentStatus } = req.body; 
            let updatedOrder = await OrderModel.findByIdAndUpdate(
                req.params.id, 
                { orderStatus, paymentStatus }, 
                { new: true }
            );
            res.status(200).send({ success: true, message: "Cập nhật trạng thái thành công", data: updatedOrder });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    }
};