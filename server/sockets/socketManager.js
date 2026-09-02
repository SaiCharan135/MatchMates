const roomManager = require('../game/RoomManager');
const dbService = require('../services/dbService');
const { sanitizeRoomCode } = require('../utils/roomCode');

/**
 * Socket.IO Real-Time Multiplayer Manager
 */
function initSocketManager(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    /**
     * Room Creation with Custom Chits
     */
    socket.on('room:create', (payload, callback) => {
      try {
        const { mode, maxPlayers, totalRounds, player, customChits } = payload;
        const room = roomManager.createRoom({
          mode,
          maxPlayers,
          totalRounds,
          hostId: player.id,
          customChits: customChits || null
        });

        // Join socket to room
        const joinResult = roomManager.joinRoom(room.roomCode, { ...player, isHost: true }, socket.id);
        socket.join(room.roomCode);

        if (typeof callback === 'function') {
          callback({
            success: true,
            roomCode: room.roomCode,
            gameState: joinResult.gameState,
            player: joinResult.player
          });
        }
      } catch (err) {
        console.error('Error in room:create:', err);
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    /**
     * Update Custom Chits (Host Only)
     */
    socket.on('chits:update', (payload, callback) => {
      try {
        const { roomCode, playerId, customChits } = payload;
        const code = sanitizeRoomCode(roomCode);
        const result = roomManager.updateRoomChits(code, customChits, playerId);

        if (result.success) {
          const room = roomManager.getRoom(code);
          const state = room.engine.getPublicGameState();
          io.to(code).emit('chits:updated', {
            configuredChits: result.configuredChits,
            totalTypes: result.totalTypes,
            totalChits: result.totalChits,
            gameState: state
          });

          if (typeof callback === 'function') callback({ success: true, configuredChits: result.configuredChits });
        } else {
          if (typeof callback === 'function') callback(result);
          socket.emit('error:message', result.error);
        }
      } catch (err) {
        console.error('Error in chits:update:', err);
        if (typeof callback === 'function') callback({ success: false, error: err.message });
      }
    });

    /**
     * Room Join
     */
    socket.on('room:join', (payload, callback) => {
      try {
        const { roomCode, player } = payload;
        const code = sanitizeRoomCode(roomCode);

        const joinResult = roomManager.joinRoom(code, player, socket.id);
        if (!joinResult.success) {
          if (typeof callback === 'function') {
            return callback(joinResult);
          }
          return socket.emit('error:message', joinResult.error);
        }

        socket.join(code);

        io.to(code).emit('player:join', {
          player: joinResult.player,
          gameState: joinResult.gameState
        });

        if (typeof callback === 'function') {
          callback({
            success: true,
            roomCode: code,
            player: joinResult.player,
            gameState: joinResult.gameState,
            chatHistory: joinResult.room.chat
          });
        }
      } catch (err) {
        console.error('Error in room:join:', err);
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    /**
     * Player Ready Toggle
     */
    socket.on('player:ready', (payload, callback) => {
      try {
        const { roomCode, playerId, isReady } = payload;
        const code = sanitizeRoomCode(roomCode);
        const room = roomManager.getRoom(code);

        if (!room) {
          if (typeof callback === 'function') callback({ success: false, error: 'Room not found' });
          return;
        }

        const result = room.engine.setPlayerReady(playerId, isReady);
        if (result.success) {
          const state = room.engine.getPublicGameState();
          io.to(code).emit('player:ready', {
            playerId,
            isReady: result.player.isReady,
            gameState: state
          });

          if (typeof callback === 'function') callback({ success: true, isReady: result.player.isReady });
        } else {
          if (typeof callback === 'function') callback(result);
        }
      } catch (err) {
        console.error('Error in player:ready:', err);
      }
    });

    /**
     * Game Start (Host only)
     */
    socket.on('game:start', (payload, callback) => {
      try {
        const { roomCode, requestingPlayerId } = payload;
        const code = sanitizeRoomCode(roomCode);
        const room = roomManager.getRoom(code);

        if (!room) {
          if (typeof callback === 'function') callback({ success: false, error: 'Room not found' });
          return;
        }

        const canStartCheck = room.engine.canStartGame(requestingPlayerId);
        if (!canStartCheck.canStart) {
          if (typeof callback === 'function') callback({ success: false, error: canStartCheck.reason });
          return socket.emit('error:message', canStartCheck.reason);
        }

        const startResult = room.engine.startGame();
        if (startResult.success) {
          io.to(code).emit('game:start', {
            gameState: room.engine.getPublicGameState(),
            turnPlayerId: room.engine.turnPlayerId,
            currentRound: room.engine.currentRound
          });

          io.to(code).emit('turn:start', {
            turnPlayerId: room.engine.turnPlayerId,
            turnIndex: room.engine.turnIndex,
            timerSeconds: room.engine.turnTimerSeconds
          });

          const roomSockets = io.sockets.adapter.rooms.get(code);
          if (roomSockets) {
            for (const sId of roomSockets) {
              const sMapping = roomManager.socketToPlayer.get(sId);
              if (sMapping && sMapping.playerId) {
                const pSocket = io.sockets.sockets.get(sId);
                if (pSocket) {
                  pSocket.emit('game:private_sync', room.engine.getPlayerPrivateState(sMapping.playerId));
                }
              }
            }
          }

          if (typeof callback === 'function') callback({ success: true });
        }
      } catch (err) {
        console.error('Error in game:start:', err);
        if (typeof callback === 'function') callback({ success: false, error: err.message });
      }
    });

    /**
     * Player Move (Card Pick in matching grid mode)
     */
    socket.on('player:move', (payload, callback) => {
      try {
        const { roomCode, playerId, chitId } = payload;
        const code = sanitizeRoomCode(roomCode);
        const room = roomManager.getRoom(code);

        if (!room) {
          if (typeof callback === 'function') callback({ success: false, error: 'Room not found' });
          return;
        }

        const result = room.engine.handlePickChit(playerId, chitId);
        if (!result.success) {
          if (typeof callback === 'function') callback(result);
          return socket.emit('error:message', result.error);
        }

        if (typeof callback === 'function') callback(result);

        if (result.action === 'first_pick') {
          io.to(code).emit('player:move', {
            playerId,
            chitId,
            pickedChit: result.pickedChit,
            gameState: room.engine.getPublicGameState()
          });
        } else if (result.action === 'match_success') {
          io.to(code).emit('match:success', {
            playerId,
            chits: result.chits,
            matchData: result.matchData,
            player: result.player,
            gameState: room.engine.getPublicGameState(),
            roundStatus: result.roundStatus
          });

          io.to(code).emit('score:update', {
            players: room.engine.getPublicGameState().players
          });

          if (result.roundStatus === 'game_over') {
            const finalState = room.engine.getPublicGameState();
            io.to(code).emit('game:end', {
              winner: finalState.winner,
              rankings: finalState.rankings,
              gameState: finalState
            });

            dbService.recordGameResult({
              roomCode: code,
              mode: room.engine.mode,
              totalRounds: room.engine.totalRounds,
              players: Array.from(room.engine.players.values()),
              winner: finalState.winner,
              chitSet: {
                name: 'Custom Chits',
                items: room.engine.configuredChits
              }
            });
          } else if (result.roundStatus === 'next_round') {
            io.to(code).emit('round:end', {
              currentRound: room.engine.currentRound,
              gameState: room.engine.getPublicGameState()
            });

            io.to(code).emit('turn:change', {
              turnPlayerId: room.engine.turnPlayerId,
              gameState: room.engine.getPublicGameState()
            });
          } else {
            io.to(code).emit('turn:start', {
              turnPlayerId: room.engine.turnPlayerId,
              timerSeconds: room.engine.turnTimerSeconds
            });
          }
        } else if (result.action === 'match_failed') {
          io.to(code).emit('match:failed', {
            playerId,
            chits: result.chits,
            revealed: result.revealed,
            nextTurnPlayerId: result.nextTurnPlayerId
          });

          setTimeout(() => {
            io.to(code).emit('turn:change', {
              turnPlayerId: room.engine.turnPlayerId,
              gameState: room.engine.getPublicGameState()
            });
            io.to(code).emit('turn:start', {
              turnPlayerId: room.engine.turnPlayerId,
              timerSeconds: room.engine.turnTimerSeconds
            });
          }, 1200);
        }
      } catch (err) {
        console.error('Error in player:move:', err);
      }
    });

    /**
     * Chit Pass Mode: Pass Chit
     */
    socket.on('player:pass_chit', (payload, callback) => {
      try {
        const { roomCode, playerId, chitId } = payload;
        const code = sanitizeRoomCode(roomCode);
        const room = roomManager.getRoom(code);

        if (!room) return;
        const result = room.engine.handlePassChit(playerId, chitId);
        if (typeof callback === 'function') callback(result);

        if (result.success) {
          if (result.action === 'pass_completed') {
            const roomSockets = io.sockets.adapter.rooms.get(code);
            if (roomSockets) {
              for (const sId of roomSockets) {
                const sMapping = roomManager.socketToPlayer.get(sId);
                if (sMapping && sMapping.playerId) {
                  const pSocket = io.sockets.sockets.get(sId);
                  if (pSocket) {
                    pSocket.emit('game:private_sync', room.engine.getPlayerPrivateState(sMapping.playerId));
                  }
                }
              }
            }
            io.to(code).emit('pass:completed', { gameState: room.engine.getPublicGameState() });
          } else {
            io.to(code).emit('pass:staged', { playerId, gameState: room.engine.getPublicGameState() });
          }
        }
      } catch (err) {
        console.error('Error in player:pass_chit:', err);
      }
    });

    /**
     * Claim MatchMates
     */
    socket.on('player:claim_chittilu', (payload, callback) => {
      try {
        const { roomCode, playerId } = payload;
        const code = sanitizeRoomCode(roomCode);
        const room = roomManager.getRoom(code);
        if (!room) return;

        const result = room.engine.handleClaimChittilu(playerId);
        if (typeof callback === 'function') callback(result);

        if (result.success) {
          io.to(code).emit('chittilu:claimed', {
            playerId,
            chit: result.chit,
            gameEnded: result.gameEnded,
            currentRound: result.currentRound,
            gameState: room.engine.getPublicGameState()
          });

          if (result.gameEnded) {
            const finalState = room.engine.getPublicGameState();
            io.to(code).emit('game:end', {
              winner: finalState.winner,
              rankings: finalState.rankings,
              gameState: finalState
            });
            dbService.recordGameResult({
              roomCode: code,
              mode: room.engine.mode,
              totalRounds: room.engine.totalRounds,
              players: Array.from(room.engine.players.values()),
              winner: finalState.winner,
              chitSet: {
                name: 'Custom Chits',
                items: room.engine.configuredChits
              }
            });
          }
        }
      } catch (err) {
        console.error('Error in player:claim_chittilu:', err);
      }
    });

    /**
     * Game Restart / Rematch (Host Only)
     */
    socket.on('game:restart', (payload, callback) => {
      try {
        const { roomCode, requestingPlayerId, customChits } = payload;
        const code = sanitizeRoomCode(roomCode);
        const room = roomManager.getRoom(code);

        if (!room) {
          if (typeof callback === 'function') callback({ success: false, error: 'Room not found' });
          return;
        }

        const requester = room.engine.players.get(requestingPlayerId);
        if (!requester || !requester.isHost) {
          if (typeof callback === 'function') callback({ success: false, error: 'Only the host can restart the game' });
          return;
        }

        room.engine.restartGame(customChits || null);
        io.to(code).emit('game:restart', {
          gameState: room.engine.getPublicGameState()
        });

        if (typeof callback === 'function') callback({ success: true });
      } catch (err) {
        console.error('Error in game:restart:', err);
      }
    });

    socket.on('room:leave', () => {
      handleLeave(socket);
    });

    socket.on('chat:send', (payload) => {
      try {
        const { roomCode, senderId, senderName, senderAvatar, text } = payload;
        const code = sanitizeRoomCode(roomCode);
        const chatItem = roomManager.addChat(code, { senderId, senderName, senderAvatar, text });
        if (chatItem) {
          io.to(code).emit('chat:message', chatItem);
        }
      } catch (err) {
        console.error('Error in chat:send:', err);
      }
    });

    socket.on('reaction:send', (payload) => {
      try {
        const { roomCode, senderId, senderName, emoji } = payload;
        const code = sanitizeRoomCode(roomCode);
        const reactionItem = roomManager.addReaction(code, { senderId, senderName, emoji });
        if (reactionItem) {
          io.to(code).emit('reaction:new', reactionItem);
        }
      } catch (err) {
        console.error('Error in reaction:send:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
      handleLeave(socket);
    });
  });

  function handleLeave(socket) {
    const leaveResult = roomManager.leaveRoom(socket.id);
    if (leaveResult) {
      const { roomCode, playerId, gameState } = leaveResult;
      io.to(roomCode).emit('player:disconnect', {
        playerId,
        gameState
      });
    }
  }
}

module.exports = initSocketManager;
