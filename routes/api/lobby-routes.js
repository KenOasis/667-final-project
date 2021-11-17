const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/core/chat-controller");
const lobbyController = require("../../controllers/core/lobby-controller");
const backendValidator = require("../../middleware/backend-validator");

router.get("/", lobbyController.getLobby);

/**
 * Send the chat to the lobby
 * @queryParam  Must be 0 here to indicated the destination of chat is lobby
 *  id = 0
 * @body {
 *  message
 * }
 */
router.post("/chat", chatController.sendChat);

/**
 * Create a new game room in the lobby
 * @body {
 *  game_name
 * }
 */
router.post(
  "/createGame",
  backendValidator.gameNameValidation,
  lobbyController.createGame
);

/**
 * Join a selected game room in the lobby
 * @body {
 *  game_id
 * }
 */
router.post("/joinGame", lobbyController.joinGame);

/**
 * Left the game you joint in the lobby
 * @body {
 *  game_id
 * }
 */
router.post("/leaveGame", lobbyController.leaveGame);

exports.routes = router;
