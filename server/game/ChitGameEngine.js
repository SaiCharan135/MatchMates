const { v4: uuidv4 } = require('uuid');
const { getDefaultChits } = require('./presets');

/**
 * MATCHMATES GAME ENGINE
 * Authoritative server-side game state machine with completely customizable chits.
 */
class ChitGameEngine {
  constructor(options = {}) {
    this.roomId = options.roomId;
    this.mode = options.mode || 'chit_match'; // 'chit_match' (Grid matching) or 'chit_pass' (Social passing)
    this.maxPlayers = options.maxPlayers || 8;
    this.minPlayers = options.minPlayers || 2;
    this.totalRounds = options.totalRounds || 3;
    this.minChitTypes = options.minChitTypes || 4;
    this.maxChitTypes = options.maxChitTypes || 20;
    
    // Configured Custom Chit Types (Each item automatically generates quantity = 4)
    this.configuredChits = this.normalizeCustomChits(options.customChits || getDefaultChits('fruits'));

    this.scoringRules = options.scoringRules || {
      standardMatch: 1,
      chittiluBonus: 5,
      streakBonus: 1
    };
    
    // Game Lifecycle
    this.status = 'waiting'; // 'waiting', 'in_progress', 'round_end', 'game_over'
    this.currentRound = 1;
    this.roundStartTime = null;
    this.turnIndex = 0;
    this.turnPlayerId = null;
    this.turnTimerSeconds = options.turnTimerSeconds || 30;
    
    // Players Map: { playerId: { id, name, avatar, score, roundScore, matchesCount, isReady, isHost, connected, streak } }
    this.players = new Map();
    this.playerOrder = []; // Array of player IDs in turn order
    
    // Board / Physical Chit Pool (Server-Only Source of Truth)
    this.boardChits = []; // Array of physical chit objects
    this.playerHands = new Map(); // playerId -> Array of physical chit objects
    this.passStaging = new Map(); // For chit_pass mode: playerId -> passedChit
    
    // Current Active Turn Action Cache
    this.currentPicks = []; // Array of physical chit IDs currently picked in this turn
    this.turnHistory = [];
    this.winner = null;
    this.rankings = [];
  }

  /**
   * Normalize and validate custom chits array
   */
  normalizeCustomChits(rawChits) {
    if (!Array.isArray(rawChits) || rawChits.length === 0) {
      return getDefaultChits('fruits');
    }

    const seenNames = new Set();
    const normalized = [];

    for (const item of rawChits) {
      if (!item || typeof item.name !== 'string') continue;
      const cleanName = item.name.trim().slice(0, 30);
      if (!cleanName) continue;

      const lower = cleanName.toLowerCase();
      if (seenNames.has(lower)) continue; // Reject duplicate names
      seenNames.add(lower);

      normalized.push({
        id: item.id || `type_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${uuidv4().slice(0, 4)}`,
        name: cleanName,
        emoji: typeof item.emoji === 'string' ? item.emoji.trim().slice(0, 4) : '',
        color: item.color || '#FF7A00',
        quantity: 4 // ALWAYS exactly 4 copies per type
      });
    }

    return normalized.length >= 4 ? normalized : getDefaultChits('fruits');
  }

  /**
   * Host updates custom chit collection before game starts
   */
  updateCustomChits(newChits, requestingPlayerId) {
    if (this.status !== 'waiting') {
      return { success: false, error: 'Cannot modify chits while game is in progress' };
    }

    const requester = this.players.get(requestingPlayerId);
    if (!requester || !requester.isHost) {
      return { success: false, error: 'Only the host can customize chits' };
    }

    if (!Array.isArray(newChits)) {
      return { success: false, error: 'Invalid chits format' };
    }

    if (newChits.length < this.minChitTypes) {
      return { success: false, error: `You need at least ${this.minChitTypes} unique chit types (minimum ${this.minChitTypes * 4} chits)` };
    }

    if (newChits.length > this.maxChitTypes) {
      return { success: false, error: `Maximum of ${this.maxChitTypes} chit types allowed` };
    }

    // Check duplicate names
    const names = new Set();
    for (const c of newChits) {
      const trimmed = (c.name || '').trim();
      if (!trimmed) {
        return { success: false, error: 'Chit names cannot be empty' };
      }
      if (trimmed.length > 30) {
        return { success: false, error: `Name "${trimmed}" exceeds 30 characters` };
      }
      const lower = trimmed.toLowerCase();
      if (names.has(lower)) {
        return { success: false, error: `Duplicate chit name "${trimmed}" is not allowed` };
      }
      names.add(lower);
    }

    this.configuredChits = this.normalizeCustomChits(newChits);

    return {
      success: true,
      configuredChits: this.configuredChits,
      totalTypes: this.configuredChits.length,
      totalChits: this.configuredChits.length * 4
    };
  }

  /**
   * Add a player to the game
   */
  addPlayer(player) {
    if (this.players.has(player.id)) {
      // Reconnection of existing player
      const existing = this.players.get(player.id);
      existing.connected = true;
      existing.name = player.name || existing.name;
      existing.avatar = player.avatar || existing.avatar;
      return { success: true, player: existing };
    }

    if (this.status !== 'waiting') {
      return { success: false, error: 'Game is already in progress' };
    }

    if (this.players.size >= this.maxPlayers) {
      return { success: false, error: 'Room is full (max players reached)' };
    }

    const newPlayer = {
      id: player.id,
      name: player.name || `Player ${this.players.size + 1}`,
      avatar: player.avatar || '🍎',
      score: 0,
      roundScore: 0,
      matchesCount: 0,
      isReady: player.isHost || false,
      isHost: player.isHost || false,
      connected: true,
      streak: 0,
      joinedAt: Date.now()
    };

    this.players.set(player.id, newPlayer);
    this.playerOrder.push(player.id);
    return { success: true, player: newPlayer };
  }

  /**
   * Remove or disconnect a player
   */
  removePlayer(playerId) {
    if (!this.players.has(playerId)) return null;

    const player = this.players.get(playerId);
    
    if (this.status === 'waiting') {
      this.players.delete(playerId);
      this.playerOrder = this.playerOrder.filter(id => id !== playerId);
      
      // If host left, assign host to first remaining player
      if (player.isHost && this.playerOrder.length > 0) {
        const newHost = this.players.get(this.playerOrder[0]);
        if (newHost) {
          newHost.isHost = true;
          newHost.isReady = true;
        }
      }
      return { removed: true, player };
    } else {
      player.connected = false;
      
      if (this.turnPlayerId === playerId) {
        this.nextTurn();
      }
      
      const activePlayers = Array.from(this.players.values()).filter(p => p.connected);
      if (activePlayers.length === 0) {
        this.status = 'game_over';
      }
      
      return { disconnected: true, player };
    }
  }

  /**
   * Toggle player ready status
   */
  setPlayerReady(playerId, isReady) {
    const player = this.players.get(playerId);
    if (!player) return { success: false, error: 'Player not found' };
    player.isReady = Boolean(isReady);
    return { success: true, player };
  }

  /**
   * Validate if game can start with current players & chit configuration
   */
  canStartGame(requestingPlayerId) {
    const requester = this.players.get(requestingPlayerId);
    if (!requester || !requester.isHost) {
      return { canStart: false, reason: 'Only the host can start the game' };
    }

    const connectedPlayers = Array.from(this.players.values()).filter(p => p.connected);
    if (connectedPlayers.length < this.minPlayers) {
      return { canStart: false, reason: `Need at least ${this.minPlayers} players to start` };
    }

    const notReady = connectedPlayers.filter(p => !p.isReady);
    if (notReady.length > 0) {
      return { canStart: false, reason: `Waiting for all players to be ready (${notReady.map(p => p.name).join(', ')})` };
    }

    if (this.configuredChits.length < this.minChitTypes) {
      return { canStart: false, reason: `Need at least ${this.minChitTypes} unique chit types configured` };
    }

    // In chit_pass mode, we need at least as many chit types as players
    if (this.mode === 'chit_pass' && this.configuredChits.length < connectedPlayers.length) {
      return {
        canStart: false,
        reason: `Chit Pass mode requires at least ${connectedPlayers.length} unique chit types for ${connectedPlayers.length} players`
      };
    }

    return { canStart: true };
  }

  /**
   * Start or restart the game
   */
  startGame() {
    this.status = 'in_progress';
    this.currentRound = 1;
    this.winner = null;
    this.rankings = [];
    
    // Reset player scores
    this.players.forEach(p => {
      p.score = 0;
      p.roundScore = 0;
      p.matchesCount = 0;
      p.streak = 0;
    });

    // Shuffle turn order
    this.shufflePlayerOrder();
    this.turnIndex = 0;
    this.turnPlayerId = this.playerOrder[0];

    // Initialize round with physical chit pool
    this.initializeRound();

    return { success: true, gameState: this.getPublicGameState() };
  }

  /**
   * Generate authoritative physical chit pool from configured types (quantity = 4 each)
   */
  generatePhysicalChitPool(typesToUse = null) {
    const types = typesToUse || this.configuredChits;
    const pool = [];

    types.forEach(chitType => {
      // Create exactly 4 physical chits per type with unique IDs
      for (let i = 1; i <= 4; i++) {
        const physicalId = `${chitType.id}_${String(i).padStart(3, '0')}_${uuidv4().slice(0, 4)}`;
        pool.push({
          id: physicalId,
          typeId: chitType.id,
          name: chitType.name,
          emoji: chitType.emoji || '',
          color: chitType.color || '#FF7A00',
          copyNumber: i,
          points: 1,
          isRevealed: false,
          isMatched: false,
          matchedBy: null
        });
      }
    });

    // Server-side Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool;
  }

  /**
   * Initialize a new round
   */
  initializeRound() {
    this.roundStartTime = Date.now();
    this.currentPicks = [];
    this.passStaging.clear();

    const playerCount = this.playerOrder.length;

    if (this.mode === 'chit_pass') {
      // Chit Pass Mode: Select exactly playerCount types (each x4 = 4 chits per player)
      const passTypes = this.configuredChits.slice(0, playerCount);
      const pool = this.generatePhysicalChitPool(passTypes);

      this.playerHands.clear();
      this.playerOrder.forEach((playerId, pIndex) => {
        const hand = pool.slice(pIndex * 4, (pIndex + 1) * 4);
        this.playerHands.set(playerId, hand);
      });
      this.boardChits = [];
    } else {
      // Matching Grid Mode:
      // Select appropriate number of chit types based on player count
      // For 2-3 players: 4 types (16 chits) or up to all configured types
      const maxTypesForGrid = Math.min(this.configuredChits.length, playerCount <= 3 ? 4 : playerCount <= 5 ? 6 : 8);
      const selectedTypes = this.configuredChits.slice(0, Math.max(4, maxTypesForGrid));
      
      const pool = this.generatePhysicalChitPool(selectedTypes);
      this.boardChits = pool.map((item, idx) => ({
        ...item,
        index: idx
      }));
      this.playerHands.clear();
    }

    this.turnPlayerId = this.playerOrder[this.turnIndex % this.playerOrder.length];
  }

  /**
   * Process Player Move in Grid Matching Mode
   */
  handlePickChit(playerId, chitId) {
    if (this.status !== 'in_progress') {
      return { success: false, error: 'Game is not in progress' };
    }

    if (this.turnPlayerId !== playerId) {
      return { success: false, error: 'Not your turn!' };
    }

    const chit = this.boardChits.find(c => c.id === chitId);
    if (!chit) {
      return { success: false, error: 'Invalid chit selected' };
    }

    if (chit.isMatched) {
      return { success: false, error: 'Chit is already matched' };
    }

    if (this.currentPicks.includes(chitId)) {
      return { success: false, error: 'Chit is already selected' };
    }

    if (this.currentPicks.length >= 2) {
      return { success: false, error: 'Turn is resolving, please wait' };
    }

    chit.isRevealed = true;
    this.currentPicks.push(chitId);

    // 1st pick: Reveal and wait for 2nd pick
    if (this.currentPicks.length === 1) {
      return {
        success: true,
        action: 'first_pick',
        pickedChit: {
          id: chit.id,
          index: chit.index,
          typeId: chit.typeId,
          name: chit.name,
          emoji: chit.emoji,
          color: chit.color
        },
        turnPlayerId: this.turnPlayerId
      };
    }

    // 2nd pick: Evaluate match
    const firstChit = this.boardChits.find(c => c.id === this.currentPicks[0]);
    const secondChit = chit;
    const isMatch = firstChit.typeId === secondChit.typeId || firstChit.name.toLowerCase() === secondChit.name.toLowerCase();
    const player = this.players.get(playerId);

    if (isMatch) {
      // VALID MATCH!
      firstChit.isMatched = true;
      firstChit.matchedBy = playerId;
      secondChit.isMatched = true;
      secondChit.matchedBy = playerId;

      player.streak = (player.streak || 0) + 1;
      const pointsEarned = (firstChit.points || 1) + (player.streak > 1 ? this.scoringRules.streakBonus : 0);
      player.score += pointsEarned;
      player.roundScore += pointsEarned;
      player.matchesCount += 1;

      const matchedChitData = {
        typeId: firstChit.typeId,
        name: firstChit.name,
        emoji: firstChit.emoji,
        color: firstChit.color,
        points: pointsEarned,
        streak: player.streak
      };

      this.currentPicks = [];

      // Check if all chits are matched
      const remainingUnmatched = this.boardChits.filter(c => !c.isMatched);
      const isRoundFinished = remainingUnmatched.length === 0;

      let nextTurnPlayerId = this.turnPlayerId; // Retain turn on match
      let roundStatus = 'ongoing';

      if (isRoundFinished) {
        if (this.currentRound >= this.totalRounds) {
          this.endGame();
          roundStatus = 'game_over';
        } else {
          this.currentRound += 1;
          this.initializeRound();
          roundStatus = 'next_round';
        }
      }

      return {
        success: true,
        action: 'match_success',
        matched: true,
        chits: [firstChit.id, secondChit.id],
        matchData: matchedChitData,
        player: {
          id: player.id,
          name: player.name,
          score: player.score,
          streak: player.streak
        },
        roundStatus,
        nextTurnPlayerId,
        currentRound: this.currentRound
      };
    } else {
      // MISMATCH!
      player.streak = 0;
      
      firstChit.isRevealed = false;
      secondChit.isRevealed = false;
      this.currentPicks = [];

      this.nextTurn();

      return {
        success: true,
        action: 'match_failed',
        matched: false,
        chits: [firstChit.id, secondChit.id],
        revealed: [
          { id: firstChit.id, name: firstChit.name, emoji: firstChit.emoji, color: firstChit.color },
          { id: secondChit.id, name: secondChit.name, emoji: secondChit.emoji, color: secondChit.color }
        ],
        nextTurnPlayerId: this.turnPlayerId
      };
    }
  }

  /**
   * Pass chit in Chit Pass Mode
   */
  handlePassChit(playerId, chitId) {
    if (this.status !== 'in_progress' || this.mode !== 'chit_pass') {
      return { success: false, error: 'Invalid game mode or state' };
    }

    const hand = this.playerHands.get(playerId) || [];
    const chitIndex = hand.findIndex(c => c.id === chitId);
    if (chitIndex === -1) {
      return { success: false, error: 'Chit not in your hand' };
    }

    const [passedChit] = hand.splice(chitIndex, 1);
    this.passStaging.set(playerId, passedChit);

    const connectedPlayers = this.playerOrder.filter(id => this.players.get(id)?.connected);
    const allStaged = connectedPlayers.every(id => this.passStaging.has(id));

    if (allStaged) {
      connectedPlayers.forEach((pId, idx) => {
        const nextPlayerId = connectedPlayers[(idx + 1) % connectedPlayers.length];
        const chitToGive = this.passStaging.get(pId);
        const nextHand = this.playerHands.get(nextPlayerId) || [];
        nextHand.push(chitToGive);
      });
      this.passStaging.clear();

      return {
        success: true,
        action: 'pass_completed',
        playersUpdated: true
      };
    }

    return {
      success: true,
      action: 'pass_staged',
      stagedPlayerId: playerId
    };
  }

  /**
   * Claim MatchMates (4 of a kind) in Chit Pass Mode
   */
  handleClaimChittilu(playerId) {
    if (this.status !== 'in_progress') {
      return { success: false, error: 'Game is not in progress' };
    }

    const hand = this.playerHands.get(playerId) || [];
    if (hand.length !== 4) {
      return { success: false, error: 'You must have exactly 4 chits' };
    }

    const firstTypeId = hand[0].typeId;
    const isMatchMates = hand.every(c => c.typeId === firstTypeId);

    const player = this.players.get(playerId);

    if (isMatchMates) {
      player.score += this.scoringRules.chittiluBonus;
      player.roundScore += this.scoringRules.chittiluBonus;

      if (this.currentRound >= this.totalRounds) {
        this.endGame();
        return {
          success: true,
          action: 'chittilu_claimed',
          winnerId: playerId,
          chit: hand[0],
          gameEnded: true
        };
      } else {
        this.currentRound += 1;
        this.initializeRound();
        return {
          success: true,
          action: 'chittilu_claimed',
          roundWinnerId: playerId,
          chit: hand[0],
          gameEnded: false,
          currentRound: this.currentRound
        };
      }
    } else {
      player.score = Math.max(0, player.score - 1);
      return {
        success: false,
        error: 'False Claim! Chits do not match.'
      };
    }
  }

  /**
   * Advance to next turn
   */
  nextTurn() {
    const connectedPlayerIds = this.playerOrder.filter(id => this.players.get(id)?.connected);
    if (connectedPlayerIds.length === 0) return;

    this.turnIndex = (this.turnIndex + 1) % connectedPlayerIds.length;
    this.turnPlayerId = connectedPlayerIds[this.turnIndex];
    return this.turnPlayerId;
  }

  /**
   * End game and calculate final rankings
   */
  endGame() {
    this.status = 'game_over';
    const playerArray = Array.from(this.players.values());
    playerArray.sort((a, b) => b.score - a.score || b.matchesCount - a.matchesCount);

    this.rankings = playerArray.map((p, idx) => ({
      rank: idx + 1,
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      score: p.score,
      matchesCount: p.matchesCount,
      isWinner: idx === 0
    }));

    this.winner = this.rankings[0] || null;
    return this.rankings;
  }

  /**
   * Restart game
   */
  restartGame(newCustomChits = null) {
    this.status = 'waiting';
    this.currentRound = 1;
    this.winner = null;
    this.rankings = [];
    this.boardChits = [];
    this.playerHands.clear();
    this.currentPicks = [];

    if (newCustomChits) {
      this.configuredChits = this.normalizeCustomChits(newCustomChits);
    }
    
    this.players.forEach(p => {
      p.score = 0;
      p.roundScore = 0;
      p.matchesCount = 0;
      p.streak = 0;
      p.isReady = p.isHost;
    });

    return { success: true };
  }

  shufflePlayerOrder() {
    for (let i = this.playerOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.playerOrder[i], this.playerOrder[j]] = [this.playerOrder[j], this.playerOrder[i]];
    }
  }

  /**
   * Public Game State (strips secret card identities of unrevealed cards to prevent cheating)
   */
  getPublicGameState() {
    const sanitizedBoard = this.boardChits.map(chit => {
      if (chit.isRevealed || chit.isMatched) {
        return { ...chit };
      }
      return {
        id: chit.id,
        index: chit.index,
        isRevealed: false,
        isMatched: false,
        matchedBy: null
        // Hidden: typeId, name, emoji, color, copyNumber
      };
    });

    return {
      roomId: this.roomId,
      mode: this.mode,
      status: this.status,
      currentRound: this.currentRound,
      totalRounds: this.totalRounds,
      turnPlayerId: this.turnPlayerId,
      turnIndex: this.turnIndex,
      turnTimerSeconds: this.turnTimerSeconds,
      currentPicks: this.currentPicks,
      configuredChits: this.configuredChits,
      totalConfiguredChits: this.configuredChits.length * 4,
      boardChits: sanitizedBoard,
      players: Array.from(this.players.values()).map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        score: p.score,
        roundScore: p.roundScore,
        matchesCount: p.matchesCount,
        streak: p.streak,
        isReady: p.isReady,
        isHost: p.isHost,
        connected: p.connected
      })),
      playerOrder: this.playerOrder,
      winner: this.winner,
      rankings: this.rankings,
      passStagingCount: this.passStaging.size
    };
  }

  /**
   * Get Private Player State
   */
  getPlayerPrivateState(playerId) {
    const publicState = this.getPublicGameState();
    const hand = this.playerHands.get(playerId) || [];
    const hasStagedPass = this.passStaging.has(playerId);

    return {
      ...publicState,
      myHand: hand,
      hasStagedPass
    };
  }
}

module.exports = ChitGameEngine;
