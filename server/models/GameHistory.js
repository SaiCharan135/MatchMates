const mongoose = require('mongoose');

const GameHistorySchema = new mongoose.Schema({
  roomCode: { type: String, required: true, index: true },
  mode: { type: String, default: 'chit_match' },
  totalRounds: { type: Number, default: 3 },
  chitSet: {
    name: String,
    items: [
      {
        id: String,
        name: String,
        emoji: String,
        quantity: Number
      }
    ]
  },
  winner: {
    id: String,
    name: String,
    avatar: String,
    score: Number
  },
  players: [
    {
      id: String,
      name: String,
      avatar: String,
      score: Number,
      matchesCount: Number
    }
  ],
  playedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.GameHistory || mongoose.model('GameHistory', GameHistorySchema);
