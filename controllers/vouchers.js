const VoucherModel = require('../schemas/vouchers'); // 🚀 Đã đổi thành có S cho chuẩn xác

module.exports = {
    // [THÊM MỚI] Admin lấy danh sách toàn bộ mã giảm giá
    getAllVouchers: async (req, res) => {
        try {
            // Tìm hết trong DB, sắp xếp cái nào mới tạo lên đầu
            const vouchers = await VoucherModel.find().sort({ createdAt: -1 });
            res.status(200).json({ success: true, data: vouchers });
        } catch (error) {
            console.error("Lỗi lấy danh sách voucher:", error);
            res.status(500).json({ success: false, message: "Lỗi server khi lôi sổ xách" });
        }
    },

    // 1. Khách hàng kiểm tra mã giảm giá (Đã độ lại chuẩn Schema mới)
    applyVoucher: async (req, res) => {
        try {
            // Yêu cầu Frontend gửi thêm tổng tiền giỏ hàng (cartTotal) lên để check
            const { code, cartTotal } = req.body;

            if (!code) {
                return res.status(400).json({ success: false, message: "Chưa nhập mã mà đòi giảm giá hả ní?" });
            }

            const voucher = await VoucherModel.findOne({
                code: code.toUpperCase(),
                isActive: true
            });

            if (!voucher) {
                return res.status(404).json({ success: false, message: "Mã này dỏm hoặc không tồn tại!" });
            }

            // Check 1: Mã hết hạn chưa?
            if (new Date() > new Date(voucher.expirationDate)) {
                return res.status(400).json({ success: false, message: "Huhu, mã này hết hạn mất rồi Chủ Tịch ơi!" });
            }

            // Check 2: Mã còn lượt dùng không?
            if (voucher.usedCount >= voucher.usageLimit) {
                return res.status(400).json({ success: false, message: "Mã này đã bị người khác giành xài hết lượt rồi!" });
            }

            // Check 3: Đơn hàng có đủ tiền tối thiểu không?
            if (cartTotal !== undefined && cartTotal < voucher.minOrderValue) {
                return res.status(400).json({ success: false, message: `Áp mã thất bại! Đơn hàng phải từ ${voucher.minOrderValue.toLocaleString('vi-VN')} VNĐ.` });
            }

            // Trả về đúng dữ liệu chuẩn mới (Type và Value)
            res.status(200).json({
                success: true,
                message: "Áp dụng mã thành công! Đã giảm giá.",
                discountType: voucher.discountType,
                discountValue: voucher.discountValue
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Lỗi server khi check mã" });
        }
    },

    // 2. Admin tạo mã mới (Đã nâng cấp để hiểu tiếng của Frontend)
    createVoucher: async (req, res) => {
        try {
            // Hốt trọn ổ dữ liệu xịn sò từ Frontend truyền lên
            const { code, discountType, discountValue, minOrderValue, expirationDate, usageLimit } = req.body;

            if (!code || !discountValue || !expirationDate) {
                return res.status(400).json({ success: false, message: "Nhập thiếu thông tin rồi Chủ Tịch ơi!" });
            }

            const newVoucher = await VoucherModel.create({
                code: code.toUpperCase(),
                discountType: discountType || 'percent',
                discountValue: Number(discountValue),
                minOrderValue: Number(minOrderValue) || 0,
                expirationDate: new Date(expirationDate), // Lưu đúng ngày giờ FE chọn
                usageLimit: Number(usageLimit) || 100,
                usedCount: 0, // Mới tạo nên số người dùng = 0
                isActive: true
            });

            res.status(201).json({ success: true, message: "Tạo mã thành công!", voucher: newVoucher });
        } catch (error) {
            console.error("Lỗi tạo mã:", error);
            res.status(500).json({ success: false, message: "Mã này bị trùng hoặc Database chưa cập nhật Schema!", error: error.message });
        }
    }
};