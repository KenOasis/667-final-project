const express = require('express');
const router = express.Router();
const showAllCardsController = require('../controllers/showAllCards');

router.get('/', showAllCardsController.showAllCards);

exports.routes = router;