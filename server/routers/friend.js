var express = require('express');
var router = express.Router();

var friend_ctrl = require('../controllers/relation');
var graph_ctrl = require('../controllers/graph');

router.get('/getfriend/:userID', friend_ctrl.get_friend);
router.post('/sendfriendrequest', friend_ctrl.send_friend_request);
router.get('/getfriendrequest/:userID', friend_ctrl.get_friend_request);
router.post('/acceptfriend', friend_ctrl.add_friend);
router.get('/generaterelationgraph', graph_ctrl.generate_graph);
module.exports = router;