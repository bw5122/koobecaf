var express = require('express');
var router = express.Router();

var search_ctrl = require('../controllers/search');


router.get('/searchfriend/:userID', search_ctrl.get_notice);
module.exports = router;