const express = require("express");
const router = express.Router();
const gameController = require("../../controllers/core/game-controller");
const userInGameValidator = require("../../middleware/user-in-game-validator");

// For frontend testing
router.get("/game_state", gameController.generateGameState);

router.post("/join", userInGameValidator, gameController.joinGame);

router.post(
  "/loadgamestate",
  userInGameValidator,
  gameController.loadGameState
);

router.post("/drawcard", userInGameValidator, gameController.drawCard);
// Test route for the front end

router.post("/pass", userInGameValidator, gameController.pass);
router.get("/play_uno", gameController.getGame);

exports.routes = router;
