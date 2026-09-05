import React from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ seconds }) {
  const isUrgent = seconds <= 10;
  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;

  return (
    <div
      className={`glass-card-sm ${isUrgent ? 'pulse-urgent' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1.2rem',
        borderRadius: '999px',
        fontWeight: 800,
        fontSize: '1.2rem',
        color: isUrgent ? '#e11d48' : '#3b82f6',
        backgroundColor: isUrgent ? '#fff1f2' : 'rgba(255, 255, 255, 0.9)',
        border: `2px solid ${isUrgent ? '#f43f5e' : '#bfdbfe'}`,
        transition: 'all 0.3s ease'
      }}
    >
      <Clock size={20} className={isUrgent ? 'animate-bounce' : ''} />
      <span>{formattedTime}</span>
    </div>
  );
}