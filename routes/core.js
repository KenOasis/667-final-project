const express = require('express');
const router = express.Router()

const gameInitialController = require('../controllers/core/gameInitial');

router.get('/create_game', gameInitialController.initialGame);
router.get('/create_gu', gameInitialController.initialGameUsers);
router.get('/test_gc', gameInitialController.testGameCards);
exports.routes = router;
