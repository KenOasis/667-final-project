const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user-controller');
const backendValidator = require('../../middleware/backend-validator');

router.post('/signup', backendValidator.signupValidation, userController.signUp);

router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.post('/change_password', backendValidator.changePWValidation, userController.changePassword);

router.get('/profile', userController.getProfile);
exports.routes = router;