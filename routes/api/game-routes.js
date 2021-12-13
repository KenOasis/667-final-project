const express = require("express");
const router = express.Router();
const gameController = require("../../controllers/core/game-controller");
const chatController = require("../../controllers/core/chat-controller");
const userInGameValidator = require("../../middleware/user-in-game-validator");
const actionInGameValidator = require("../../middleware/action-in-game-validator");
// DO NOT NEED user_id for each request since the user_id is attached in the session

/**
 * Joined and rendered a game page
 * @route POST ../game/join
 * @body {
 *  game_id: number
 * }
 */
router.post("/join", userInGameValidator, gameController.joinGame);

/**
 * Returned a game state of a game
 * @route POST ../game/loadgamestate
 * @body {
 *  game_id: number
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
 *  game_id: number
 * }
 */
router.post(
  "/drawcard",
  userInGameValidator,
  actionInGameValidator,
  gameController.drawCard
);

/**
 * Player pass his/her own round in a game after draw card.
 * @route POST ../game/pass
 * @body {
 *  game_id: number
 * }
 */
router.post(
  "/pass",
  userInGameValidator,
  actionInGameValidator,
  gameController.pass
);

/**
 * Player plays a card in a game
 * @route POST ../game/playcard
 * @body {
 *  game_id: number,
 *  card_id: number,
 *  undone_action: enum_type,   // for the reset   undone_action if undone_action === "draw"
 * }
 */
router.post(
  "/playcard",
  userInGameValidator,
  actionInGameValidator,
  gameController.playCard
);

/**
 * Player says uno in a game
 * @route POST ../game/sayuno
 * @body {
 *  game_id: number
 * }
 */
router.post(
  "/sayuno",
  userInGameValidator,
  actionInGameValidator,
  gameController.sayUno
);

/**
 * Player do challenge when the last player played wild_draw_four
 * @route POST ../game/challenge
 * @body {
 *  game_id: number,
 *  is_challenge: boolean
 * }
 * @
 */
router.post(
  "/challenge",
  userInGameValidator,
  actionInGameValidator,
  gameController.challenge
);

/**
 * Send the chat to the lobby
 * @route POST .../lobby/chat
 * @queryParam
 *  id: game_id (number)
 * @body {
 *  message: string
 * }
 */
router.post("/chat", chatController.sendChat);
exports.routes = router;
