import React, { useState } from 'react';
import { Send } from 'lucide-react';

const REACTIONS = [
  { emoji: '❤️', label: 'Aww' },
  { emoji: '😂', label: 'LOL' },
  { emoji: '🔥', label: 'Amazing' },
  { emoji: '🥹', label: 'So cute' },
  { emoji: '😭', label: "I'm crying" },
  { emoji: '🤨', label: 'Explain!' }
];

export default function ReactionBar({ onSendReaction, partnerName }) {
  const [comment, setComment] = useState('');

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSendReaction({ emoji: '💬', message: comment.trim() });
    setComment('');
  };

  return (
    <div className="glass-card-sm" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', color: '#64748b' }}>
        React to {partnerName}&apos;s drawing:
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {REACTIONS.map((r) => (
          <button
            key={r.label}
            type="button"
            onClick={() => onSendReaction({ emoji: r.emoji, message: r.label })}
            className="btn-secondary"
            style={{
              padding: '0.5rem 0.9rem',
              fontSize: '0.95rem',
              borderRadius: '999px',
              border: '1px solid #fed7aa',
              background: '#fff7ed',
              color: '#9a3412'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{r.emoji}</span>
            <span>{r.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSendComment} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={`Say something sweet or hilarious about ${partnerName}'s art...`}
          style={{
            flex: 1,
            padding: '0.75rem 1.2rem',
            borderRadius: '999px',
            border: '1.5px solid #e2e8f0',
            outline: 'none',
            fontSize: '0.95rem',
            background: 'rgba(255,255,255,0.9)'
          }}
        />
        <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.2rem' }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}