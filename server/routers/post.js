var express = require('express');
var router = express.Router();

var post_ctrl = require('../controllers/post');
var image_ctrl = require('../controllers/image');

router.post('/createpost', post_ctrl.create_post);
router.get('/getallpost/:userID', post_ctrl.get_all_post);
router.get('/getownpost/:userID', post_ctrl.get_own_post);
router.delete('/deletepost', post_ctrl.delete_post);
router.post('/addcomment', post_ctrl.add_comment);
router.delete('/deletecomment', post_ctrl.delete_comment);
router.post('/likepost', post_ctrl.like_post);
router.delete('/unlikepost', post_ctrl.unlike_post);
router.post('/uploadimage/:postID', image_ctrl.upload_post_image);

module.exports = router;