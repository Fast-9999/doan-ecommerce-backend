let cloudinary = require('cloudinary').v2;

// Cấu hình chìa khoá Cloudinary từ file .env
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

module.exports = {
    // Hàm up 1 ảnh lên mây
    uploadSingleImage: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).send({ message: "Chưa chọn file ảnh" });
            }
            
            // XÀI CHIÊU STREAM ĐỂ BẮN TỪ RAM LÊN CLOUD (KHÔNG QUA Ổ CỨNG)
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: 'doan_ecommerce',
                resource_type: "auto"
            });
            
            // Trả về link URL của ảnh
            res.status(200).send({ 
                success: true, 
                message: "Upload ảnh thành công", 
                url: result.secure_url 
            });
        } catch (error) {
            res.status(500).send({ message: "Lỗi upload ảnh", error: error.message });
        }
    }
};