const express = require('express');
const router = express.Router();
const chatController = require('../../controllers/core/chat-controller');
const lobbyController = require('../../controllers/core/lobby-controller');

router.post('/chat', chatController.sendChat);
router.get('/createGame', lobbyController.createGame);
exports.routes = router;