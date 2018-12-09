var express = require('express');
var router = express.Router();

var user_ctrl = require('../controllers/user');
var image_ctrl = require('../controllers/image');

router.post('/login', user_ctrl.login);
router.post('/signup', user_ctrl.sign_up);
router.post('/updateprofile', user_ctrl.update_profile);
router.get('/getprofile/:userID', user_ctrl.get_profile);
router.post('/uploadphoto/:userID', image_ctrl.upload_user_photo);

module.exports = router;