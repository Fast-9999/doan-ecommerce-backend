var express = require('express');
var router = express.Router();
let chatController = require('../controllers/chats');
let { checkLogin } = require('../utils/authHandler'); 
let { uploadImage } = require('../utils/uploadHandler'); 

// 3 cái router ní yêu cầu đây:
router.get('/', checkLogin, chatController.getInbox);
router.post('/', checkLogin, uploadImage.single('file'), chatController.sendMessage);
router.get('/:userID', checkLogin, chatController.getConversation);

module.exports = router;