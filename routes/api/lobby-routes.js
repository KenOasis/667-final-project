const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/core/chat-controller");
const lobbyController = require("../../controllers/core/lobby-controller");
const backendValidator = require("../../middleware/backend-validator");
const userInGameValidator = require("../../middleware/user-in-game-validator");

/**
 * Render page to the lobby hall
 * @route GET .../lobby/
 */

router.get("/", lobbyController.getLobby);

/**
 * Send the chat to the lobby
 * @route POST .../lobby/chat
 * @queryParam
 *  id = 0   //the id here should be 0, the chat will be send to the lobby hall
 * @body {
 *  message: string
 * }
 */
router.post("/chat", chatController.sendChat);

/**
 * Create a new game room in the lobby
 * @route POST ../lobby/createGame
 * @body {
 *  game_name: number
 * }
 */
router.post(
  "/createGame",
  backendValidator.gameNameValidation,
  lobbyController.createGame
);

/**
 * Join a selected game room in the lobby
 * @route POST ../lobby/joinGame
 * @body {
 *  game_id: number
 * }
 */
router.post("/joinGame", lobbyController.joinGame);

/**
 * Left the game you joint in the lobby
 * @route POST ../lobby/leaveGame
 * @body {
 *  game_id: number
 * }
 */
router.post("/leaveGame", userInGameValidator, lobbyController.leaveGame);

router.get(
  "/room/:game_id&:game_name",
  userInGameValidator,
  lobbyController.joinRoom
);

router.post("/room/gameReady", userInGameValidator, lobbyController.startGame);
exports.routes = router;
