var express = require('express');
var router = express.Router();

var post_ctrl = require('../controllers/post');
var image_ctrl = require('../controllers/image');
var comment_ctrl = require('../controllers/comment');

router.post('/createpost', post_ctrl.create_post);
router.get('/getonepost/:postID', post_ctrl.get_one_post);
router.get('/getallpost/:userID', post_ctrl.get_all_post);
router.get('/getownpost/:userID', post_ctrl.get_own_post);
router.post('/addcomment', comment_ctrl.add_comment);
router.delete('/deletecomment', comment_ctrl.delete_comment);
router.post('/uploadimage/:postID', image_ctrl.upload_post_image);

module.exports = router;