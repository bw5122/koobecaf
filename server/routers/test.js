var express = require('express');
var router = express.Router();

var test_ctrl = require('../controllers/test');

/* create dummy users for demo and testing */
router.get('/init', test_ctrl.init);
router.get('/wipeout', test_ctrl.wipeout);

module.exports = router;