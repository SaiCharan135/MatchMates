import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../store/GameContext';
import FruitCard from '../components/FruitCard';
import ScoreBoard from '../components/ScoreBoard';
import TurnIndicator from '../components/TurnIndicator';
import triggerConfetti from '../components/ConfettiEffect';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';

export default function GameBoard() {
  const { roomCode: paramCode } = useParams();
  const navigate = useNavigate();
  const {
    player,
    roomCode,
    gameState,
    myHand,
    isMyTurn,
    pickChit,
    passChit,
    claimChittilu,
    joinRoom,
    addToast
  } = useGame();

  const [selectedChitForPass, setSelectedChitForPass] = useState(null);

  // Auto-join if user refreshed
  useEffect(() => {
    if (paramCode && (!roomCode || roomCode !== paramCode.toUpperCase())) {
      joinRoom(paramCode.toUpperCase()).catch((err) => {
        addToast(err.message || 'Room not found', 'error');
        navigate('/');
      });
    }
  }, [paramCode, roomCode, joinRoom, addToast, navigate]);

  // Navigate to results when game ends
  useEffect(() => {
    if (gameState?.status === 'game_over') {
      navigate(`/results/${roomCode || paramCode}`);
    }
  }, [gameState?.status, roomCode, paramCode, navigate]);

  if (!gameState || gameState.status === 'waiting') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '1rem'
        }}
      >
        <div style={{ fontSize: '3rem' }} className="animate-float">
          🥭
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--fruit-mango)' }}>
          Loading MatchMates Arena...
        </h2>
      </div>
    );
  }

  const turnPlayer = gameState.players.find((p) => p.id === gameState.turnPlayerId);
  const isChitPassMode = gameState.mode === 'chit_pass';

  const handleChitClick = (chit) => {
    if (!isMyTurn) {
      addToast("Not your turn! Wait for other player's move.", 'warning');
      return;
    }
    pickChit(chit.id);
  };

  const handlePassSubmit = () => {
    if (!selectedChitForPass) {
      addToast('Select a chit to pass first', 'warning');
      return;
    }
    passChit(selectedChitForPass.id);
    setSelectedChitForPass(null);
  };

  const handleClaim = () => {
    claimChittilu();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0.5rem 0'
      }}
    >
      {/* Top Turn HUD Indicator */}
      <TurnIndicator
        isMyTurn={isMyTurn}
        turnPlayerName={turnPlayer?.name || 'Player'}
        turnPlayerAvatar={turnPlayer?.avatar || '🍎'}
        currentRound={gameState.currentRound || 1}
        totalRounds={gameState.totalRounds || 3}
        currentPicks={gameState.currentPicks || []}
        mode={gameState.mode}
      />

      {/* Main Game Layout: Grid on Left/Center, ScoreBoard on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '1.5rem',
          width: '100%',
          alignItems: 'start'
        }}
        className="game-layout-grid"
      >
        {/* Left Column: Game Arena */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {/* 1. MATCHING GRID MODE */}
          {!isChitPassMode && (
            <div className="chits-grid">
              {gameState.boardChits?.map((chit) => {
                const isCurrentlyPicked = gameState.currentPicks?.includes(chit.id);
                return (
                  <FruitCard
                    key={chit.id}
                    chit={chit}
                    onClick={() => handleChitClick(chit)}
                    isClickable={isMyTurn && !chit.isMatched && !isCurrentlyPicked}
                    isRevealed={chit.isRevealed}
                    isMatched={chit.isMatched}
                    isCurrentlyPicked={isCurrentlyPicked}
                  />
                );
              })}
            </div>
          )}

          {/* 2. CHIT PASS MODE ARENA */}
          {isChitPassMode && (
            <div
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '650px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem'
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'white', margin: 0 }}>
                Your Hand Chits ({myHand.length})
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
                Select an unwanted card to pass clockwise, or claim <strong>MATCHMATES</strong> if you have 4 identical fruits!
              </p>

              {/* Player Hand Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.75rem',
                  width: '100%'
                }}
              >
                {myHand.map((chit) => {
                  const isSelected = selectedChitForPass?.id === chit.id;
                  return (
                    <div
                      key={chit.id}
                      onClick={() => setSelectedChitForPass(chit)}
                      style={{
                        padding: '1rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        background: chit.color
                          ? `linear-gradient(135deg, ${chit.color}44, ${chit.color}88)`
                          : 'rgba(255, 152, 0, 0.2)',
                        border: isSelected
                          ? '2.5px solid #FF9800'
                          : '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: isSelected ? '0 0 15px rgba(255, 152, 0, 0.5)' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: isSelected ? 'translateY(-6px)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{chit.emoji}</div>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>
                        {chit.fruitName}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons for Pass Mode */}
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
                <button
                  onClick={handlePassSubmit}
                  disabled={!selectedChitForPass}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  <RotateCcw size={18} /> Pass Selected Card
                </button>

                <button
                  onClick={handleClaim}
                  className="btn btn-primary"
                  style={{ flex: 1, background: 'var(--brand-gradient-green)' }}
                >
                  <Sparkles size={18} /> CLAIM MATCHMATES!
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Scoreboard */}
        <div style={{ width: '100%' }}>
          <ScoreBoard
            players={gameState.players || []}
            turnPlayerId={gameState.turnPlayerId}
            currentPlayerId={player.id}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .game-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
