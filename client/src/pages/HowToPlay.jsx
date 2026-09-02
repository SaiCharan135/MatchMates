import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, CheckCircle2, Zap, Trophy, Shield, Sparkles, Layers, Flame, Shuffle } from 'lucide-react';

export default function HowToPlay() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '1rem 0'
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

      <div className="glass-panel" style={{ padding: '2rem 1.75rem' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🥭 🐯 🚗 🏏</div>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              background: 'var(--brand-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}
          >
            How to Play MatchMates
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
            Master the art of custom chit matching, streak combos, and claim victory with friends!
          </p>
        </div>

        {/* Core Rules Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Custom Chits Core Feature */}
          <div
            className="glass-card"
            style={{
              padding: '1.25rem',
              background: 'rgba(255, 152, 0, 0.1)',
              border: '1.5px solid rgba(255, 152, 0, 0.4)'
            }}
          >
            <h3 style={{ color: '#FFE082', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="#FF9800" /> 1. Custom Chits & Automatic ×4 Generation
            </h3>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              MatchMates is <strong>not limited to fruits</strong>! The host can create any custom collection of names (Animals, Sports, Movies, Superheroes, Friends, Objects) or choose from preset packs. When a host enters <em>"Tiger"</em>, the server automatically provisions <strong>exactly 4 physical Tiger chits (×4)</strong>.
            </p>
          </div>

          {/* Objective */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ color: '#FFE082', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={20} color="#FFD700" /> 2. The Objective
            </h3>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              Players take turns picking hidden cards from the board. Your goal is to reveal matching twins, build win streaks, and score the highest points across the scheduled rounds.
            </p>
          </div>

          {/* Matching Mechanics */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ color: '#FFE082', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={20} color="#2ED573" /> 3. Turn Matching & Streaks
            </h3>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              On your turn, click any 2 hidden chits on the board:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <div
                style={{
                  background: 'rgba(46, 213, 115, 0.15)',
                  border: '1px solid rgba(46, 213, 115, 0.4)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ fontWeight: 700, color: '#2ED573', marginBottom: '0.25rem' }}>
                  🐯 + 🐯 = Valid Match!
                </div>
                <div style={{ fontSize: '0.85rem', color: 'white' }}>
                  Score <strong>+1 point</strong> and keep your turn! Consecutive matches earn a <strong>Streak Multiplier 🔥</strong>.
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ fontWeight: 700, color: '#F87171', marginBottom: '0.25rem' }}>
                  🐯 + 🚗 = Mismatch
                </div>
                <div style={{ fontSize: '0.85rem', color: 'white' }}>
                  Cards flip back, streak resets to 0, and turn passes to the next player. Remember their locations!
                </div>
              </div>
            </div>
          </div>

          {/* Social Chit Pass Mode */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ color: '#FFE082', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shuffle size={20} color="#9B51E0" /> 4. Social Chit Pass Mode
            </h3>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              In Social Pass mode, all players hold 4 chits in their secret hand. Each round, everyone secretly selects 1 chit to pass clockwise. The first player to collect <strong>4 of a kind (e.g. 4 Apples or 4 Tigers)</strong> clicks <strong>CLAIM MATCHMATES</strong> for a massive +5 bonus!
            </p>
          </div>

          {/* Anti-Cheat */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ color: '#FFE082', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color="#38BDF8" /> 5. Anti-Cheat Engine
            </h3>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              All chits, shuffles, turns, and validations happen exclusively on the game server. Unrevealed chit identities are never transmitted over the wire until legally revealed.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/create" className="btn btn-primary btn-lg" style={{ minWidth: '220px' }}>
            Create a Custom Game Now
          </Link>
        </div>
      </div>
    </div>
  );
}
