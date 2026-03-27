var express = require('express');
var router = express.Router();
let productController = require('../controllers/products');

/* GET - POST - PUT - DELETE /api/v1/products */
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;