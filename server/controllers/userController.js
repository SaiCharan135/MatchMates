const dbService = require('../services/dbService');

exports.getUserProfile = async (req, res) => {
  try {
    const { playerId } = req.params;
    if (!playerId) {
      return res.status(400).json({ success: false, error: 'Player ID is required' });
    }

    const profile = await dbService.getUserProfile(playerId);
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const leaderboard = await dbService.getLeaderboard(limit);
    res.json({ success: true, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
