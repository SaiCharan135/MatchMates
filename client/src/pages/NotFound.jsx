import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 140px)',
        textAlign: 'center',
        padding: '2rem 1rem'
      }}
    >
      <div
        className="glass-panel animate-bounce-in"
        style={{
          padding: '2.5rem 2rem',
          maxWidth: '460px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <div style={{ fontSize: '4rem' }} className="animate-float">
          🥥
        </div>

        <h1
          style={{
            fontSize: '4.5rem',
            fontWeight: 900,
            lineHeight: 1,
            background: 'var(--brand-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}
        >
          404
        </h1>

        <h2 style={{ fontSize: '1.4rem', color: 'white', margin: 0 }}>
          Oops! Fruit Not Found
        </h2>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0 }}>
          This page or game room seems to have rolled away into the orchard.
        </p>

        <Link to="/" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          <Home size={18} /> Return to Home
        </Link>
      </div>
    </div>
  );
}
