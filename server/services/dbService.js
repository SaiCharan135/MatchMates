const mongoose = require('mongoose');

class DatabaseService {
  constructor() {
    this.isConnected = false;
    this.isUsingMemoryFallback = false;
    
    // In-memory fallback stores
    this.memoryUsers = new Map();
    this.memoryGames = new Map();
    this.memoryGameHistory = [];
  }

  async connect(uri) {
    if (!uri) {
      console.log('ℹ️  No MONGODB_URI provided. Initialized in-memory storage fallback.');
      this.isUsingMemoryFallback = true;
      this.seedInitialLeaderboard();
      return;
    }

    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 2500
      });
      this.isConnected = true;
      console.log('✅ Connected to MongoDB successfully.');
    } catch (err) {
      console.warn(`⚠️  MongoDB connection failed (${err.message}). Falling back to in-memory store.`);
      this.isUsingMemoryFallback = true;
      this.seedInitialLeaderboard();
    }
  }

  seedInitialLeaderboard() {
    // Seed some fun friendly records so leaderboard has initial life
    const demoRecords = [
      { playerId: 'usr_sai', playerName: 'Sai (Master)', avatar: '🥭', gamesPlayed: 14, gamesWon: 11, totalScore: 92, highestScore: 16 },
      { playerId: 'usr_rahul', playerName: 'Rahul', avatar: '🍎', gamesPlayed: 12, gamesWon: 8, totalScore: 68, highestScore: 12 },
      { playerId: 'usr_kiran', playerName: 'Kiran', avatar: '🍇', gamesPlayed: 10, gamesWon: 6, totalScore: 54, highestScore: 10 },
      { playerId: 'usr_arjun', playerName: 'Arjun', avatar: '🍉', gamesPlayed: 8, gamesWon: 4, totalScore: 36, highestScore: 9 },
      { playerId: 'usr_ananya', playerName: 'Ananya', avatar: '🍓', gamesPlayed: 6, gamesWon: 3, totalScore: 28, highestScore: 8 }
    ];

    demoRecords.forEach(rec => {
      this.memoryUsers.set(rec.playerId, {
        ...rec,
        winRate: Math.round((rec.gamesWon / rec.gamesPlayed) * 100),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
  }

  async recordGameResult(gameData) {
    const { roomCode, mode, players, winner, totalRounds, chitSet } = gameData;

    // Save Game History
    const historyEntry = {
      id: `gh_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      roomCode,
      mode,
      totalRounds,
      chitSet: chitSet || { name: 'Custom Chits', items: [] },
      winner: winner ? { id: winner.id, name: winner.name, avatar: winner.avatar, score: winner.score } : null,
      players: players.map(p => ({ id: p.id, name: p.name, avatar: p.avatar, score: p.score, matchesCount: p.matchesCount })),
      playedAt: new Date()
    };

    if (this.isConnected) {
      try {
        const GameHistoryModel = require('../models/GameHistory');
        const UserModel = require('../models/User');

        await GameHistoryModel.create(historyEntry);

        // Update User Profiles
        for (const p of players) {
          const isWinner = winner && winner.id === p.id;
          await UserModel.findOneAndUpdate(
            { playerId: p.id },
            {
              $setOnInsert: { playerId: p.id, createdAt: new Date() },
              $set: { playerName: p.name, avatar: p.avatar, updatedAt: new Date() },
              $inc: {
                gamesPlayed: 1,
                gamesWon: isWinner ? 1 : 0,
                totalScore: p.score
              },
              $max: { highestScore: p.score }
            },
            { upsert: true, new: true }
          );
        }
        return historyEntry;
      } catch (err) {
        console.error('Error saving to MongoDB, writing to memory fallback:', err.message);
      }
    }

    // In-memory fallback
    this.memoryGameHistory.unshift(historyEntry);
    if (this.memoryGameHistory.length > 100) this.memoryGameHistory.pop();

    players.forEach(p => {
      const isWinner = winner && winner.id === p.id;
      const existing = this.memoryUsers.get(p.id) || {
        playerId: p.id,
        playerName: p.name,
        avatar: p.avatar,
        gamesPlayed: 0,
        gamesWon: 0,
        totalScore: 0,
        highestScore: 0,
        createdAt: new Date()
      };

      existing.playerName = p.name;
      existing.avatar = p.avatar;
      existing.gamesPlayed += 1;
      if (isWinner) existing.gamesWon += 1;
      existing.totalScore += p.score;
      existing.highestScore = Math.max(existing.highestScore, p.score);
      existing.winRate = Math.round((existing.gamesWon / existing.gamesPlayed) * 100);
      existing.updatedAt = new Date();

      this.memoryUsers.set(p.id, existing);
    });

    return historyEntry;
  }

  async getLeaderboard(limit = 20) {
    if (this.isConnected) {
      try {
        const UserModel = require('../models/User');
        const users = await UserModel.find({})
          .sort({ gamesWon: -1, totalScore: -1 })
          .limit(limit)
          .lean();

        return users.map((u, i) => ({
          rank: i + 1,
          playerId: u.playerId,
          playerName: u.playerName,
          avatar: u.avatar,
          gamesPlayed: u.gamesPlayed,
          gamesWon: u.gamesWon,
          winRate: u.gamesPlayed ? Math.round((u.gamesWon / u.gamesPlayed) * 100) : 0,
          totalScore: u.totalScore,
          highestScore: u.highestScore
        }));
      } catch (err) {
        console.error('Error fetching MongoDB leaderboard:', err.message);
      }
    }

    // Memory fallback
    const users = Array.from(this.memoryUsers.values())
      .sort((a, b) => b.gamesWon - a.gamesWon || b.totalScore - a.totalScore)
      .slice(0, limit);

    return users.map((u, i) => ({
      rank: i + 1,
      ...u,
      winRate: u.gamesPlayed ? Math.round((u.gamesWon / u.gamesPlayed) * 100) : 0
    }));
  }

  async getUserProfile(playerId) {
    if (this.isConnected) {
      try {
        const UserModel = require('../models/User');
        const GameHistoryModel = require('../models/GameHistory');
        
        const user = await UserModel.findOne({ playerId }).lean();
        const recentGames = await GameHistoryModel.find({ 'players.id': playerId })
          .sort({ playedAt: -1 })
          .limit(5)
          .lean();

        if (user) {
          return {
            ...user,
            winRate: user.gamesPlayed ? Math.round((user.gamesWon / user.gamesPlayed) * 100) : 0,
            recentGames
          };
        }
      } catch (err) {
        console.error('Error fetching MongoDB user profile:', err.message);
      }
    }

    const user = this.memoryUsers.get(playerId) || {
      playerId,
      playerName: 'Player',
      avatar: '🍎',
      gamesPlayed: 0,
      gamesWon: 0,
      winRate: 0,
      totalScore: 0,
      highestScore: 0
    };

    const recentGames = this.memoryGameHistory
      .filter(gh => gh.players.some(p => p.id === playerId))
      .slice(0, 5);

    return {
      ...user,
      recentGames
    };
  }

  async getGameHistory(limit = 20) {
    if (this.isConnected) {
      try {
        const GameHistoryModel = require('../models/GameHistory');
        return await GameHistoryModel.find({})
          .sort({ playedAt: -1 })
          .limit(limit)
          .lean();
      } catch (err) {
        console.error('Error fetching MongoDB history:', err.message);
      }
    }

    return this.memoryGameHistory.slice(0, limit);
  }
}

module.exports = new DatabaseService();
