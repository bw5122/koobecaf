var express = require('express');
var router = express.Router();

var friend_ctrl = require('../controllers/relation');
var graph_ctrl = require('../controllers/graph');
var recommendation_ctrl = require('../controllers/recommendation');

router.get('/getfriend/:userID', friend_ctrl.get_friend);
router.post('/sendfriendrequest', friend_ctrl.send_friend_request);
router.get('/getfriendrequest/:userID', friend_ctrl.get_friend_request);
router.post('/acceptfriend', friend_ctrl.add_friend);
router.delete('/denyfriend', friend_ctrl.deny_friend);
router.get('/visualizer/center/:userID', graph_ctrl.visualize_center);
router.get('/visualizer/friend/:userID/:friendID', graph_ctrl.visualize_morefriend);
router.get('/visualizer/:userID', graph_ctrl.visualizer);
router.delete('/deletefriend', friend_ctrl.delete_friend);

/* generate a from containing friends, affiliation, interest relations for mapreduce to dynamodb table called graph*/
router.get('/generaterelationgraph', graph_ctrl.generate_graph);
/* export edge information from dyanomo table graph to a csv in S3 for mapreduce */
router.get('/exportcsv', recommendation_ctrl.export_csv);
/* generate recommendation from mapreduce output in S3 and load into the dynamodb table called recommendations */
router.get('/generaterecommendation', recommendation_ctrl.create);
/* get recocommendation for userID by querying table recomomendations  */
router.get('/getrecommendation/:userID', recommendation_ctrl.get_recommendation);

module.exports = router;