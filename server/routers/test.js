var express = require('express');
var router = express.Router();

var test_ctrl = require('../controllers/test');

router.get('/init', test_ctrl.init);
router.get('/wipeout', test_ctrl.wipeout);

///test/init

module.exports = router;