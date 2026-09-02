const ChitGameEngine = require('./ChitGameEngine');
const { generateRoomCode, sanitizeRoomCode } = require('../utils/roomCode');

/**
 * RoomManager
 * Manages all active multiplayer rooms and socket mapping with custom chit support.
 */
class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomCode -> { engine, createdAt, hostId, chat: [] }
    this.socketToPlayer = new Map(); // socketId -> { roomCode, playerId }
    this.playerTokens = new Map(); // playerId -> { token, roomCode, name, avatar }
  }

  /**
   * Create a new room with custom chits
   */
  createRoom(options = {}) {
    let roomCode = generateRoomCode();
    let attempts = 0;
    while (this.rooms.has(roomCode) && attempts < 10) {
      roomCode = generateRoomCode();
      attempts++;
    }

    const engine = new ChitGameEngine({
      roomId: roomCode,
      mode: options.mode || 'chit_match',
      maxPlayers: Math.min(8, Math.max(2, parseInt(options.maxPlayers, 10) || 8)),
      totalRounds: parseInt(options.totalRounds, 10) || 3,
      turnTimerSeconds: parseInt(options.turnTimerSeconds, 10) || 30,
      customChits: options.customChits || null
    });

    const room = {
      roomCode,
      engine,
      createdAt: Date.now(),
      hostId: options.hostId || null,
      chat: [],
      reactions: []
    };

    this.rooms.set(roomCode, room);
    return room;
  }

  /**
   * Get room by code
   */
  getRoom(roomCode) {
    const code = sanitizeRoomCode(roomCode);
    return this.rooms.get(code) || null;
  }

  /**
   * Add player to room
   */
  joinRoom(roomCode, playerInfo, socketId) {
    const code = sanitizeRoomCode(roomCode);
    const room = this.rooms.get(code);
    if (!room) {
      return { success: false, error: 'Room not found. Please verify the code.' };
    }

    const result = room.engine.addPlayer(playerInfo);
    if (!result.success) {
      return result;
    }

    if (playerInfo.isHost || !room.hostId) {
      room.hostId = playerInfo.id;
    }

    this.socketToPlayer.set(socketId, { roomCode: code, playerId: playerInfo.id });

    return {
      success: true,
      room,
      player: result.player,
      gameState: room.engine.getPublicGameState()
    };
  }

  /**
   * Update custom chits in a room
   */
  updateRoomChits(roomCode, newChits, playerId) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    return room.engine.updateCustomChits(newChits, playerId);
  }

  /**
   * Leave room
   */
  leaveRoom(socketId) {
    const mapping = this.socketToPlayer.get(socketId);
    if (!mapping) return null;

    const { roomCode, playerId } = mapping;
    this.socketToPlayer.delete(socketId);

    const room = this.rooms.get(roomCode);
    if (!room) return null;

    const result = room.engine.removePlayer(playerId);
    
    const connectedCount = Array.from(room.engine.players.values()).filter(p => p.connected).length;
    if (connectedCount === 0 && room.engine.status === 'game_over') {
      setTimeout(() => {
        const checkRoom = this.rooms.get(roomCode);
        if (checkRoom) {
          const count = Array.from(checkRoom.engine.players.values()).filter(p => p.connected).length;
          if (count === 0) {
            this.rooms.delete(roomCode);
          }
        }
      }, 60000);
    }

    return {
      roomCode,
      playerId,
      result,
      gameState: room.engine.getPublicGameState()
    };
  }

  addChat(roomCode, message) {
    const room = this.getRoom(roomCode);
    if (!room) return null;

    const chatItem = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      senderId: message.senderId,
      senderName: message.senderName,
      senderAvatar: message.senderAvatar || '🍎',
      text: message.text.slice(0, 150),
      timestamp: Date.now()
    };

    room.chat.push(chatItem);
    if (room.chat.length > 50) room.chat.shift();
    return chatItem;
  }

  addReaction(roomCode, reaction) {
    const room = this.getRoom(roomCode);
    if (!room) return null;

    return {
      id: `rx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      senderId: reaction.senderId,
      senderName: reaction.senderName,
      emoji: reaction.emoji || '🎉',
      timestamp: Date.now()
    };
  }

  cleanupStaleRooms() {
    const now = Date.now();
    const SIX_HOURS = 6 * 60 * 60 * 1000;
    for (const [code, room] of this.rooms.entries()) {
      if (now - room.createdAt > SIX_HOURS) {
        this.rooms.delete(code);
      }
    }
  }
}

const roomManager = new RoomManager();
setInterval(() => roomManager.cleanupStaleRooms(), 60 * 60 * 1000);

module.exports = roomManager;
