const express = require('express');
const router = express.Router();
const chatController = require('../../controllers/core/chat-controller');

router.post('/chat', chatController.sendChat);

exports.routes = router;