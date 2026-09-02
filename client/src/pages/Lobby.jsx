import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Copy, Check, Users, Shield, CheckCircle2, Clock, Share2, LogOut, Edit3, X } from 'lucide-react';
import { useGame } from '../store/GameContext';
import ChitCustomizer from '../components/ChitCustomizer';

export default function Lobby() {
  const { roomCode: paramCode } = useParams();
  const navigate = useNavigate();
  const {
    player,
    roomCode,
    gameState,
    isHost,
    isReady,
    toggleReady,
    startGame,
    leaveRoom,
    joinRoom,
    updateCustomChits,
    addToast
  } = useGame();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [starting, setStarting] = useState(false);
  const [showEditChits, setShowEditChits] = useState(false);
  const [editingChitsList, setEditingChitsList] = useState([]);

  useEffect(() => {
    if (gameState?.configuredChits) {
      setEditingChitsList(gameState.configuredChits);
    }
  }, [gameState?.configuredChits]);

  // If user navigated directly via URL or refreshed, auto-join with current player
  useEffect(() => {
    if (paramCode && (!roomCode || roomCode !== paramCode.toUpperCase())) {
      joinRoom(paramCode.toUpperCase()).catch((err) => {
        addToast(err.message || 'Room not found', 'error');
        navigate('/join');
      });
    }
  }, [paramCode, roomCode, joinRoom, addToast, navigate]);

  // Navigate to GameBoard if game is in progress
  useEffect(() => {
    if (gameState?.status === 'in_progress') {
      navigate(`/game/${roomCode || paramCode}`);
    }
  }, [gameState?.status, roomCode, paramCode, navigate]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode || paramCode);
    setCopiedCode(true);
    addToast('Room Code copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}/join?code=${roomCode || paramCode}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    addToast('Invite Link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleStartGame = async () => {
    try {
      setStarting(true);
      await startGame();
    } catch (err) {
      addToast(err.message || 'Failed to start game', 'error');
      setStarting(false);
    }
  };

  const handleLeave = () => {
    leaveRoom();
    navigate('/');
  };

  const players = gameState?.players || [];
  const minPlayers = 2;
  const canStart =
    isHost &&
    players.length >= minPlayers &&
    players.every((p) => p.isReady || p.isHost);

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
          maxWidth: '640px',
          padding: '2rem 1.75rem',
          position: 'relative'
        }}
      >
        {/* Top Header & Leave Room */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🥭</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem' }}>
              GAME LOBBY
            </span>
          </div>

          <button
            onClick={handleLeave}
            className="btn btn-secondary btn-sm"
            style={{ color: '#FCA5A5', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            <LogOut size={14} /> Leave
          </button>
        </div>

        {/* Room Code Showcase Box */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 61, 113, 0.15) 100%)',
            border: '1.5px solid rgba(255, 152, 0, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            textAlign: 'center',
            marginBottom: '1.75rem',
            position: 'relative'
          }}
        >
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--fruit-mango)', letterSpacing: '0.08em' }}>
            SHARE ROOM CODE
          </div>

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.8rem',
              fontWeight: 900,
              letterSpacing: '0.15em',
              color: '#FFE082',
              margin: '0.2rem 0',
              textShadow: '0 4px 15px rgba(255, 152, 0, 0.4)'
            }}
          >
            {roomCode || paramCode}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            <button
              onClick={handleCopyCode}
              className="btn btn-secondary btn-sm"
              style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '0.45rem 0.85rem' }}
            >
              {copiedCode ? <Check size={14} color="#34D399" /> : <Copy size={14} />}
              {copiedCode ? 'Copied Code!' : 'Copy Code'}
            </button>

            <button
              onClick={handleCopyLink}
              className="btn btn-secondary btn-sm"
              style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '0.45rem 0.85rem' }}
            >
              {copiedLink ? <Check size={14} color="#34D399" /> : <Share2 size={14} />}
              {copiedLink ? 'Link Copied!' : 'Copy Link'}
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🎮 Join my MatchMates game room! Code: ${roomCode || paramCode}\nPlay here: ${window.location.origin}/join?code=${roomCode || paramCode}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm"
              style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: 'white', textDecoration: 'none', padding: '0.45rem 0.85rem' }}
            >
              📲 WhatsApp Invite
            </a>
          </div>
        </div>

        {/* Players List */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem' }}>
              <Users size={16} color="#FF9800" />
              <span>PLAYERS ({players.length} / {gameState?.maxPlayers || 8})</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Min {minPlayers} players needed
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {players.map((p) => {
              const isMe = p.id === player.id;
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isMe ? 'rgba(255, 152, 0, 0.12)' : 'rgba(15, 23, 42, 0.5)',
                    border: isMe ? '1px solid rgba(255, 152, 0, 0.35)' : '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0
                      }}
                    >
                      {p.avatar}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: isMe ? '#FFE082' : 'white' }}>
                          {p.name} {isMe && '(You)'}
                        </span>
                        {p.isHost && (
                          <span className="badge badge-host">
                            <Shield size={10} /> Host
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {p.connected ? 'Connected' : 'Reconnecting...'}
                      </span>
                    </div>
                  </div>

                  {/* Ready Status Pill */}
                  <div>
                    {p.isHost ? (
                      <span className="badge badge-host">HOST</span>
                    ) : p.isReady ? (
                      <span className="badge badge-ready">
                        <CheckCircle2 size={12} /> Ready
                      </span>
                    ) : (
                      <span className="badge badge-waiting">
                        <Clock size={12} /> Not Ready
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Game Chits Summary Section */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.1rem' }}>🃏</span>
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#FFE082' }}>
                GAME CHITS ({gameState?.configuredChits?.length || 0} Types • {gameState?.totalConfiguredChits || (gameState?.configuredChits?.length || 0) * 4} Total)
              </span>
            </div>

            {isHost && (
              <button
                type="button"
                onClick={() => setShowEditChits(true)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '3px 8px', fontSize: '0.78rem' }}
              >
                ✏️ Customize Chits
              </button>
            )}
          </div>

          {/* List of configured chit items */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', maxHeight: '120px', overflowY: 'auto' }}>
            {gameState?.configuredChits?.map((chit, idx) => (
              <div
                key={chit.id || idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem'
                }}
              >
                <span>{chit.emoji || '🏷️'}</span>
                <span style={{ color: 'white', fontWeight: 600 }}>{chit.name}</span>
                <span style={{ color: '#FFA726', fontWeight: 800, fontSize: '0.75rem' }}>×4</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Non-host Ready Button */}
          {!isHost && (
            <button
              onClick={toggleReady}
              className={`btn ${isReady ? 'btn-success' : 'btn-primary'} btn-lg`}
              style={{ width: '100%' }}
            >
              {isReady ? (
                <>
                  <CheckCircle2 size={20} /> You are Ready! (Click to cancel)
                </>
              ) : (
                <>
                  <Check size={20} /> Ready Up
                </>
              )}
            </button>
          )}

          {/* Host Start Game Button */}
          {isHost && (
            <div>
              <button
                onClick={handleStartGame}
                disabled={!canStart || starting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', fontSize: '1.25rem' }}
              >
                {starting ? (
                  'Starting Game...'
                ) : (
                  <>
                    <Play size={22} /> Start Game
                  </>
                )}
              </button>

              {!canStart && (
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--fruit-mango)',
                    textAlign: 'center',
                    marginTop: '0.5rem',
                    marginBottom: 0
                  }}
                >
                  {players.length < minPlayers
                    ? `Waiting for at least ${minPlayers} players to join...`
                    : 'Waiting for all players to click Ready...'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Host Edit Chits Modal */}
      {showEditChits && (
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
                ✏️ Customize Game Chits
              </h3>
              <button
                type="button"
                onClick={() => setShowEditChits(false)}
                className="btn btn-secondary btn-icon"
                style={{ padding: '6px' }}
              >
                <X size={16} />
              </button>
            </div>

            <ChitCustomizer
              chits={editingChitsList}
              onChange={setEditingChitsList}
              minTypes={4}
              maxTypes={20}
              showContinueButton={true}
              continueLabel="Save & Update Lobby"
              onContinue={async () => {
                try {
                  await updateCustomChits(editingChitsList);
                  setShowEditChits(false);
                  addToast('Game chits updated successfully!', 'success');
                } catch (err) {
                  addToast(err.message || 'Failed to update chits', 'error');
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
