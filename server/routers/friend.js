var express = require('express');
var router = express.Router();

var friend_ctrl = require('../controllers/relation');
var graph_ctrl = require('../controllers/graph');

router.get('/getfriend/:userID', friend_ctrl.get_friend);
router.post('/sendfriendrequest', friend_ctrl.send_friend_request);
router.get('/getfriendrequest/:userID', friend_ctrl.get_friend_request);
router.post('/acceptfriend', friend_ctrl.add_friend);
router.delete('/denyfriend', friend_ctrl.deny_friend);
router.get('/generaterelationgraph', graph_ctrl.generate_graph);
router.get('/visualizer/center/:userID', graph_ctrl.visualize_center);
router.get('/visualizer/friend/:userID/:friendID', graph_ctrl.visualize_morefriend);
router.get('/visualizer/:userID', graph_ctrl.visualizer);
router.delete('/deletefriend', friend_ctrl.delete_friend);
module.exports = router;