let multer = require('multer')

// ĐỔI CHIẾN THUẬT: KHÔNG LƯU Ổ CỨNG NỮA, LƯU TẠM VÔ RAM (MEMORY)
let storage = multer.memoryStorage(); // Vercel rất thích điều này!

let filterImage = function (req, file, cb) {
    if (file.mimetype.includes("image")) {
        cb(null, true)
    } else {
        cb(new Error("file sai dinh dang"), false)
    }
}
let filterExcel = function (req, file, cb) {
    if (file.mimetype.includes("spreadsheetml")) {
        cb(null, true)
    } else {
        cb(new Error("file sai dinh dang"), false)
    }
}
module.exports = {
    uploadImage: multer({
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        fileFilter: filterImage
    }),
    uploadExcel: multer({
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        fileFilter: filterExcel
    })
}

