const mongoose = require('mongoose');

const ChitTypeSchema = new mongoose.Schema({
  id: String,
  name: { type: String, required: true },
  emoji: String,
  color: String,
  quantity: { type: Number, default: 4 }
});

const GameSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true, index: true },
  hostId: { type: String, required: true },
  mode: { type: String, default: 'chit_match' },
  maxPlayers: { type: Number, default: 8 },
  status: { type: String, enum: ['waiting', 'in_progress', 'completed'], default: 'waiting' },
  chitSet: {
    name: { type: String, default: 'Custom Chits' },
    items: [ChitTypeSchema]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Game || mongoose.model('Game', GameSchema);
