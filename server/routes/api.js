const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const userController = require('../controllers/userController');
const { createRoomLimiter } = require('../middleware/rateLimiter');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    game: 'MatchMates',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Game & Room Routes
router.post('/rooms', createRoomLimiter, gameController.createRoom);
router.post('/games', createRoomLimiter, gameController.createRoom);
router.get('/rooms/:roomCode', gameController.getRoomInfo);
router.get('/games/:roomCode', gameController.getRoomInfo);
router.get('/games/:roomCode/chits', gameController.getRoomChits);
router.post('/games/:roomCode/chits', gameController.updateRoomChits);
router.get('/presets', gameController.getPresets);
router.get('/history', gameController.getGameHistory);

// User & Leaderboard Routes
router.get('/users/:playerId', userController.getUserProfile);
router.get('/leaderboard', userController.getLeaderboard);

module.exports = router;
