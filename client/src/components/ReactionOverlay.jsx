import React from 'react';
import { useGame } from '../store/GameContext';

export default function ReactionOverlay() {
  const { activeReactions } = useGame();

  if (activeReactions.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 150,
        overflow: 'hidden'
      }}
    >
      {activeReactions.map((rx, idx) => (
        <div
          key={rx.id}
          className="animate-slide-up"
          style={{
            position: 'absolute',
            bottom: '4rem',
            right: `${2 + (idx % 4) * 4}rem`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 152, 0, 0.4)',
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem 0.85rem',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
            animation: 'floatingParticle 3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <span style={{ fontSize: '1.6rem' }}>{rx.emoji}</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FDBA74' }}>
            {rx.senderName}
          </span>
        </div>
      ))}
    </div>
  );
}
