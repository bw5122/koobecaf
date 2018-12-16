var express = require('express');
var router = express.Router();

var search_ctrl = require('../controllers/search');

/* can search for an users or events */
router.get('/searchuser/:name', search_ctrl.search_user);
router.get('/searchevent/:name', search_ctrl.search_post);
module.exports = router;