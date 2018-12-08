var express = require('express');
var router = express.Router();

var test_ctrl = require('../controllers/test');

router.post('/init', test_ctrl.init);
router.post('/wipeout', test_ctrl.wipeout);

///test/init

module.exports = router;
