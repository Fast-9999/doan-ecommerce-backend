const Reservation = require('../schemas/reservations');

// 1. [POST] Khách hàng tạo phiếu giữ hàng
const createReservation = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!productId || !quantity || !userId) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin đặt chỗ!" });
        }

        // Setup thời hạn giữ hàng (Ví dụ mặc định giữ trong 24 giờ)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const newReservation = new Reservation({
            user: userId,
            product: productId,
            quantity: quantity,
            status: 'pending', // Trạng thái mặc định là đang chờ
            expiresAt: expiresAt
        });

        await newReservation.save();
        res.status(201).json({ success: true, message: "Giữ hàng thành công!", data: newReservation });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server", error: error.message });
    }
};

// 2. [GET] Khách hàng xem danh sách hàng đã giữ của mình
const getUserReservations = async (req, res) => {
    try {
        const { userId } = req.params;
        // Dùng populate để kéo luôn thông tin chi tiết của sản phẩm ra
        const reservations = await Reservation.find({ user: userId }).populate('product');
        res.status(200).json({ success: true, data: reservations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server", error: error.message });
    }
};

// 3. [GET] Sếp (Admin) xem tất tần tật đơn giữ hàng của cả hệ thống
const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().populate('user').populate('product');
        res.status(200).json({ success: true, data: reservations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server", error: error.message });
    }
};

// 4. [PUT] Hủy phiếu giữ hàng (Khách tự hủy hoặc Sếp hủy)
const cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Tìm đúng phiếu và đổi status thành 'cancelled'
        const reservation = await Reservation.findByIdAndUpdate(
            id,
            { status: 'cancelled' },
            { new: true }
        );

        if (!reservation) {
            return res.status(404).json({ success: false, message: "Không tìm thấy phiếu giữ hàng!" });
        }
        res.status(200).json({ success: true, message: "Đã hủy giữ hàng thành công!", data: reservation });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server", error: error.message });
    }
};

module.exports = {
    createReservation,
    getUserReservations,
    getAllReservations,
    cancelReservation
};