const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  playerId: { type: String, required: true, unique: true, index: true },
  playerName: { type: String, required: true },
  avatar: { type: String, default: '🍎' },
  gamesPlayed: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  highestScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
