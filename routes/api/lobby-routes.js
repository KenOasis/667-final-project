const express = require('express');
const router = express.Router();
const chatController = require('../../controllers/core/chat-controller');
const lobbyController = require('../../controllers/core/lobby-controller');
const backendValidator = require('../../middleware/backend-validator');
router.get('/', lobbyController.getLobby);
router.post('/chat', chatController.sendChat);
router.post('/createGame', backendValidator.gameNameValidation, lobbyController.createGame);
router.post('/joinGame', lobbyController.joinGame);
router.post('/leaveGame', lobbyController.leaveGame);
router.post('/startGame', lobbyController.startGame);

exports.routes = router;