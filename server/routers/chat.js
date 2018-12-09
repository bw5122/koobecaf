var express = require('express');
var router = express.Router();

var chat_ctrl = require('../controllers/chat');
//var message_ctrl = require('../controllers/message');

router.post('/creategroupchat', chat_ctrl.create_group_chat);
router.post('/addmember', chat_ctrl.add_member);
//router.get('/getallgroupchat/:userID', chat_ctrl.get_all_group_chat);
router.get("/gethistory/:chatID", chat_ctrl.get_history);
router.post("/uploadmsg", chat_ctrl.add_message);

module.exports = router;
