const roomManager = require('../game/RoomManager');
const dbService = require('../services/dbService');
const { PRESET_COLLECTIONS } = require('../game/presets');

exports.createRoom = (req, res) => {
  try {
    const { mode, maxPlayers, totalRounds, turnTimerSeconds, hostId, customChits } = req.body;
    const room = roomManager.createRoom({
      mode,
      maxPlayers,
      totalRounds,
      turnTimerSeconds,
      hostId,
      customChits
    });

    res.status(201).json({
      success: true,
      roomCode: room.roomCode,
      settings: {
        mode: room.engine.mode,
        maxPlayers: room.engine.maxPlayers,
        totalRounds: room.engine.totalRounds
      },
      configuredChits: room.engine.configuredChits,
      totalChits: room.engine.configuredChits.length * 4
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getRoomInfo = (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = roomManager.getRoom(roomCode);
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    res.json({
      success: true,
      roomCode: room.roomCode,
      status: room.engine.status,
      playerCount: room.engine.players.size,
      maxPlayers: room.engine.maxPlayers,
      mode: room.engine.mode,
      hostId: room.hostId,
      configuredChits: room.engine.configuredChits,
      totalChits: room.engine.configuredChits.length * 4,
      players: Array.from(room.engine.players.values()).map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isReady: p.isReady,
        isHost: p.isHost
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getRoomChits = (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = roomManager.getRoom(roomCode);
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    res.json({
      success: true,
      roomCode: room.roomCode,
      configuredChits: room.engine.configuredChits,
      totalTypes: room.engine.configuredChits.length,
      totalChits: room.engine.configuredChits.length * 4
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateRoomChits = (req, res) => {
  try {
    const { roomCode } = req.params;
    const { playerId, customChits } = req.body;
    const result = roomManager.updateRoomChits(roomCode, customChits, playerId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getPresets = (req, res) => {
  res.json({
    success: true,
    presets: PRESET_COLLECTIONS
  });
};

exports.getGameHistory = async (req, res) => {
  try {
    const history = await dbService.getGameHistory();
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
