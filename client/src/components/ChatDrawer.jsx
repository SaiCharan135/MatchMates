import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, ChevronDown, ChevronUp, Smile } from 'lucide-react';
import { useGame } from '../store/GameContext';

const QUICK_REACTIONS = ['🥭', '🍉', '🍎', '🔥', '👏', '🎉', '😂', '😱'];

export default function ChatDrawer() {
  const { chatMessages, sendChatMessage, sendReaction, player } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendChatMessage(text);
    setText('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}
    >
      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div
          className="glass-panel animate-slide-up"
          style={{
            width: '320px',
            height: '380px',
            marginBottom: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.6rem 0.85rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(15, 23, 42, 0.5)'
            }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>
              💬 Room Chat
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-secondary btn-icon"
              style={{ padding: '4px', minWidth: '24px', minHeight: '24px' }}
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Quick Reaction Bar */}
          <div
            style={{
              display: 'flex',
              gap: '0.35rem',
              padding: '0.4rem 0.6rem',
              background: 'rgba(0, 0, 0, 0.2)',
              overflowX: 'auto'
            }}
          >
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendReaction(emoji)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '2px',
                  borderRadius: '4px',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '0.75rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            {chatMessages.length === 0 ? (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}
              >
                No messages yet. Say hi! 👋
              </div>
            ) : (
              chatMessages.map((msg) => {
                const isMe = msg.senderId === player.id;
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      {msg.senderAvatar} {msg.senderName}
                    </span>
                    <div
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: isMe ? 'var(--brand-gradient)' : 'rgba(255, 255, 255, 0.08)',
                        color: 'white',
                        fontSize: '0.88rem',
                        wordBreak: 'break-word'
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '0.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              gap: '0.4rem',
              background: 'rgba(15, 23, 42, 0.6)'
            }}
          >
            <input
              type="text"
              placeholder="Type message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input-field"
              style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.88rem' }}
              maxLength={120}
            />
            <button
              type="submit"
              className="btn btn-primary btn-icon"
              style={{ minWidth: '36px', minHeight: '36px' }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Bubble */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {/* Quick Emojis Bar on mobile */}
        {!isOpen && (
          <div
            style={{
              display: 'flex',
              gap: '0.25rem',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {['🥭', '🔥', '🎉'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendReaction(emoji)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '2px 4px'
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-primary btn-icon animate-bounce-in"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            boxShadow: '0 8px 20px rgba(255, 122, 0, 0.4)'
          }}
          title="Chat & Reactions"
        >
          <MessageSquare size={20} />
        </button>
      </div>
    </div>
  );
}
