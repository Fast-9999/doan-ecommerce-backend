var express = require('express');
var router = express.Router();
let inventoryModel = require('../schemas/inventories')

// 1. Xem tất cả kho
router.get('/', async function (req, res) {
    try {
        let inventories = await inventoryModel.find({}).populate({
            path: 'product',
            select: 'title price'
        });
        res.send(inventories);
    } catch (error) {
        res.status(500).send({ message: "Lỗi Server", error: error.message });
    }
});

// 2. Nạp thêm hàng vào kho (+)
router.post('/increase-stock', async function (req, res) {
    try {
        let { product, quantity } = req.body;
        let getProduct = await inventoryModel.findOne({ product: product });
        
        if (getProduct) {
            getProduct.stock += quantity;
            await getProduct.save();
            res.send(getProduct);
        } else {
            res.status(404).send({ message: "Không tìm thấy sản phẩm trong kho" });
        }
    } catch (error) {
        res.status(500).send({ message: "Lỗi Server", error: error.message });
    }
});

// 3. Trừ hàng trong kho khi có đơn (-)
router.post('/decrease-stock', async function (req, res) {
    try {
        let { product, quantity } = req.body;
        let getProduct = await inventoryModel.findOne({ product: product });
        
        if (getProduct) {
            // Kiểm tra xem kho còn đủ hàng để bán không
            if (getProduct.stock >= quantity) {
                getProduct.stock -= quantity;
                await getProduct.save();
                res.send(getProduct);
            } else {
                res.status(400).send({ message: "Sản phẩm không đủ số lượng trong kho" }); // Lỗi logic thì xài 400 chuẩn hơn 404 nha
            }
        } else {
            res.status(404).send({ message: "Không tìm thấy sản phẩm trong kho" });
        }
    } catch (error) {
        res.status(500).send({ message: "Lỗi Server", error: error.message });
    }
});

module.exports = router;