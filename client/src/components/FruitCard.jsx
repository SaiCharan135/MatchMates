import React from 'react';

export default function FruitCard({
  chit,
  onClick,
  isClickable,
  isRevealed,
  isMatched,
  isCurrentlyPicked
}) {
  const flipped = isRevealed || isMatched || isCurrentlyPicked;

  return (
    <div
      onClick={isClickable && !flipped ? onClick : undefined}
      style={{
        width: '100%',
        aspectRatio: '1 / 1.15',
        perspective: '1000px',
        cursor: isClickable && !flipped ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* CARD BACK (Hidden Folded Chit) */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
            border: isClickable
              ? '2px solid rgba(255, 152, 0, 0.5)'
              : '1.5px solid rgba(255, 255, 255, 0.1)',
            boxShadow: isClickable
              ? '0 6px 16px rgba(255, 122, 0, 0.25)'
              : '0 4px 10px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            transition: 'all 0.2s ease'
          }}
          className={isClickable ? 'chit-hover-card' : ''}
        >
          {/* Folded Paper Chit Motif */}
          <div
            style={{
              width: '60%',
              height: '60%',
              borderRadius: '8px',
              border: '2px dashed rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.03)',
              position: 'relative'
            }}
          >
            <span style={{ fontSize: '1.6rem', opacity: 0.7 }}>❓</span>
          </div>

          <span
            style={{
              marginTop: '0.4rem',
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: isClickable ? 'var(--fruit-mango)' : 'var(--text-muted)'
            }}
          >
            CHIT
          </span>
        </div>

        {/* CARD FRONT (Revealed Fruit) */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 'var(--radius-md)',
            background: chit.color
              ? `linear-gradient(145deg, ${chit.color}33, ${chit.color}99)`
              : 'linear-gradient(145deg, rgba(255,152,0,0.3), rgba(255,61,113,0.6))',
            border: isMatched
              ? '2.5px solid #2ED573'
              : '2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: isMatched
              ? '0 0 20px rgba(46, 213, 115, 0.6)'
              : '0 8px 20px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.4rem',
            overflow: 'hidden'
          }}
        >
          {/* Card Emoji or Icon */}
          <div
            style={{
              fontSize: chit.emoji ? '2.4rem' : '2rem',
              lineHeight: 1,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              transform: isMatched ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease',
              marginBottom: '0.2rem'
            }}
          >
            {chit.emoji || '🏷️'}
          </div>

          {/* Chit Name */}
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: (chit.name || chit.fruitName || '').length > 12 ? '0.78rem' : '0.9rem',
              color: '#FFFFFF',
              marginTop: '0.2rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
              textAlign: 'center',
              width: '90%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              letterSpacing: '0.02em'
            }}
          >
            {chit.name || chit.fruitName || 'Chit'}
          </span>

          {/* Matched Pill */}
          {isMatched && (
            <div
              style={{
                position: 'absolute',
                bottom: '4px',
                background: '#2ED573',
                color: '#0F172A',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
              }}
            >
              MATCHED ✓
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
