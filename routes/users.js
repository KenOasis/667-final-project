const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

// router.get('/signup', userController.signUpGet);
router.post('/signup', userController.signUpPost)
router.put('/signup', userController.signUpPut)

exports.routes = router;