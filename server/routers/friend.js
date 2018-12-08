var express = require('express');
var router = express.Router();

var friend_ctrl = require('../controllers/relation');

router.get('/getfriend/:userID', friend_ctrl.get_friend);
module.exports = router;