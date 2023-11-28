const express = require('express');
const protect = require('../middleware/authMiddleware');
const router = express.Router();
const {accessChat,fecthChats,createGrouptChat,renameGroup,addToGroup, removeFromGroup} = require('../controlers/chatControler')

router.route('/').post(protect,accessChat);
router.route('/').get(protect,fecthChats);
router.route('/group').post(protect,createGrouptChat );
router.route('/rename').put(protect,renameGroup);
router.route('/groupremove').put(protect, removeFromGroup)
router.route('/groupadd').put(protect,addToGroup);








module.exports = router;