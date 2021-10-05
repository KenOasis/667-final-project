const express = require('express');
const router = express.Router();
const testMainController = require('../controllers/test-main');
router.get('/', testMainController.testMain);

exports.routes = router;