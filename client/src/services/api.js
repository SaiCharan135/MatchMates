const API_BASE = '/api';

export async function fetchLeaderboard(limit = 20) {
  try {
    const res = await fetch(`${API_BASE}/leaderboard?limit=${limit}`);
    const data = await res.json();
    return data.leaderboard || [];
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
    return [];
  }
}

export async function fetchUserProfile(playerId) {
  try {
    const res = await fetch(`${API_BASE}/users/${playerId}`);
    const data = await res.json();
    return data.profile || null;
  } catch (err) {
    console.error('Failed to fetch user profile:', err);
    return null;
  }
}

export async function fetchGameHistory() {
  try {
    const res = await fetch(`${API_BASE}/history`);
    const data = await res.json();
    return data.history || [];
  } catch (err) {
    console.error('Failed to fetch game history:', err);
    return [];
  }
}

export async function fetchFruits() {
  try {
    const res = await fetch(`${API_BASE}/fruits`);
    const data = await res.json();
    return data.fruits || [];
  } catch (err) {
    console.error('Failed to fetch fruits:', err);
    return [];
  }
}
