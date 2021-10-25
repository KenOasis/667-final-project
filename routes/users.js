const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.get('/signup', userController.signUp);

exports.routes = router;