import React from 'react';
import { Sparkles, Eye, Zap } from 'lucide-react';

export default function TurnIndicator({
  isMyTurn,
  turnPlayerName,
  turnPlayerAvatar,
  currentRound = 1,
  totalRounds = 3,
  currentPicks = [],
  mode = 'chit_match'
}) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}
    >
      {/* Round & Mode Sub-header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--text-secondary)'
        }}
      >
        <span
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '2px 10px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          ROUND {currentRound} / {totalRounds}
        </span>

        <span
          style={{
            background: 'rgba(255, 152, 0, 0.15)',
            color: 'var(--fruit-mango)',
            padding: '2px 10px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255, 152, 0, 0.3)'
          }}
        >
          {mode === 'chit_pass' ? 'CHIT PASS MODE' : 'MATCHING MODE'}
        </span>
      </div>

      {/* Main Turn Banner */}
      <div
        style={{
          width: '100%',
          maxWidth: '650px',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          background: isMyTurn
            ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.3) 0%, rgba(255, 61, 113, 0.3) 100%)'
            : 'rgba(30, 41, 59, 0.7)',
          border: isMyTurn
            ? '2px solid rgba(255, 152, 0, 0.8)'
            : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isMyTurn
            ? '0 0 25px rgba(255, 152, 0, 0.45)'
            : '0 4px 12px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease'
        }}
        className={isMyTurn ? 'animate-pulse-glow' : ''}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: isMyTurn ? 'var(--brand-gradient)' : 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: isMyTurn ? '0 0 12px rgba(255, 122, 0, 0.5)' : 'none'
            }}
          >
            {isMyTurn ? '⚡' : turnPlayerAvatar || '👀'}
          </div>

          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                color: isMyTurn ? '#FFE082' : 'white',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              {isMyTurn ? (
                <>
                  <Sparkles size={18} color="#FFD700" /> It's YOUR Turn!
                </>
              ) : (
                <>
                  <Eye size={18} color="#94A3B8" /> {turnPlayerName}'s Turn
                </>
              )}
            </h3>
            <p
              style={{
                fontSize: '0.82rem',
                color: isMyTurn ? '#FFF3E0' : 'var(--text-muted)',
                margin: 0,
                fontWeight: 500
              }}
            >
              {isMyTurn
                ? currentPicks.length === 1
                  ? 'Pick second chit to match!'
                  : 'Flip any 2 hidden fruit chits on the board'
                : 'Waiting for player to flip chits...'}
            </p>
          </div>
        </div>

        {/* Current Turn Pick Indicator */}
        {mode === 'chit_match' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: currentPicks.length >= 1 ? '#FF9800' : 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: currentPicks.length >= 1 ? '0 0 8px #FF9800' : 'none'
              }}
            />
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: currentPicks.length >= 2 ? '#FF3D71' : 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: currentPicks.length >= 2 ? '0 0 8px #FF3D71' : 'none'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
