const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware')
const {sendMessage,allMessages,deleteMessages} = require('../controlers/messageControler')

router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect,allMessages);
router.route("/deletechats").delete(deleteMessages);


module.exports = router;