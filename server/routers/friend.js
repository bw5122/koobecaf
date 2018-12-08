var express = require('express');
var router = express.Router();

var friend_ctrl = require('../controllers/relation');

router.get('/getfriend/:userID', friend_ctrl.get_friend);
router.post('/sendfriendrequest', friend_ctrl.send_friend_request);
router.get('/getfriendrequest/:userID', friend_ctrl.get_friend_request);
router.post('/acceptfriend', friend_ctrl.add_friend);
module.exports = router;