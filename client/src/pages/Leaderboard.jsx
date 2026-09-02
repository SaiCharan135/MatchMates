import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Crown, Medal, Flame, Sparkles } from 'lucide-react';
import { fetchLeaderboard } from '../services/api';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchLeaderboard();
        setPlayers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '820px',
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
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              boxShadow: '0 8px 20px rgba(255, 215, 0, 0.4)',
              marginBottom: '0.5rem'
            }}
          >
            🏆
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              background: 'var(--brand-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.25rem'
            }}
          >
            MatchMates Leaderboard
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Top fruit champions ranked by match victories and win rates
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--fruit-mango)' }}>
            Loading rankings...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {players.map((p, idx) => {
              const isFirst = idx === 0;
              const isSecond = idx === 1;
              const isThird = idx === 2;

              let rankBadge = (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {idx + 1}
                </div>
              );

              if (isFirst) {
                rankBadge = (
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '1.2rem',
                      boxShadow: '0 0 12px rgba(255, 215, 0, 0.5)'
                    }}
                  >
                    🥇
                  </div>
                );
              } else if (isSecond) {
                rankBadge = (
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}
                  >
                    🥈
                  </div>
                );
              } else if (isThird) {
                rankBadge = (
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FDBA74 0%, #C2410C 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}
                  >
                    🥉
                  </div>
                );
              }

              return (
                <div
                  key={p.playerId || idx}
                  className="glass-card"
                  style={{
                    padding: '0.9rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isFirst
                      ? 'linear-gradient(90deg, rgba(255, 215, 0, 0.18) 0%, rgba(255, 152, 0, 0.1) 100%)'
                      : 'rgba(15, 23, 42, 0.5)',
                    border: isFirst ? '1.5px solid rgba(255, 215, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  {/* Left: Rank & Player */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    {rankBadge}

                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.6rem',
                        flexShrink: 0
                      }}
                    >
                      {p.avatar || '🍎'}
                    </div>

                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: isFirst ? '#FFE082' : 'white' }}>
                        {p.playerName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {p.gamesPlayed} Matches • {p.gamesWon} Wins
                      </div>
                    </div>
                  </div>

                  {/* Right: Stats Counters */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34D399' }}>
                        {p.winRate}%
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Win Rate</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FBBF24' }}>
                        {p.highestScore}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>High Score</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
