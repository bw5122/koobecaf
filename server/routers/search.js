var express = require('express');
var router = express.Router();

var search_ctrl = require('../controllers/search');


router.get('/searchuser/:name', search_ctrl.search_user);
module.exports = router;