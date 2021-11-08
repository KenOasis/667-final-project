const express = require('express');
const router = express.Router();
const staticController = require('../../controllers/static/static-controllers');

router.get('/', staticController.getHomepage);
router.get('/login', staticController.getLogin);
router.get('/signup', staticController.getSignup);
router.get('/about', staticController.getAbout);
router.get('/transition', staticController.getTransition);
exports.routes = router;