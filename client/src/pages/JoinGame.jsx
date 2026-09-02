import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { LogIn, ArrowLeft, KeyRound, UserCheck, Clipboard, Sparkles } from 'lucide-react';
import { useGame } from '../store/GameContext';

export default function JoinGame() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { player, updatePlayer, joinRoom, addToast } = useGame();

  const codeFromUrl = searchParams.get('code') || '';
  const [name, setName] = useState(player.name);
  const [avatar, setAvatar] = useState(player.avatar);
  const [code, setCode] = useState(codeFromUrl.toUpperCase());
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (codeFromUrl) {
      setCode(codeFromUrl.toUpperCase());
    }
  }, [codeFromUrl]);

  const avatarsList = ['🍎', '🥭', '🍉', '🍌', '🍇', '🍊', '🍍', '🍓'];

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const sanitized = text.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
      setCode(sanitized);
    } catch {
      // Clipboard permissions denied
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your player name');
      return;
    }

    if (!code.trim() || code.trim().length < 4) {
      setErrorMsg('Please enter a valid 5-character Room Code');
      return;
    }

    try {
      setLoading(true);
      updatePlayer({ name: name.trim(), avatar });

      const sanitizedCode = code.trim().toUpperCase();
      const result = await joinRoom(sanitizedCode);

      if (result.success) {
        addToast(`Joined Room ${result.roomCode}!`, 'success');
        navigate(`/lobby/${result.roomCode}`);
      } else {
        setErrorMsg(result.error || 'Failed to join room');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Room not found. Check code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
        padding: '1rem 0'
      }}
    >
      <div
        className="glass-panel animate-bounce-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '2rem 1.75rem',
          position: 'relative'
        }}
      >
        {/* Back Link */}
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

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2
            style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              background: 'var(--brand-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.25rem'
            }}
          >
            Join Game
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
            Enter the 5-character room code shared by your friend
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            className="animate-shake"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#FCA5A5',
              fontSize: '0.88rem',
              marginBottom: '1.25rem',
              textAlign: 'center'
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Room Code */}
          <div className="input-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label">
                <KeyRound size={16} color="#FF9800" /> Room Code
              </label>
              <button
                type="button"
                onClick={handlePaste}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--fruit-mango)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontWeight: 600
                }}
              >
                <Clipboard size={12} /> Paste
              </button>
            </div>
            <input
              type="text"
              className="input-field"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5))}
              placeholder="e.g. A7K9P"
              maxLength={5}
              style={{
                textAlign: 'center',
                fontSize: '1.8rem',
                letterSpacing: '0.25em',
                fontWeight: 800,
                color: '#FFE082'
              }}
              required
            />
          </div>

          {/* Player Name */}
          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label">
              <UserCheck size={16} color="#2ED573" /> Your Name
            </label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul"
              maxLength={20}
              required
            />
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="input-label" style={{ marginBottom: '0.5rem' }}>
              Select Avatar
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {avatarsList.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setAvatar(em)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    border: avatar === em ? '2px solid var(--fruit-mango)' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: avatar === em ? 'rgba(255, 152, 0, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                    fontSize: '1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transform: avatar === em ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: avatar === em ? '0 0 10px rgba(255, 152, 0, 0.4)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? (
              'Connecting...'
            ) : (
              <>
                <LogIn size={20} /> Join Game
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
