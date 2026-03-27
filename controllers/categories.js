let CategoryModel = require('../schemas/categories');

module.exports = {
    // 1. [GET] Lấy danh sách danh mục (chưa bị xóa)
    getAllCategories: async (req, res) => {
        try {
            let categories = await CategoryModel.find({ isDeleted: false });
            res.status(200).send({ success: true, data: categories });
        } catch (error) {
            res.status(500).send({ success: false, message: error.message });
        }
    },

    // 2. [GET] Lấy 1 danh mục theo ID
    getCategoryById: async (req, res) => {
        try {
            let category = await CategoryModel.findById(req.params.id);
            if (!category || category.isDeleted) {
                return res.status(404).send({ success: false, message: "Không tìm thấy danh mục" });
            }
            res.status(200).send({ success: true, data: category });
        } catch (error) {
            res.status(500).send({ success: false, message: error.message });
        }
    },

    // 3. [POST] Thêm danh mục mới
    createCategory: async (req, res) => {
        try {
            let newCategory = new CategoryModel(req.body);
            await newCategory.save();
            res.status(201).send({ success: true, message: "Thêm thành công", data: newCategory });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    },

    // 4. [PUT] Cập nhật danh mục
    updateCategory: async (req, res) => {
        try {
            let updatedCategory = await CategoryModel.findByIdAndUpdate(
                req.params.id, req.body, { new: true }
            );
            res.status(200).send({ success: true, message: "Cập nhật thành công", data: updatedCategory });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    },

    // 5. [DELETE] Xóa mềm danh mục
    deleteCategory: async (req, res) => {
        try {
            await CategoryModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
            res.status(200).send({ success: true, message: "Đã xóa danh mục" });
        } catch (error) {
            res.status(500).send({ success: false, message: error.message });
        }
    }
};