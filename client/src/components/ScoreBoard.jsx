import React from 'react';
import { Crown, Flame, WifiOff, CheckCircle2, Clock } from 'lucide-react';

export default function ScoreBoard({
  players = [],
  turnPlayerId = null,
  currentPlayerId = null
}) {
  // Sort by score descending
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const highestScore = sortedPlayers.length > 0 ? sortedPlayers[0].score : 0;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1rem',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.5rem'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: 'var(--text-secondary)'
          }}
        >
          PLAYERS ({players.length})
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          SCORE
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxHeight: '260px',
          overflowY: 'auto'
        }}
      >
        {sortedPlayers.map((p) => {
          const isTurn = p.id === turnPlayerId;
          const isMe = p.id === currentPlayerId;
          const isLeader = p.score > 0 && p.score === highestScore;

          return (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                background: isTurn
                  ? 'linear-gradient(90deg, rgba(255, 152, 0, 0.22) 0%, rgba(255, 61, 113, 0.15) 100%)'
                  : isMe
                  ? 'rgba(255, 255, 255, 0.06)'
                  : 'rgba(15, 23, 42, 0.4)',
                border: isTurn
                  ? '1.5px solid rgba(255, 152, 0, 0.6)'
                  : '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: isTurn ? '0 0 14px rgba(255, 152, 0, 0.3)' : 'none',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {/* Left: Avatar & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    position: 'relative',
                    flexShrink: 0
                  }}
                >
                  {p.avatar}
                  {isLeader && (
                    <Crown
                      size={14}
                      color="#FFD700"
                      style={{
                        position: 'absolute',
                        top: -7,
                        right: -3,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))'
                      }}
                    />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        color: isMe ? 'var(--fruit-mango)' : 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {p.name} {isMe && '(You)'}
                    </span>
                    {p.isHost && (
                      <span className="badge badge-host" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                        HOST
                      </span>
                    )}
                  </div>

                  {/* Streak & Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {p.streak > 1 && (
                      <span style={{ color: '#FF7A00', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
                        <Flame size={12} color="#FF7A00" /> {p.streak}x
                      </span>
                    )}
                    {isTurn && (
                      <span style={{ color: '#FFE082', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Clock size={11} /> Thinking...
                      </span>
                    )}
                    {!p.connected && (
                      <span style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <WifiOff size={11} /> Away
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Score Counter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: isTurn ? '#FFE082' : 'white',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {p.score || 0}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
