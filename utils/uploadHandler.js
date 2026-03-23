let multer = require('multer')
let path = require('path')

//storage - luu o dau, luu ten gi
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        let fileName = Date.now() + "-" + Math.round(Math.random() * 1000_000_000) + ext;
        cb(null, fileName)
    }
})
module.exports = multer({
    storage: storage,
    limits: 5 * 1024 * 1024
})

