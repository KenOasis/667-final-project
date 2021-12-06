const express = require("express");
const router = express.Router();
const gameController = require("../../controllers/core/game-controller");
const userInGameValidator = require("../../middleware/user-in-game-validator");

router.post("/join", userInGameValidator, gameController.joinGame);

router.post(
  "/loadgamestate",
  userInGameValidator,
  gameController.loadGameState
);

router.post("/drawcard", userInGameValidator, gameController.drawCard);

router.post("/pass", userInGameValidator, gameController.pass);

router.post("/playcard", userInGameValidator, gameController.playCard);

router.post("/sayuno", userInGameValidator, gameController.sayUno);

router.post("/challenge", userInGameValidator, gameController.challenge);

// router.post("/endgame", userInGameValidator, gameController.endGame);
exports.routes = router;
