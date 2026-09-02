import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, ArrowLeft, Trophy, Calendar, Users, Sparkles } from 'lucide-react';
import { fetchGameHistory } from '../services/api';

export default function GameHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGameHistory();
        setHistory(data);
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
        maxWidth: '780px',
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
          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              background: 'var(--brand-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.25rem'
            }}
          >
            Game History
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0 }}>
            Recent matches, champions, and score logs
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--fruit-mango)' }}>
            Loading game logs...
          </div>
        ) : history.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              background: 'rgba(15, 23, 42, 0.4)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📜</div>
            <h3 style={{ color: 'white', marginBottom: '0.25rem' }}>No matches recorded yet</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Complete your first MatchMates match to see your game timeline!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.map((game) => (
              <div
                key={game.id || game._id}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                {/* Match Summary Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        background: 'rgba(255, 152, 0, 0.2)',
                        color: '#FFA726',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        letterSpacing: '0.05em'
                      }}
                    >
                      ROOM: {game.roomCode}
                    </span>

                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {game.mode === 'chit_pass' ? 'Chit Pass' : 'Fruit Match'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Calendar size={13} />
                    {new Date(game.playedAt).toLocaleDateString()} at {new Date(game.playedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Winner Callout */}
                {game.winner && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      background: 'rgba(255, 215, 0, 0.12)',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <Trophy size={16} color="#FFD700" />
                    <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>
                      Winner: <strong style={{ color: '#FFE082' }}>{game.winner.name}</strong> ({game.winner.avatar}) with {game.winner.score} pts
                    </span>
                  </div>
                )}

                {/* Participants Pills */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {game.players?.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.82rem'
                      }}
                    >
                      <span>{p.avatar}</span>
                      <span style={{ color: 'white', fontWeight: 500 }}>{p.name}:</span>
                      <strong style={{ color: '#FDBA74' }}>{p.score}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
