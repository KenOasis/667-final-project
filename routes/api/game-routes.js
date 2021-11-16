const express = require('express');
const router = express.Router();
const gameController = require('../../controllers/core/game-controller');

// For frontend testing
router.get('/game_state', gameController.generateGameState);


/** 
 * loaded game state for the game
 * @body {
 *  game_id            
 * }
 * if sucess, it will return the JSON object
 *  {
 *    status: "success",
 *    game_state: game_state  // this is the game state object
 *  }
 * then trigger th e next events 
 */
router.post('/start', gameController.startGame);

// Test route for the front end
router.get('/play_uno',gameController.getGame)
exports.routes = router;