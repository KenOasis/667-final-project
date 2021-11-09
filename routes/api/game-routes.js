const express = require('express');
const router = express.Router();
const gameController = require('../../controllers/core/game-controller');

router.get('/game_state', gameController.generateGameState);
exports.routes = router;