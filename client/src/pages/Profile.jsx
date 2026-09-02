import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, User, Trophy, Flame, Target, Award, Sparkles } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { fetchUserProfile } from '../services/api';

export default function Profile() {
  const { player, updatePlayer, addToast, DEFAULT_AVATARS } = useGame();
  const [name, setName] = useState(player.name);
  const [avatar, setAvatar] = useState(player.avatar);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const profileData = await fetchUserProfile(player.id);
        if (profileData) {
          setStats(profileData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [player.id]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Name cannot be empty', 'error');
      return;
    }
    updatePlayer({ name: name.trim(), avatar });
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
        padding: '1rem 0'
      }}
    >
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontSize: '0.9rem',
          marginBottom: '1rem',
          fontWeight: 600
        }}
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="glass-panel" style={{ padding: '2rem 1.75rem' }}>
        {/* Profile Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            marginBottom: '2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '1.5rem'
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.2rem',
              boxShadow: '0 8px 24px rgba(255, 122, 0, 0.4)',
              flexShrink: 0
            }}
          >
            {avatar}
          </div>

          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', margin: 0 }}>
              {name}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--fruit-mango)', margin: '0.2rem 0 0' }}>
              MatchMates Player ID: <span style={{ opacity: 0.7 }}>{player.id}</span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              letterSpacing: '0.05em',
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Trophy size={16} color="#FF9800" /> PLAYER STATS
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem'
            }}
          >
            <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>
                {stats?.gamesPlayed || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Games Played
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34D399' }}>
                {stats?.gamesWon || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Victories 🏆
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FBBF24' }}>
                {stats?.winRate || (stats?.gamesPlayed ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0)}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Win Rate
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F472B6' }}>
                {stats?.highestScore || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Highest Score
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label">Edit Display Name</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              required
            />
          </div>

          <div>
            <label className="input-label" style={{ marginBottom: '0.5rem' }}>
              Choose Fruit Avatar
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {DEFAULT_AVATARS.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setAvatar(em)}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    border: avatar === em ? '2px solid var(--fruit-mango)' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: avatar === em ? 'rgba(255, 152, 0, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                    fontSize: '1.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transform: avatar === em ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: avatar === em ? '0 0 12px rgba(255, 152, 0, 0.4)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            <Save size={18} /> Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
}
