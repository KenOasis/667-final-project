const express = require('express');
const router = express.Router();
const homePageController = require('../controllers/home');

router.get('/', homePageController.getHomepage);
router.get('/login', homePageController.getLogin);
router.get('/signup', homePageController.getSignup);
router.get('/unolobby', homePageController.getLobby);
exports.routes = router;