const express = require('express');
const router = express.Router();
const gameController = require('../../controllers/core/game-controller');

// For frontend testing
router.get('/game_state', gameController.generateGameState);


router.post('/initial', gameController.initGame); 
exports.routes = router;