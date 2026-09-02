import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import socketService from '../services/socket';
import sound from '../services/soundEngine';

const GameContext = createContext(null);

const DEFAULT_AVATARS = ['🍎', '🥭', '🍉', '🍌', '🍇', '🍊', '🍍', '🍓', '🥝', '🍒', '🥥', '🥑'];

function getInitialPlayer() {
  const savedId = localStorage.getItem('matchmates_player_id') || localStorage.getItem('chittilu_player_id');
  const savedName = localStorage.getItem('matchmates_player_name') || localStorage.getItem('chittilu_player_name');
  const savedAvatar = localStorage.getItem('matchmates_player_avatar') || localStorage.getItem('chittilu_player_avatar');

  const id = savedId || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  const name = savedName || `Player_${Math.floor(100 + Math.random() * 900)}`;
  const avatar = savedAvatar || DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];

  if (!savedId) localStorage.setItem('matchmates_player_id', id);
  if (!savedName) localStorage.setItem('matchmates_player_name', name);
  if (!savedAvatar) localStorage.setItem('matchmates_player_avatar', avatar);

  return { id, name, avatar };
}

export function GameProvider({ children }) {
  const [player, setPlayer] = useState(getInitialPlayer);
  const [roomCode, setRoomCode] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [myHand, setMyHand] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [activeReactions, setActiveReactions] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [lastMatch, setLastMatch] = useState(null);

  // Update profile
  const updatePlayer = useCallback((updates) => {
    setPlayer((prev) => {
      const next = { ...prev, ...updates };
      if (updates.name) localStorage.setItem('matchmates_player_name', updates.name);
      if (updates.avatar) localStorage.setItem('matchmates_player_avatar', updates.avatar);
      return next;
    });
  }, []);

  // Toggle sound
  const toggleSound = useCallback(() => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  // Add toast
  const addToast = useCallback((message, type = 'info') => {
    const toastId = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4000);
  }, []);

  // Socket event setup
  useEffect(() => {
    const socket = socketService.connect();

    const handlePlayerJoin = (data) => {
      setGameState(data.gameState);
      sound.playPop();
      addToast(`${data.player.name} joined the room!`, 'info');
    };

    const handlePlayerReady = (data) => {
      setGameState(data.gameState);
      sound.playPop();
    };

    const handleGameStart = (data) => {
      setGameState(data.gameState);
      sound.playTurnStart();
      addToast('Game started! Good luck!', 'success');
    };

    const handleTurnStart = (data) => {
      if (data.turnPlayerId === player.id) {
        sound.playTurnStart();
        addToast("It's your turn!", 'warning');
      }
    };

    const handlePlayerMove = (data) => {
      sound.playFlip();
      setGameState(data.gameState);
    };

    const handleChitsUpdated = (data) => {
      setGameState(data.gameState);
      sound.playPop();
      addToast(`Host updated chits: ${data.totalTypes} types (${data.totalChits} chits)`, 'info');
    };

    const handleMatchSuccess = (data) => {
      sound.playMatchSuccess();
      setLastMatch(data);
      setGameState(data.gameState);

      const itemName = data.matchData?.name || data.matchData?.fruitName || 'Item';
      if (data.playerId === player.id) {
        addToast(`🎉 Valid Match! +${data.matchData.points} pts (${itemName})`, 'success');
      } else {
        addToast(`${data.player.name} matched ${itemName}!`, 'info');
      }
    };

    const handleMatchFailed = (data) => {
      sound.playMismatch();
      // Temporarily reveal mismatched chits on client
      setGameState((prev) => {
        if (!prev) return prev;
        const updatedBoard = prev.boardChits.map((chit) => {
          const revealedItem = data.revealed.find((r) => r.id === chit.id);
          if (revealedItem) {
            return {
              ...chit,
              isRevealed: true,
              name: revealedItem.name || revealedItem.fruitName,
              emoji: revealedItem.emoji,
              color: revealedItem.color
            };
          }
          return chit;
        });
        return { ...prev, boardChits: updatedBoard };
      });
    };

    const handleTurnChange = (data) => {
      setGameState(data.gameState);
    };

    const handleScoreUpdate = (data) => {
      setGameState((prev) => (prev ? { ...prev, players: data.players } : prev));
    };

    const handleRoundEnd = (data) => {
      sound.playTurnStart();
      setGameState(data.gameState);
      addToast(`Round complete! Starting Round ${data.currentRound}`, 'info');
    };

    const handleGameEnd = (data) => {
      sound.playVictory();
      setGameState(data.gameState);
      addToast(`🏆 Game Over! Winner: ${data.winner?.name || 'Everyone'}`, 'success');
    };

    const handleGameRestart = (data) => {
      setGameState(data.gameState);
      addToast('Game has been reset to lobby by host.', 'info');
    };

    const handlePlayerDisconnect = (data) => {
      setGameState(data.gameState);
      addToast('A player disconnected.', 'error');
    };

    const handleChatMessage = (data) => {
      setChatMessages((prev) => [...prev.slice(-40), data]);
      sound.playPop();
    };

    const handleNewReaction = (data) => {
      setActiveReactions((prev) => [...prev, data]);
      setTimeout(() => {
        setActiveReactions((prev) => prev.filter((r) => r.id !== data.id));
      }, 3000);
    };

    const handlePrivateSync = (data) => {
      if (data.myHand) {
        setMyHand(data.myHand);
      }
    };

    socket.on('player:join', handlePlayerJoin);
    socket.on('player:ready', handlePlayerReady);
    socket.on('chits:updated', handleChitsUpdated);
    socket.on('game:start', handleGameStart);
    socket.on('turn:start', handleTurnStart);
    socket.on('player:move', handlePlayerMove);
    socket.on('match:success', handleMatchSuccess);
    socket.on('match:failed', handleMatchFailed);
    socket.on('turn:change', handleTurnChange);
    socket.on('score:update', handleScoreUpdate);
    socket.on('round:end', handleRoundEnd);
    socket.on('game:end', handleGameEnd);
    socket.on('game:restart', handleGameRestart);
    socket.on('player:disconnect', handlePlayerDisconnect);
    socket.on('chat:message', handleChatMessage);
    socket.on('reaction:new', handleNewReaction);
    socket.on('game:private_sync', handlePrivateSync);

    return () => {
      socket.off('player:join', handlePlayerJoin);
      socket.off('player:ready', handlePlayerReady);
      socket.off('chits:updated', handleChitsUpdated);
      socket.off('game:start', handleGameStart);
      socket.off('turn:start', handleTurnStart);
      socket.off('player:move', handlePlayerMove);
      socket.off('match:success', handleMatchSuccess);
      socket.off('match:failed', handleMatchFailed);
      socket.off('turn:change', handleTurnChange);
      socket.off('score:update', handleScoreUpdate);
      socket.off('round:end', handleRoundEnd);
      socket.off('game:end', handleGameEnd);
      socket.off('game:restart', handleGameRestart);
      socket.off('player:disconnect', handlePlayerDisconnect);
      socket.off('chat:message', handleChatMessage);
      socket.off('reaction:new', handleNewReaction);
      socket.off('game:private_sync', handlePrivateSync);
    };
  }, [player.id, addToast]);

  // Derived state
  const isHost = gameState?.players?.find((p) => p.id === player.id)?.isHost || false;
  const isMyTurn = gameState?.status === 'in_progress' && gameState?.turnPlayerId === player.id;
  const isReady = gameState?.players?.find((p) => p.id === player.id)?.isReady || false;

  // Actions
  const createRoom = async (options) => {
    sound.playPop();
    const res = await socketService.emit('room:create', {
      ...options,
      player
    });
    setRoomCode(res.roomCode);
    setGameState(res.gameState);
    setChatMessages([]);
    return res;
  };

  const joinRoom = async (code) => {
    sound.playPop();
    const res = await socketService.emit('room:join', {
      roomCode: code,
      player
    });
    setRoomCode(res.roomCode);
    setGameState(res.gameState);
    if (res.chatHistory) setChatMessages(res.chatHistory);
    return res;
  };

  const toggleReady = async () => {
    if (!roomCode) return;
    sound.playPop();
    await socketService.emit('player:ready', {
      roomCode,
      playerId: player.id,
      isReady: !isReady
    });
  };

  const startGame = async () => {
    if (!roomCode || !isHost) return;
    sound.playPop();
    await socketService.emit('game:start', {
      roomCode,
      requestingPlayerId: player.id
    });
  };

  const pickChit = async (chitId) => {
    if (!roomCode || !isMyTurn) return;
    sound.playPop();
    await socketService.emit('player:move', {
      roomCode,
      playerId: player.id,
      chitId
    });
  };

  const passChit = async (chitId) => {
    if (!roomCode) return;
    sound.playPop();
    await socketService.emit('player:pass_chit', {
      roomCode,
      playerId: player.id,
      chitId
    });
  };

  const claimChittilu = async () => {
    if (!roomCode) return;
    sound.playPop();
    await socketService.emit('player:claim_chittilu', {
      roomCode,
      playerId: player.id
    });
  };

  const updateCustomChits = async (newChits) => {
    if (!roomCode || !isHost) return;
    sound.playPop();
    const res = await socketService.emit('chits:update', {
      roomCode,
      playerId: player.id,
      customChits: newChits
    });
    return res;
  };

  const restartGame = async (options = {}) => {
    if (!roomCode || !isHost) return;
    sound.playPop();
    await socketService.emit('game:restart', {
      roomCode,
      requestingPlayerId: player.id,
      customChits: options?.customChits || null
    });
  };

  const sendChatMessage = (text) => {
    if (!roomCode || !text.trim()) return;
    socketService.getSocket().emit('chat:send', {
      roomCode,
      senderId: player.id,
      senderName: player.name,
      senderAvatar: player.avatar,
      text: text.trim()
    });
  };

  const sendReaction = (emoji) => {
    if (!roomCode) return;
    sound.playPop();
    socketService.getSocket().emit('reaction:send', {
      roomCode,
      senderId: player.id,
      senderName: player.name,
      emoji
    });
  };

  const leaveRoom = () => {
    sound.playPop();
    socketService.getSocket().emit('room:leave');
    setRoomCode(null);
    setGameState(null);
    setMyHand([]);
    setChatMessages([]);
  };

  return (
    <GameContext.Provider
      value={{
        player,
        updatePlayer,
        roomCode,
        gameState,
        myHand,
        isHost,
        isMyTurn,
        isReady,
        isMuted,
        toggleSound,
        chatMessages,
        activeReactions,
        toasts,
        lastMatch,
        DEFAULT_AVATARS,
        createRoom,
        joinRoom,
        toggleReady,
        startGame,
        pickChit,
        passChit,
        claimChittilu,
        updateCustomChits,
        restartGame,
        sendChatMessage,
        sendReaction,
        leaveRoom,
        addToast
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
