let modelProduct = require('../schemas/products');
let modelInventory = require('../schemas/inventories');
const { default: mongoose } = require('mongoose');
let slugify = require('slugify');

module.exports = {
    // [GET] Lấy danh sách sản phẩm (có lọc và phân trang của thầy)
    getAllProducts: async function (req, res, next) {
        let data = await modelProduct.find({});
        let queries = req.query;
        let titleQ = queries.title ? queries.title.toLowerCase() : '';
        
        // CẬP NHẬT Ở ĐÂY NÈ NÍ: Đổi 1E4 thành 1E9 (1 tỷ) để không bị mất sản phẩm giá cao
        let maxPrice = queries.maxPrice ? queries.maxPrice : 1E9; 
        
        let minPrice = queries.minPrice ? queries.minPrice : 0;
        let limit = queries.limit ? parseInt(queries.limit) : 5;
        let page = queries.page ? parseInt(queries.page) : 1;
        
        let result = data.filter(function (e) {
            return (!e.isDeleted) && 
                   e.price >= minPrice && 
                   e.price <= maxPrice && 
                   e.title.toLowerCase().includes(titleQ);
        });
        
        result = result.splice(limit * (page - 1), limit);
        res.send(result);
    },

    // [GET] Lấy chi tiết 1 sản phẩm
    getProductById: async function (req, res, next) {
        try {
            let id = req.params.id;
            let result = await modelProduct.findById(id);
            if (result && (!result.isDeleted)) {
                res.send(result);
            } else {
                res.status(404).send({ message: "ID not found" });
            }
        } catch (error) {
            res.status(404).send({ message: "ID not found" });
        }
    },

    // [POST] Thêm mới sản phẩm (Dùng Transaction)
    createProduct: async function (req, res, next) {
        let session = await mongoose.startSession();
        session.startTransaction();
        try {
            let newObj = new modelProduct({
                title: req.body.title,
                // Fix lỗi thiếu SKU (Nếu client ko gửi lên thì tự generate)
                sku: req.body.sku || "SKU-" + Date.now(), 
                slug: slugify(req.body.title, {
                    replacement: '-', remove: undefined,
                    locale: 'vi', trim: true
                }), 
                price: req.body.price,
                description: req.body.description,
                category: req.body.category,
                images: req.body.images
            });
            
            let newProduct = await newObj.save({ session });
            
            let newInv = new modelInventory({
                product: newProduct._id,
                stock: 100
            });
            await newInv.save({ session });
            
            await session.commitTransaction();
            session.endSession();
            res.send(newProduct);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).send({ message: error.message });
        }
    },

    // [PUT] Cập nhật sản phẩm
    updateProduct: async function (req, res, next) {
        let id = req.params.id;
        try {
            let result = await modelProduct.findByIdAndUpdate(
                id, req.body, { new: true }
            );
            res.send(result);
        } catch (error) {
            res.status(404).send({ message: "ID not found" });
        }
    },

    // [DELETE] Xóa mềm sản phẩm
    deleteProduct: async function (req, res, next) {
        let id = req.params.id;
        try {
            let result = await modelProduct.findByIdAndUpdate(
                id, { isDeleted: true }, { new: true }
            );
            res.send(result);
        } catch (error) {
            res.status(404).send({ message: "ID not found" });
        }
    }
};