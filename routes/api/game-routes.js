const express = require("express");
const router = express.Router();
const gameController = require("../../controllers/core/game-controller");

// For frontend testing
router.get("/game_state", gameController.generateGameState);

router.post("/join", gameController.joinGame);

router.post("/loadgamestate", gameController.loadGameState);

router.post("/drawcard", gameController.drawCard);
// Test route for the front end
router.get("/play_uno", gameController.getGame);

exports.routes = router;
