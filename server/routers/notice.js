var express = require('express');
var router = express.Router();

var notice_ctrl = require('../controllers/notice');

// router.post('/sendfriendrequest', notice_ctrl.send_friend_request);
// router.get('/getfriendrequest/:userID', notice_ctrl.get_friend_request);
router.get('/getnotice/:userID', notice_ctrl.get_notice);
module.exports = router;