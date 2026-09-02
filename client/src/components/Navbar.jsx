import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGame } from '../store/GameContext';
import { Volume2, VolumeX, Trophy, History, HelpCircle, User, Sparkles, Home as HomeIcon } from 'lucide-react';

export default function Navbar() {
  const { player, roomCode, isMuted, toggleSound, gameState } = useGame();
  const location = useLocation();

  return (
    <header className="navbar-container" style={{
      width: '100%',
      padding: '0.85rem 1.25rem',
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'var(--brand-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          boxShadow: '0 4px 12px rgba(255, 122, 0, 0.35)'
        }}>
          🥭
        </div>
        <div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            background: 'var(--brand-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            MatchMates
          </span>
        </div>
      </Link>

      {/* Room Badge if in active room */}
      {roomCode && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 152, 0, 0.15)',
          border: '1px solid rgba(255, 152, 0, 0.35)',
          padding: '0.35rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <span style={{ color: 'var(--fruit-mango)' }}>ROOM:</span>
          <span style={{ color: 'white', letterSpacing: '0.08em', fontWeight: 800 }}>{roomCode}</span>
          {gameState?.status === 'in_progress' && (
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#2ED573',
              boxShadow: '0 0 8px #2ED573'
            }} />
          )}
        </div>
      )}

      {/* Navigation Links & Action Controls */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link
          to="/how-to-play"
          title="How to Play"
          className="btn btn-secondary btn-icon"
          style={{
            fontSize: '1.1rem',
            background: location.pathname === '/how-to-play' ? 'rgba(255, 152, 0, 0.25)' : undefined
          }}
        >
          <HelpCircle size={18} />
        </Link>

        <Link
          to="/leaderboard"
          title="Leaderboard"
          className="btn btn-secondary btn-icon"
          style={{
            fontSize: '1.1rem',
            background: location.pathname === '/leaderboard' ? 'rgba(255, 152, 0, 0.25)' : undefined
          }}
        >
          <Trophy size={18} />
        </Link>

        <Link
          to="/history"
          title="Game History"
          className="btn btn-secondary btn-icon"
          style={{
            fontSize: '1.1rem',
            background: location.pathname === '/history' ? 'rgba(255, 152, 0, 0.25)' : undefined
          }}
        >
          <History size={18} />
        </Link>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="btn btn-secondary btn-icon"
        >
          {isMuted ? <VolumeX size={18} color="#94A3B8" /> : <Volume2 size={18} color="#FF9800" />}
        </button>

        {/* Profile Pill */}
        <Link
          to="/profile"
          title="My Profile"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '0.3rem 0.75rem 0.3rem 0.4rem',
            borderRadius: 'var(--radius-full)',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>{player.avatar}</span>
          <span style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            maxWidth: '90px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {player.name}
          </span>
        </Link>
      </nav>
    </header>
  );
}
