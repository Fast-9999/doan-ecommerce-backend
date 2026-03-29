const ReviewModel = require('../schemas/review'); // Đường dẫn trỏ tới schema của ông

module.exports = {
  // 1. API: Khách hàng gửi đánh giá mới
  createReview: async (req, res) => {
    try {
      const { product, rating, comment } = req.body;

      // Giả sử ông có truyền lên ID của user qua header hoặc token, 
      // ở đây tui lấy từ req.user (nếu middleware auth đã xử lý) hoặc ép từ body
      const userId = req.user ? req.user.id : req.body.user;

      if (!userId) {
        return res.status(401).json({ success: false, message: "Bạn phải đăng nhập để đánh giá!" });
      }

      // Tạo đánh giá mới
      const newReview = new ReviewModel({
        user: userId,
        product,
        rating,
        comment
      });

      const savedReview = await newReview.save();

      res.status(201).json({
        success: true,
        message: "Cảm ơn Chủ Tịch đã đánh giá!",
        review: savedReview
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Lỗi server khi gửi đánh giá" });
    }
  },

  // 2. API: Lấy tất cả đánh giá của 1 sản phẩm cụ thể
  getProductReviews: async (req, res) => {
    try {
      const productId = req.params.productId;

      // Tìm tất cả review có productId trùng khớp, móc luôn thông tin user (tên, avatar) để FE show lên
      const reviews = await ReviewModel.find({ product: productId })
        .populate('user', 'username email avatarUrl') // Lấy tên và avatar của người đánh giá
        .sort({ createdAt: -1 }); // Mới nhất lên đầu

      res.status(200).json({
        success: true,
        count: reviews.length,
        reviews: reviews
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Lỗi server khi lấy đánh giá" });
    }
  }
};