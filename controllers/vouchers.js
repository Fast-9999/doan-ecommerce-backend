const VoucherModel = require('../schemas/vouchers'); // 🚀 Đã đổi thành có S cho chuẩn xác

module.exports = {
    // 1. Khách hàng kiểm tra mã giảm giá
    applyVoucher: async (req, res) => {
        try {
            const { code } = req.body;
            
            if (!code) {
                return res.status(400).json({ success: false, message: "Chưa nhập mã mà đòi giảm giá hả ní?" });
            }

            // Tìm mã trong Database
            const voucher = await VoucherModel.findOne({ 
                code: code.toUpperCase(), 
                isActive: true 
            });

            if (!voucher) {
                return res.status(404).json({ success: false, message: "Mã này dỏm hoặc không tồn tại!" });
            }

            // 🚀 Kiểm tra xem mã đã hết hạn chưa (Dựa vào schema của ông)
            if (new Date() > new Date(voucher.expirationDate)) {
                return res.status(400).json({ success: false, message: "Huhu, mã này hết hạn mất rồi Chủ Tịch ơi!" });
            }

            // Trả về số % được giảm
            res.status(200).json({ 
                success: true, 
                message: "Áp dụng mã thành công! Đã giảm giá.",
                discountPercent: voucher.discountPercent 
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Lỗi server khi check mã" });
        }
    },

    // 2. Admin tạo mã mới 
    createVoucher: async (req, res) => {
        try {
            const { code, discountPercent, expirationDays = 30 } = req.body;
            
            // Tính ngày hết hạn (mặc định 30 ngày sau nếu không truyền lên)
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + expirationDays);

            const newVoucher = await VoucherModel.create({ 
                code, 
                discountPercent,
                expirationDate 
            });

            res.status(201).json({ success: true, message: "Tạo mã thành công!", voucher: newVoucher });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Mã này bị trùng hoặc lỗi rồi" });
        }
    }
};