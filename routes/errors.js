const express = require('express');
const router = express.Router();
const errorController = require('../controllers/static/errors');

router.use(errorController.Error404);

exports.routes = router;