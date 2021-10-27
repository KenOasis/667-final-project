const express = require('express');
const router = express.Router();
const homePageController = require('../controllers/home');

router.get('/', homePageController.getHomepage);
router.get('/login', homePageController.login);
router.get('/signup', homePageController.signup);
router.get('/unolobby', homePageController.game_lobby);

exports.routes = router;