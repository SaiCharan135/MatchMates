import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Trophy, RotateCcw, Home as HomeIcon, Users, Crown, Medal, ArrowRight, Sparkles, Edit3, X } from 'lucide-react';
import { useGame } from '../store/GameContext';
import triggerConfetti from '../components/ConfettiEffect';
import ChitCustomizer from '../components/ChitCustomizer';

export default function Results() {
  const { roomCode: paramCode } = useParams();
  const navigate = useNavigate();
  const {
    player,
    roomCode,
    gameState,
    isHost,
    restartGame,
    leaveRoom,
    addToast
  } = useGame();

  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [rematchChits, setRematchChits] = useState([]);

  useEffect(() => {
    triggerConfetti('victory');
    if (gameState?.configuredChits) {
      setRematchChits(gameState.configuredChits);
    }
  }, [gameState?.configuredChits]);

  // If game is restarted, navigate back to Lobby or Game
  useEffect(() => {
    if (gameState?.status === 'waiting') {
      navigate(`/lobby/${roomCode || paramCode}`);
    } else if (gameState?.status === 'in_progress') {
      navigate(`/game/${roomCode || paramCode}`);
    }
  }, [gameState?.status, roomCode, paramCode, navigate]);

  const rankings = gameState?.rankings || [];
  const winner = gameState?.winner || rankings[0];

  const handlePlayAgainSameChits = async () => {
    if (!isHost) {
      addToast('Only the host can initiate Play Again', 'info');
      return;
    }
    try {
      await restartGame();
      addToast('Starting rematch with same chits!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to restart', 'error');
    }
  };

  const handlePlayAgainNewChits = async () => {
    try {
      await restartGame({ customChits: rematchChits });
      setShowCustomizeModal(false);
      addToast('Starting rematch with updated chits!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to restart', 'error');
    }
  };

  const handleReturnLobby = async () => {
    if (isHost) {
      await restartGame();
      navigate(`/lobby/${roomCode || paramCode}`);
    } else {
      navigate(`/lobby/${roomCode || paramCode}`);
    }
  };

  const handleHome = () => {
    leaveRoom();
    navigate('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
        padding: '1rem 0',
        textAlign: 'center'
      }}
    >
      <div
        className="glass-panel animate-bounce-in"
        style={{
          width: '100%',
          maxWidth: '580px',
          padding: '2.5rem 1.75rem',
          position: 'relative',
          background: 'rgba(30, 41, 59, 0.9)',
          border: '2px solid rgba(255, 152, 0, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(255, 152, 0, 0.25)'
        }}
      >
        {/* Victory Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.8rem',
              boxShadow: '0 8px 25px rgba(255, 215, 0, 0.5)',
              position: 'relative'
            }}
            className="animate-pulse-glow"
          >
            <Crown
              size={36}
              color="#FFF"
              style={{ position: 'absolute', top: -16, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}
            />
            {winner?.avatar || '👑'}
          </div>

          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #FFE082 0%, #FF9800 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0.25rem 0'
            }}
          >
            {winner?.name} Wins!
          </h2>

          <p style={{ fontSize: '1rem', color: 'var(--text-accent)', margin: 0, fontWeight: 600 }}>
            🎉 Fruit Champion with {winner?.score || 0} Points!
          </p>
        </div>

        {/* Podium / Final Rankings Table */}
        <div style={{ margin: '2rem 0 1.5rem', textAlign: 'left' }}>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Trophy size={16} color="#FF9800" /> FINAL RANKINGS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {rankings.map((p, idx) => {
              const isWinner = idx === 0;
              const isMe = p.id === player.id;

              return (
                <div
                  key={p.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isWinner
                      ? 'linear-gradient(90deg, rgba(255, 215, 0, 0.25) 0%, rgba(255, 152, 0, 0.15) 100%)'
                      : isMe
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(15, 23, 42, 0.5)',
                    border: isWinner
                      ? '1.5px solid rgba(255, 215, 0, 0.6)'
                      : '1px solid rgba(255, 255, 255, 0.06)',
                    boxShadow: isWinner ? '0 0 15px rgba(255, 215, 0, 0.25)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Rank Number Badge */}
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background:
                          idx === 0
                            ? '#FFD700'
                            : idx === 1
                            ? '#C0C0C0'
                            : idx === 2
                            ? '#CD7F32'
                            : 'rgba(255, 255, 255, 0.1)',
                        color: idx < 3 ? '#0F172A' : '#94A3B8',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {idx + 1}
                    </div>

                    <span style={{ fontSize: '1.4rem' }}>{p.avatar}</span>

                    <div>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: isMe ? '#FFE082' : 'white' }}>
                        {p.name} {isMe && '(You)'}
                      </span>
                      {p.matchesCount !== undefined && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {p.matchesCount} Matches Made
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: isWinner ? '#FFD700' : 'white'
                    }}
                  >
                    {p.score} pts
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {isHost ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                onClick={handlePlayAgainSameChits}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', fontSize: '1.15rem' }}
              >
                <RotateCcw size={20} /> PLAY AGAIN (Same Chits)
              </button>

              <button
                onClick={() => setShowCustomizeModal(true)}
                className="btn btn-secondary"
                style={{ width: '100%', background: 'rgba(255, 152, 0, 0.15)', borderColor: 'rgba(255, 152, 0, 0.4)', color: '#FFE082' }}
              >
                <Edit3 size={16} /> Customize Chits for Next Match
              </button>
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Waiting for host to restart match...
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleReturnLobby}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              <Users size={18} /> Return to Lobby
            </button>

            <button
              onClick={handleHome}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              <HomeIcon size={18} /> Home
            </button>
          </div>
        </div>
      </div>

      {/* Host Customize Chits for Rematch Modal */}
      {showCustomizeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="glass-panel animate-bounce-in"
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFE082', margin: 0 }}>
                ✏️ Customize Chits for Rematch
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomizeModal(false)}
                className="btn btn-secondary btn-icon"
                style={{ padding: '6px' }}
              >
                <X size={16} />
              </button>
            </div>

            <ChitCustomizer
              chits={rematchChits}
              onChange={setRematchChits}
              minTypes={4}
              maxTypes={20}
              showContinueButton={true}
              continueLabel="Start Rematch with New Chits"
              onContinue={handlePlayAgainNewChits}
            />
          </div>
        </div>
      )}
    </div>
  );
}
