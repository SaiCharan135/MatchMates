import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Users, Gamepad2, Layers, Sparkles, CheckCircle2, ArrowRight, Settings, Edit3 } from 'lucide-react';
import { useGame } from '../store/GameContext';
import ChitCustomizer from '../components/ChitCustomizer';

const DEFAULT_FRUITS_CHITS = [
  { id: 'apple', name: 'Apple', emoji: '🍎', color: '#FF4D4D', quantity: 4 },
  { id: 'banana', name: 'Banana', emoji: '🍌', color: '#FFD700', quantity: 4 },
  { id: 'mango', name: 'Mango', emoji: '🥭', color: '#FF9800', quantity: 4 },
  { id: 'grapes', name: 'Grapes', emoji: '🍇', color: '#9B51E0', quantity: 4 },
  { id: 'watermelon', name: 'Watermelon', emoji: '🍉', color: '#27AE60', quantity: 4 },
  { id: 'orange', name: 'Orange', emoji: '🍊', color: '#FFA500', quantity: 4 }
];

export default function CreateGame() {
  const navigate = useNavigate();
  const { player, updatePlayer, createRoom, addToast } = useGame();

  // Wizard Step: 1 = Settings, 2 = Custom Chits, 3 = Review
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState(player.name);
  const [avatar, setAvatar] = useState(player.avatar);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [mode, setMode] = useState('chit_match');
  const [totalRounds, setTotalRounds] = useState(3);
  const [customChits, setCustomChits] = useState(DEFAULT_FRUITS_CHITS);
  const [loading, setLoading] = useState(false);

  const avatarsList = ['🍎', '🥭', '🍉', '🍌', '🍇', '🍊', '🍍', '🍓'];

  const handleNextToChits = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Please enter your player name', 'error');
      return;
    }
    updatePlayer({ name: name.trim(), avatar });
    setStep(2);
  };

  const handleNextToReview = () => {
    if (customChits.length < 4) {
      addToast('Please configure at least 4 unique chit types', 'error');
      return;
    }
    setStep(3);
  };

  const handleFinalCreateRoom = async () => {
    try {
      setLoading(true);
      updatePlayer({ name: name.trim(), avatar });

      const result = await createRoom({
        maxPlayers,
        mode,
        totalRounds,
        customChits
      });

      if (result.success) {
        addToast(`Room created: ${result.roomCode}!`, 'success');
        navigate(`/lobby/${result.roomCode}`);
      }
    } catch (err) {
      addToast(err.message || 'Failed to create room', 'error');
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
          maxWidth: '580px',
          padding: '2rem 1.75rem',
          position: 'relative'
        }}
      >
        {/* Back Link */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          {step === 1 ? (
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} /> Back to Step {step - 1}
            </button>
          )}

          {/* Step Progress Pills */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: step === s ? 'var(--brand-gradient)' : step > s ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  boxShadow: step === s ? '0 0 10px rgba(255, 122, 0, 0.5)' : 'none'
                }}
              >
                {step > s ? '✓' : s}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: GAME SETTINGS */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  background: 'var(--brand-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.25rem'
                }}
              >
                Step 1: Game Settings
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                Set your player details, player limits, and game mode
              </p>
            </div>

            <form onSubmit={handleNextToChits} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Player Name */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Your Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sai"
                  maxLength={20}
                  required
                />
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="input-label" style={{ marginBottom: '0.4rem' }}>
                  Choose Your Avatar
                </label>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {avatarsList.map((em) => (
                    <button
                      type="button"
                      key={em}
                      onClick={() => setAvatar(em)}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        border: avatar === em ? '2px solid var(--fruit-mango)' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: avatar === em ? 'rgba(255, 152, 0, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transform: avatar === em ? 'scale(1.08)' : 'scale(1)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Players Selector */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">
                  <Users size={16} color="#FF9800" /> Maximum Players (2–8)
                </label>
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  {[2, 4, 6, 8].map((count) => (
                    <button
                      type="button"
                      key={count}
                      onClick={() => setMaxPlayers(count)}
                      style={{
                        flex: 1,
                        padding: '0.65rem 0',
                        borderRadius: 'var(--radius-md)',
                        border: maxPlayers === count ? '2px solid var(--fruit-mango)' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: maxPlayers === count ? 'rgba(255, 152, 0, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                        color: maxPlayers === count ? '#FFE082' : 'white',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        cursor: 'pointer'
                      }}
                    >
                      {count}P
                    </button>
                  ))}
                </div>
              </div>

              {/* Game Mode */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">
                  <Gamepad2 size={16} color="#2ED573" /> Game Mode
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div
                    onClick={() => setMode('chit_match')}
                    style={{
                      padding: '0.75rem 0.9rem',
                      borderRadius: 'var(--radius-md)',
                      border: mode === 'chit_match' ? '2px solid #2ED573' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: mode === 'chit_match' ? 'rgba(46, 213, 115, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>
                        🃏 Grid Matching Mode
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Flip hidden chits on the board to find matching twins!
                      </div>
                    </div>
                    {mode === 'chit_match' && <span style={{ color: '#2ED573', fontWeight: 800 }}>✓</span>}
                  </div>

                  <div
                    onClick={() => setMode('chit_pass')}
                    style={{
                      padding: '0.75rem 0.9rem',
                      borderRadius: 'var(--radius-md)',
                      border: mode === 'chit_pass' ? '2px solid #9B51E0' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: mode === 'chit_pass' ? 'rgba(155, 81, 224, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>
                        🔄 Social Chit Pass Mode
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Pass chits clockwise until someone collects 4 of a kind!
                      </div>
                    </div>
                    {mode === 'chit_pass' && <span style={{ color: '#9B51E0', fontWeight: 800 }}>✓</span>}
                  </div>
                </div>
              </div>

              {/* Total Rounds */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">
                  <Layers size={16} color="#3B82F6" /> Total Rounds
                </label>
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  {[1, 3, 5].map((rounds) => (
                    <button
                      type="button"
                      key={rounds}
                      onClick={() => setTotalRounds(rounds)}
                      style={{
                        flex: 1,
                        padding: '0.55rem 0',
                        borderRadius: 'var(--radius-md)',
                        border: totalRounds === rounds ? '2px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: totalRounds === rounds ? 'rgba(59, 130, 246, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                        color: totalRounds === rounds ? '#93C5FD' : 'white',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      {rounds} {rounds === 1 ? 'Round' : 'Rounds'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                Next: Customize Chits <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: CUSTOMIZE CHITS */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <h2
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  background: 'var(--brand-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.25rem'
                }}
              >
                Step 2: Customize Your Chits
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                Add any names or items. Each item automatically creates <strong>4 physical chits (×4)</strong>!
              </p>
            </div>

            <ChitCustomizer
              chits={customChits}
              onChange={setCustomChits}
              onContinue={handleNextToReview}
              minTypes={4}
              maxTypes={20}
              showContinueButton={true}
              continueLabel="Review Game Setup"
            />
          </div>
        )}

        {/* STEP 3: REVIEW CHITS & CREATE ROOM */}
        {step === 3 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  background: 'var(--brand-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.25rem'
                }}
              >
                Step 3: Review & Confirm
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                Review your game configuration before launching the lobby
              </p>
            </div>

            {/* Summary Box */}
            <div
              className="glass-card"
              style={{
                padding: '1.25rem',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1.5px solid rgba(255, 152, 0, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Host:</span> <strong>{name} {avatar}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Players:</span> <strong>Max {maxPlayers} Players</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Mode:</span> <strong>{mode === 'chit_pass' ? 'Chit Pass' : 'Grid Match'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Rounds:</span> <strong>{totalRounds} Rounds</strong>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFE082' }}>
                    CONFIGURED CHITS ({customChits.length} Types • {customChits.length * 4} Chits)
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{ background: 'none', border: 'none', color: 'var(--fruit-mango)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', maxHeight: '140px', overflowY: 'auto' }}>
                  {customChits.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'rgba(255, 255, 255, 0.08)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.82rem'
                      }}
                    >
                      <span>{c.emoji || '🏷️'}</span>
                      <span style={{ color: 'white', fontWeight: 600 }}>{c.name}</span>
                      <span style={{ color: '#FF9800', fontWeight: 800, fontSize: '0.72rem' }}>×4</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleFinalCreateRoom}
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {loading ? (
                'Creating Room...'
              ) : (
                <>
                  <PlusCircle size={22} /> Create Room & Open Lobby
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
