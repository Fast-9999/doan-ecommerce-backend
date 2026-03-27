// Gọi đúng cái tên file cart.js của thầy nha
let CartModel = require('../schemas/cart'); 

module.exports = {
    // 1. [GET] Lấy giỏ hàng của 1 User cụ thể
    getCartByUser: async (req, res) => {
        try {
            // Lấy giỏ hàng và populate lôi luôn thông tin sản phẩm ra
            let cart = await CartModel.findOne({ user: req.params.userId })
                .populate('items.product', 'title price images slug');
            
            // Nếu user chưa có giỏ hàng, tự động tạo 1 cái giỏ rỗng cho họ
            if (!cart) {
                cart = await CartModel.create({ user: req.params.userId, items: [] });
            }
            res.status(200).send({ success: true, data: cart });
        } catch (error) {
            res.status(500).send({ success: false, message: error.message });
        }
    },

    // 2. [POST] Thêm sản phẩm vào giỏ hàng
    addToCart: async (req, res) => {
        try {
            let { productId, quantity } = req.body;
            let userId = req.params.userId;
            
            // Tìm giỏ hàng của user
            let cart = await CartModel.findOne({ user: userId });

            if (!cart) {
                // Nếu chưa từng có giỏ hàng -> Tạo giỏ mới và nhét hàng vào
                cart = new CartModel({ 
                    user: userId, 
                    items: [{ product: productId, quantity: quantity || 1 }] 
                });
            } else {
                // Nếu đã có giỏ hàng -> Kiểm tra xem sản phẩm này có trong giỏ chưa
                let itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
                
                if (itemIndex > -1) {
                    // Nếu có rồi -> Cộng dồn số lượng
                    cart.items[itemIndex].quantity += (quantity || 1);
                } else {
                    // Nếu chưa có -> Thêm sản phẩm mới vào mảng items
                    cart.items.push({ product: productId, quantity: quantity || 1 });
                }
            }
            
            await cart.save();
            res.status(200).send({ success: true, message: "Đã cập nhật giỏ hàng", data: cart });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    },

    // 3. [DELETE] Xoá 1 sản phẩm khỏi giỏ hàng
    removeItemFromCart: async (req, res) => {
        try {
            let { userId, productId } = req.params;
            let cart = await CartModel.findOne({ user: userId });
            
            if (cart) {
                // Lọc bỏ cái sản phẩm cần xoá ra khỏi mảng items
                cart.items = cart.items.filter(item => item.product.toString() !== productId);
                await cart.save();
            }
            res.status(200).send({ success: true, message: "Đã xoá sản phẩm khỏi giỏ", data: cart });
        } catch (error) {
            res.status(500).send({ success: false, message: error.message });
        }
    }
};