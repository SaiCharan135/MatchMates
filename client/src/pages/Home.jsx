import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, LogIn, HelpCircle, Trophy, Sparkles, Users, Zap, ShieldCheck, ArrowRight, Flame } from 'lucide-react';
import { useGame } from '../store/GameContext';

export default function Home() {
  const navigate = useNavigate();
  const { player, createRoom, joinRoom, addToast } = useGame();
  const [quickCode, setQuickCode] = useState('');
  const [creatingInstant, setCreatingInstant] = useState(false);
  const [joining, setJoining] = useState(false);

  const handleInstantRoom = async () => {
    try {
      setCreatingInstant(true);
      const res = await createRoom({
        maxPlayers: 6,
        mode: 'chit_match',
        totalRounds: 3
      });
      if (res.success) {
        addToast(`Room ${res.roomCode} created!`, 'success');
        navigate(`/lobby/${res.roomCode}`);
      }
    } catch (err) {
      addToast(err.message || 'Failed to create room', 'error');
    } finally {
      setCreatingInstant(false);
    }
  };

  const handleQuickJoin = async (e) => {
    e.preventDefault();
    if (!quickCode.trim() || quickCode.trim().length < 4) {
      addToast('Enter a valid 5-character Room Code', 'warning');
      return;
    }
    try {
      setJoining(true);
      const sanitized = quickCode.trim().toUpperCase();
      const res = await joinRoom(sanitized);
      if (res.success) {
        addToast(`Joined Room ${res.roomCode}!`, 'success');
        navigate(`/lobby/${res.roomCode}`);
      }
    } catch (err) {
      addToast(err.message || 'Room not found. Check code!', 'error');
    } finally {
      setJoining(false);
    }
  };

  const floatingFruits = [
    { emoji: '🥭', top: '12%', left: '8%', delay: '0s', size: '3.5rem' },
    { emoji: '🍎', top: '18%', right: '10%', delay: '1s', size: '3rem' },
    { emoji: '🍉', bottom: '20%', left: '12%', delay: '2s', size: '3.8rem' },
    { emoji: '🍌', bottom: '15%', right: '14%', delay: '1.5s', size: '3.2rem' },
    { emoji: '🍇', top: '45%', right: '5%', delay: '0.5s', size: '2.8rem' },
    { emoji: '🍓', top: '55%', left: '4%', delay: '2.5s', size: '2.6rem' }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
        position: 'relative',
        textAlign: 'center',
        padding: '1rem 0'
      }}
    >
      {/* Floating Background Fruit Motifs */}
      {floatingFruits.map((item, idx) => (
        <div
          key={idx}
          className="animate-float"
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            fontSize: item.size,
            animationDelay: item.delay,
            opacity: 0.75,
            pointerEvents: 'none',
            userSelect: 'none',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Hero Content Card */}
      <div
        className="glass-panel animate-bounce-in"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '2.5rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 10,
          background: 'rgba(30, 41, 59, 0.88)',
          border: '1.5px solid rgba(255, 152, 0, 0.35)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(255, 122, 0, 0.25)'
        }}
      >
        {/* Mascot & Title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '24px',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.2rem',
              boxShadow: '0 10px 25px rgba(255, 122, 0, 0.45)',
              transform: 'rotate(-5deg)',
              marginBottom: '0.25rem'
            }}
          >
            🥭
          </div>

          <h1
            style={{
              fontSize: '3.2rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              lineHeight: 1,
              background: 'var(--brand-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 8px 24px rgba(255, 122, 0, 0.3)'
            }}
          >
            MatchMates
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              color: 'var(--text-accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              margin: 0
            }}
          >
            <Sparkles size={18} color="#FF9800" /> Play With Your Friends
          </p>

          <p
            style={{
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
              maxWidth: '420px',
              margin: 0
            }}
          >
            The fast & playful multiplayer fruit matching game. Pick hidden cards, match twins, build streaks, and win together!
          </p>
        </div>

        {/* 1-Click Instant Room Banner Button */}
        <button
          onClick={handleInstantRoom}
          disabled={creatingInstant}
          className="btn btn-primary btn-lg"
          style={{
            width: '100%',
            maxWidth: '380px',
            fontSize: '1.22rem',
            padding: '1.1rem 1.5rem',
            boxShadow: '0 8px 30px rgba(255, 122, 0, 0.5)'
          }}
        >
          <Zap size={22} color="#FFE082" />
          {creatingInstant ? 'Generating Room...' : '⚡ Quick Room (1-Tap Create)'}
        </button>

        {/* Quick Join Inline Form */}
        <form
          onSubmit={handleQuickJoin}
          style={{
            width: '100%',
            maxWidth: '380px',
            display: 'flex',
            gap: '0.4rem',
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '0.4rem',
            borderRadius: 'var(--radius-full)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)'
          }}
        >
          <input
            type="text"
            placeholder="Room Code (e.g. A7K9P)"
            value={quickCode}
            onChange={(e) => setQuickCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5))}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: '#FFE082',
              fontWeight: 800,
              fontSize: '1.1rem',
              letterSpacing: '0.12em',
              textAlign: 'center',
              outline: 'none',
              paddingLeft: '0.75rem'
            }}
            maxLength={5}
          />

          <button
            type="submit"
            disabled={joining || !quickCode.trim()}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.25rem' }}
          >
            {joining ? 'Joining...' : <><LogIn size={16} /> Join</>}
          </button>
        </form>

        {/* Action Secondary Links */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            width: '100%',
            maxWidth: '380px'
          }}
        >
          <Link
            to="/create"
            className="btn btn-secondary"
            style={{ flex: 1, fontSize: '0.95rem', padding: '0.75rem 0.5rem' }}
          >
            <PlusCircle size={16} /> Custom Room
          </Link>

          <Link
            to="/how-to-play"
            className="btn btn-secondary"
            style={{ flex: 1, fontSize: '0.95rem', padding: '0.75rem 0.5rem', background: 'rgba(255, 255, 255, 0.04)' }}
          >
            <HelpCircle size={16} /> How to Play
          </Link>
        </div>

        {/* User Pill / Greeting */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}
        >
          <span>Playing as:</span>
          <span style={{ fontSize: '1.2rem' }}>{player.avatar}</span>
          <strong style={{ color: 'white' }}>{player.name}</strong>
          <Link
            to="/profile"
            style={{ color: 'var(--fruit-mango)', fontSize: '0.8rem', marginLeft: '0.2rem' }}
          >
            (Change)
          </Link>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          width: '100%',
          maxWidth: '780px',
          marginTop: '2.5rem',
          zIndex: 10
        }}
      >
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Users size={18} color="#FF9800" />
            <h4 style={{ fontSize: '1rem', color: 'white' }}>2–8 Players</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Play instantly in rooms with friends on any phone, tablet, or PC.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Zap size={18} color="#2ED573" />
            <h4 style={{ fontSize: '1rem', color: 'white' }}>Real-time Turns</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Zero-latency live synchronization powered by Socket.IO.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <ShieldCheck size={18} color="#9B51E0" />
            <h4 style={{ fontSize: '1rem', color: 'white' }}>Anti-Cheat Engine</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Hidden fruit chits are stored authoritatively on the server.
          </p>
        </div>
      </div>
    </div>
  );
}
