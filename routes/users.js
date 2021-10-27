const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');


router.post('/signup', userController.signUp)
router.post('/login', userController.login)

// router.post('/signup', userController.signUp);
// router.post('/login', userController.LoggedIn);
// router.get('/logout', userController.LoggedOut);
exports.routes = router;