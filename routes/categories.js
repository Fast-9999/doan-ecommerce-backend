var express = require('express');
var router = express.Router();

// Gọi Controller chuyên xử lý logic của Danh mục vào
let categoryController = require('../controllers/categories');

/* Định nghĩa các API chuẩn RESTful cho Categories */
router.get('/', categoryController.getAllCategories);          // Lấy toàn bộ danh mục
router.get('/:id', categoryController.getCategoryById);        // Lấy 1 danh mục theo ID
router.post('/', categoryController.createCategory);           // Thêm danh mục mới
router.put('/:id', categoryController.updateCategory);         // Sửa tên/mô tả danh mục
router.delete('/:id', categoryController.deleteCategory);      // Xóa mềm danh mục

module.exports = router;