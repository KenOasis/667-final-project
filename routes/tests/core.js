const express = require('express');
const router = express.Router()

const gameTestController = require('../../controllers/core/test');

router.get('/show_all_cards', gameTestController.showAllCards);
router.get('/show_random_cards', gameTestController.showRandomCards);
router.get('/test_game', gameTestController.testGame);
router.get('/test_gu', gameTestController.testGameUsers);
router.get('/test_gc', gameTestController.testGameCards);
router.get('/initial_game', gameTestController.initialGame);
router.get('/game/:1', gameTestController.getGame);
exports.routes = router;
