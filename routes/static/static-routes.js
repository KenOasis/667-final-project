const express = require('express');
const router = express.Router();
const staticController = require('../../controllers/static/static-controllers');

router.get('/', staticController.getHomepage);
router.get('/login', staticController.getLogin);
router.get('/signup', staticController.getSignup);
router.get('/lobby', staticController.getLobby);
router.get('/about', staticController.getAbout);
exports.routes = router;