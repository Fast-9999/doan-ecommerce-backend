var express = require("express");
var router = express.Router();
let upload = require('../utils/uploadHandler')
let path = require('path')

router.post('/single', upload.single('file'), function (req, res, next) {
    if (!req.file) {
        res.status(404).send({
            message: "file upload rong"
        })
    } else {
        res.send(req.file.path)
    }
})
router.post('/multiple', upload.array('files'), function (req, res, next) {
    if (!req.files) {
        res.status(404).send({
            message: "file upload rong"
        })
    } else {
        let data = req.body;
        console.log(data);
        let result = req.files.map(f=>{
            return {
                filename: f.filename,
                path:f.path,
                size:f.size
            }
        })
        res.send(result)
    }
})
router.get('/:filename', function (req, res, next) {
    let fileName = req.params.filename;
    let pathFile = path.join(__dirname,'../uploads',fileName)
    res.sendFile(pathFile)

})


module.exports = router;