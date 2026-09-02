import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Check, X, Sparkles, FolderDown, Bookmark, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import sound from '../services/soundEngine';

const BUILT_IN_PRESETS = [
  {
    id: 'fruits',
    name: 'Fruits',
    emoji: '🍎',
    items: [
      { name: 'Apple', emoji: '🍎', color: '#FF4D4D' },
      { name: 'Banana', emoji: '🍌', color: '#FFD700' },
      { name: 'Mango', emoji: '🥭', color: '#FF9800' },
      { name: 'Grapes', emoji: '🍇', color: '#9B51E0' },
      { name: 'Watermelon', emoji: '🍉', color: '#27AE60' },
      { name: 'Orange', emoji: '🍊', color: '#FFA500' }
    ]
  },
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐯',
    items: [
      { name: 'Tiger', emoji: '🐯', color: '#FF7A00' },
      { name: 'Lion', emoji: '🦁', color: '#F59E0B' },
      { name: 'Elephant', emoji: '🐘', color: '#64748B' },
      { name: 'Panda', emoji: '🐼', color: '#475569' },
      { name: 'Fox', emoji: '🦊', color: '#EA580C' },
      { name: 'Zebra', emoji: '🦓', color: '#334155' }
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    emoji: '🏏',
    items: [
      { name: 'Cricket', emoji: '🏏', color: '#16A34A' },
      { name: 'Football', emoji: '⚽', color: '#0F172A' },
      { name: 'Tennis', emoji: '🎾', color: '#84CC16' },
      { name: 'Basketball', emoji: '🏀', color: '#EA580C' },
      { name: 'Badminton', emoji: '🏸', color: '#38BDF8' },
      { name: 'Volleyball', emoji: '🏐', color: '#FACC15' }
    ]
  },
  {
    id: 'objects',
    name: 'Objects',
    emoji: '🚗',
    items: [
      { name: 'Car', emoji: '🚗', color: '#EF4444' },
      { name: 'Bike', emoji: '🏍️', color: '#3B82F6' },
      { name: 'Airplane', emoji: '✈️', color: '#6366F1' },
      { name: 'Rocket', emoji: '🚀', color: '#F43F5E' },
      { name: 'Laptop', emoji: '💻', color: '#64748B' },
      { name: 'Camera', emoji: '📷', color: '#8B5CF6' }
    ]
  },
  {
    id: 'movies',
    name: 'Movies',
    emoji: '🎬',
    items: [
      { name: 'Action', emoji: '💥', color: '#EF4444' },
      { name: 'Comedy', emoji: '😂', color: '#F59E0B' },
      { name: 'Sci-Fi', emoji: '🛸', color: '#8B5CF6' },
      { name: 'Superhero', emoji: '🦸', color: '#3B82F6' },
      { name: 'Animation', emoji: '🎨', color: '#10B981' },
      { name: 'Mystery', emoji: '🕵️', color: '#059669' }
    ]
  },
  {
    id: 'names',
    name: 'Friends',
    emoji: '⭐',
    items: [
      { name: 'Sai', emoji: '👑', color: '#F59E0B' },
      { name: 'Rahul', emoji: '⚡', color: '#3B82F6' },
      { name: 'Kiran', emoji: '🔥', color: '#EF4444' },
      { name: 'Arjun', emoji: '🎯', color: '#10B981' },
      { name: 'Ananya', emoji: '🌸', color: '#EC4899' },
      { name: 'Vikram', emoji: '🦁', color: '#8B5CF6' }
    ]
  }
];

const SUGGESTED_EMOJIS = ['🍎', '🐯', '🚗', '🏏', '🥭', '🦁', '✈️', '⚽', '🍉', '🐘', '🚀', '🎾', '🍇', '🐼', '💻', '🏀', '⭐', '🔥', '👑', '⚡'];

export default function ChitCustomizer({
  chits = [],
  onChange,
  onContinue,
  minTypes = 4,
  maxTypes = 20,
  showContinueButton = true,
  continueLabel = 'Continue'
}) {
  const [inputName, setInputName] = useState('');
  const [inputEmoji, setInputEmoji] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Editing state
  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  // Delete confirmation state
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  // Saved sets in localStorage
  const [savedSets, setSavedSets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('matchmates_saved_sets') || '[]');
    } catch {
      return [];
    }
  });
  const [saveSetName, setSaveSetName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleAddChit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const trimmed = inputName.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a chit name');
      return;
    }

    if (trimmed.length > 30) {
      setErrorMsg('Chit name cannot exceed 30 characters');
      return;
    }

    // Duplicate validation (case-insensitive)
    const lower = trimmed.toLowerCase();
    const isDuplicate = chits.some((c) => c.name.toLowerCase() === lower);
    if (isDuplicate) {
      setErrorMsg(`"${trimmed}" already exists in your chits list!`);
      sound.playMismatch();
      return;
    }

    if (chits.length >= maxTypes) {
      setErrorMsg(`Maximum limit of ${maxTypes} chit types reached`);
      return;
    }

    sound.playPop();
    const newChit = {
      id: `type_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: trimmed,
      emoji: inputEmoji.trim(),
      color: `hsl(${Math.floor(Math.random() * 360)}, 75%, 55%)`,
      quantity: 4
    };

    onChange([...chits, newChit]);
    setInputName('');
    setInputEmoji('');
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditName(chits[index].name);
    setEditEmoji(chits[index].emoji || '');
  };

  const handleSaveEdit = (index) => {
    const trimmed = editName.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    const duplicate = chits.some((c, i) => i !== index && c.name.toLowerCase() === lower);
    if (duplicate) {
      setErrorMsg(`"${trimmed}" already exists`);
      return;
    }

    sound.playPop();
    const updated = [...chits];
    updated[index] = {
      ...updated[index],
      name: trimmed,
      emoji: editEmoji.trim()
    };

    onChange(updated);
    setEditingIndex(null);
    setErrorMsg('');
  };

  const handleDeleteChit = (index) => {
    sound.playPop();
    const updated = chits.filter((_, i) => i !== index);
    onChange(updated);
    setConfirmDeleteIndex(null);
  };

  const handleClearAll = () => {
    sound.playPop();
    onChange([]);
    setConfirmDeleteIndex(null);
  };

  const handleLoadPreset = (preset) => {
    sound.playPop();
    const formatted = preset.items.map((item) => ({
      id: `type_${item.name.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 3)}`,
      name: item.name,
      emoji: item.emoji || '',
      color: item.color || '#FF7A00',
      quantity: 4
    }));
    onChange(formatted);
    setErrorMsg('');
  };

  const handleSaveCustomSet = () => {
    if (!saveSetName.trim()) return;
    const newSaved = [
      ...savedSets.filter((s) => s.name !== saveSetName.trim()),
      {
        id: `set_${Date.now()}`,
        name: saveSetName.trim(),
        items: chits,
        createdAt: new Date().toISOString()
      }
    ];
    setSavedSets(newSaved);
    localStorage.setItem('matchmates_saved_sets', JSON.stringify(newSaved));
    setShowSaveModal(false);
    setSaveSetName('');
  };

  const totalTypes = chits.length;
  const totalChits = totalTypes * 4;
  const isValidCount = totalTypes >= minTypes && totalTypes <= maxTypes;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* 1. PRESET PACK SELECTOR SHORTCUTS */}
      <div>
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} color="#FF9800" /> Quick Preset Packs
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1-Click Load</span>
        </div>

        <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {BUILT_IN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 152, 0, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(255, 152, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }}
            >
              <span>{preset.emoji}</span>
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. ADD CHIT FORM */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem',
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1.5px solid rgba(255, 152, 0, 0.3)'
        }}
      >
        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFE082', marginBottom: '0.75rem' }}>
          ➕ Add Your Custom Chit Name
        </div>

        <form onSubmit={handleAddChit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* Optional Emoji Input */}
            <input
              type="text"
              placeholder="Emoji"
              value={inputEmoji}
              onChange={(e) => setInputEmoji(e.target.value)}
              className="input-field"
              style={{
                width: '65px',
                textAlign: 'center',
                fontSize: '1.3rem',
                padding: '0.7rem 0.3rem'
              }}
              maxLength={4}
              title="Optional emoji/icon"
            />

            {/* Chit Name Input */}
            <input
              type="text"
              placeholder="Enter name (e.g. Tiger, Car, Cricket, Rahul)..."
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="input-field"
              style={{ flex: 1, padding: '0.75rem 1rem', fontSize: '1rem' }}
              maxLength={30}
            />

            {/* Add Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.4rem', whiteSpace: 'nowrap' }}
            >
              <Plus size={18} /> ADD
            </button>
          </div>

          {/* Quick Emoji Helper Pill Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', overflowX: 'auto', padding: '2px 0' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '4px' }}>Quick Emoji:</span>
            {SUGGESTED_EMOJIS.slice(0, 10).map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => setInputEmoji(em)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  borderRadius: '4px'
                }}
              >
                {em}
              </button>
            ))}
          </div>

          {/* Auto x4 Notice */}
          <div style={{ fontSize: '0.78rem', color: 'var(--text-accent)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={13} color="#FF9800" /> Entering a name automatically creates <strong>exactly 4 physical chits (×4)</strong>.
          </div>
        </form>

        {errorMsg && (
          <div
            className="animate-shake"
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#FCA5A5',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* 3. CURRENT CHITS LIST & SUMMARY HUD */}
      <div>
        {/* HUD Stats Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Types: </span>
              <strong style={{ color: isValidCount ? '#FFE082' : '#F87171', fontSize: '1rem' }}>
                {totalTypes} / {maxTypes}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Chits: </span>
              <strong style={{ color: isValidCount ? '#34D399' : '#F87171', fontSize: '1.05rem' }}>
                {totalChits} Chits
              </strong>
            </div>
          </div>

          {chits.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="btn btn-secondary btn-sm"
              style={{ color: '#FCA5A5', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.3rem 0.65rem' }}
            >
              <Trash2 size={13} /> CLEAR ALL
            </button>
          )}
        </div>

        {/* Chits Cards Grid */}
        {chits.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              background: 'rgba(15, 23, 42, 0.35)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px dashed rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>📝</div>
            <div style={{ fontWeight: 700, color: 'white', marginBottom: '0.2rem' }}>
              No custom chits added yet
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Add custom names above or click any preset pack to get started!
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.65rem',
              maxHeight: '320px',
              overflowY: 'auto',
              paddingRight: '4px'
            }}
          >
            {chits.map((chit, idx) => {
              const isEditing = editingIndex === idx;
              const isConfirmingDelete = confirmDeleteIndex === idx;

              return (
                <div
                  key={chit.id || idx}
                  className="glass-card"
                  style={{
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(30, 41, 59, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    position: 'relative'
                  }}
                >
                  {isEditing ? (
                    /* Inline Editing Mode */
                    <div style={{ display: 'flex', gap: '0.3rem', width: '100%', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={editEmoji}
                        onChange={(e) => setEditEmoji(e.target.value)}
                        style={{ width: '38px', textAlign: 'center', fontSize: '1.1rem' }}
                        className="input-field"
                        maxLength={4}
                      />
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.9rem' }}
                        className="input-field"
                        maxLength={30}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(idx)}
                        className="btn btn-success btn-icon"
                        style={{ minWidth: '28px', minHeight: '28px', padding: '4px' }}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingIndex(null)}
                        className="btn btn-secondary btn-icon"
                        style={{ minWidth: '28px', minHeight: '28px', padding: '4px' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    /* Standard Display Mode */
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                        <span style={{ fontSize: '1.4rem' }}>{chit.emoji || '🏷️'}</span>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: '0.95rem',
                              color: 'white',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {chit.name}
                          </div>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              color: 'var(--fruit-mango)',
                              background: 'rgba(255, 152, 0, 0.15)',
                              padding: '1px 6px',
                              borderRadius: 'var(--radius-full)'
                            }}
                          >
                            ×4 Chits
                          </span>
                        </div>
                      </div>

                      {/* Edit & Delete Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {isConfirmingDelete ? (
                          <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteChit(idx)}
                              className="btn btn-danger btn-icon"
                              style={{ minWidth: '26px', minHeight: '26px', padding: '3px', fontSize: '0.7rem' }}
                              title="Confirm Delete"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteIndex(null)}
                              className="btn btn-secondary btn-icon"
                              style={{ minWidth: '26px', minHeight: '26px', padding: '3px' }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(idx)}
                              className="btn btn-secondary btn-icon"
                              style={{ minWidth: '28px', minHeight: '28px', padding: '4px' }}
                              title="Edit Chit Name"
                            >
                              <Edit3 size={13} color="#94A3B8" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteIndex(idx)}
                              className="btn btn-secondary btn-icon"
                              style={{ minWidth: '28px', minHeight: '28px', padding: '4px' }}
                              title="Delete Chit"
                            >
                              <Trash2 size={13} color="#F87171" />
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Validation Message if count is below minimum */}
      {!isValidCount && chits.length > 0 && (
        <div style={{ fontSize: '0.82rem', color: '#FBBF24', textAlign: 'center' }}>
          ⚠️ You need at least <strong>{minTypes} unique chit types</strong> (currently {totalTypes}). Add {minTypes - totalTypes} more!
        </div>
      )}

      {/* Continue Button */}
      {showContinueButton && onContinue && (
        <button
          type="button"
          onClick={onContinue}
          disabled={!isValidCount}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          {continueLabel} ({totalChits} Chits)
        </button>
      )}
    </div>
  );
}
