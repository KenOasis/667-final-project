const express = require("express");
const router = express.Router();
const gameController = require("../../controllers/core/game-controller");
const chatController = require("../../controllers/core/chat-controller");
const userInGameValidator = require("../../middleware/user-in-game-validator");

// DO NOT NEED user_id for each request since the user_id is attached in the session

/**
 * Joined and rendered a game page
 * @route POST ../game/join
 * @body {
 *  game_id: 1
 * }
 */
router.post("/join", userInGameValidator, gameController.joinGame);

/**
 * Returned a game state of a game
 * @route POST ../game/loadgamestate
 * @body {
 *  game_id: 1
 * }
 */
router.post(
  "/loadgamestate",
  userInGameValidator,
  gameController.loadGameState
);

/**
 * Player draws a card from card pile in a game
 * @route POST ../game/drawcard
 * @body {
 *  game_id: 1
 * }
 */
router.post("/drawcard", userInGameValidator, gameController.drawCard);

/**
 * Player pass his/her own round in a game after draw card.
 * @route POST ../game/pass
 * @body {
 *  game_id: 1
 * }
 */
router.post("/pass", userInGameValidator, gameController.pass);

/**
 * Player plays a card in a game
 * @route POST ../game/playcard
 * @body {
 *  game_id: 1,
 *  card_id: 2,
 *  undone_action,   // for the reset   undone_action if undone_action === "draw"
 * }
 */
router.post("/playcard", userInGameValidator, gameController.playCard);

/**
 * Player says uno in a game
 * @route POST ../game/sayuno
 * @body {
 *  game_id: 1
 * }
 */
router.post("/sayuno", userInGameValidator, gameController.sayUno);

/**
 * Player do challenge when the last player played wild_draw_four
 * @route POST ../game/challenge
 * @body {
 *  game_id: 1,
 *  is_challenge: true
 * }
 * @
 */
router.post("/challenge", userInGameValidator, gameController.challenge);

router.post("/chat", chatController.sendChat);
exports.routes = router;
