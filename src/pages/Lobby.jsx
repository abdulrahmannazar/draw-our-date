import React, { useState } from 'react';
import { Copy, Check, Play, UserCheck, Clock } from 'lucide-react';
import { getRandomPrompt } from '../data/prompts';

const MODES = [
  { id: 'Same Prompt', icon: '❤️', label: 'Same Prompt', desc: 'Both players draw the exact same romantic prompt.' },
  { id: 'Guess Me', icon: '🧠', label: 'Guess Me', desc: 'Draw what you THINK your partner would love or pick.' },
  { id: 'Draw Together', icon: '🎨', label: 'Draw Together', desc: 'Each player contributes without peeking until the merge.' },
  { id: 'Draw & Guess', icon: '😂', label: 'Draw & Guess', desc: 'One draws secret clues, partner tries to guess!' }
];

export default function Lobby({ room, socket, isHost }) {
  const [copied, setCopied] = useState(false);
  const selectedMode = room.mode || 'Same Prompt'; // Read directly from server state

  const myPlayer = room.players.find(p => p.id === socket.id);
  const partnerPlayer = room.players.find(p => p.id !== socket.id);

  const copyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleToggleReady = () => {
    socket.emit('toggle_ready');
  };

  const handleModeChange = (modeId) => {
    if (isHost) {
      socket.emit('update_mode', { mode: modeId });
    }
  };

  const handleStartGame = () => {
    // Generate the first prompt based on the selected mode category
    let category = null;
    if (room.mode === 'Guess Me') category = 'Guess Me 🧠';
    
    socket.emit('start_game', {
      prompt: getRandomPrompt(category)
    });
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ textAlign: 'center', padding: '1.8rem' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Private Love Room
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#e11d48', letterSpacing: '0.1em', margin: '0.4rem 0 1rem 0' }}>
          {room.code}
        </div>

        <button className="btn-secondary" onClick={copyCode} style={{ padding: '0.6rem 1.4rem', fontSize: '0.95rem' }}>
          {copied ? <Check size={18} color="#16a34a" /> : <Copy size={18} />}
          <span>{copied ? 'Code Copied! Send it over 💕' : 'Copy Room Code'}</span>
        </button>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1e293b' }}>Couples in Room ( {room.players.length} / 2 )</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="glass-card-sm" style={{ textAlign: 'center', border: '2px solid #fda4af', background: '#fff1f2' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>{myPlayer?.avatar || '❤️'}</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>{myPlayer?.nickname || 'You'}</div>
            <div style={{ fontSize: '0.85rem', color: '#e11d48', fontWeight: 700, marginTop: '0.2rem' }}>
              {myPlayer?.ready ? 'Ready to draw! ✓' : 'Choosing markers...'}
            </div>
          </div>

          <div className="glass-card-sm" style={{ textAlign: 'center', border: partnerPlayer ? '2px solid #93c5fd' : '2px dashed #cbd5e1', background: partnerPlayer ? '#eff6ff' : 'rgba(255,255,255,0.4)' }}>
            {partnerPlayer ? (
              <>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>{partnerPlayer.avatar || '🔵'}</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>{partnerPlayer.nickname}</div>
                <div style={{ fontSize: '0.85rem', color: partnerPlayer.ready ? '#16a34a' : '#64748b', fontWeight: 700, marginTop: '0.2rem' }}>
                  {partnerPlayer.ready ? 'Ready to draw! ✓' : 'Waiting to get ready...'}
                </div>
              </>
            ) : (
              <div style={{ padding: '1rem 0' }}>
                <Clock size={32} color="#94a3b8" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#64748b' }}>Waiting for your partner... 💕</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>Share room code to start</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: '#1e293b' }}>Select Game Mode</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem' }}>
          {MODES.map((m) => (
            <div 
              key={m.id} 
              onClick={() => handleModeChange(m.id)} 
              style={{ 
                padding: '0.8rem', 
                borderRadius: '16px', 
                border: selectedMode === m.id ? '2px solid #ff527b' : '1px solid #e2e8f0', 
                background: selectedMode === m.id ? '#fff1f2' : '#ffffff', 
                cursor: isHost ? 'pointer' : 'default', 
                textAlign: 'center', 
                transition: 'all 0.2s ease',
                opacity: (!isHost && selectedMode !== m.id) ? 0.6 : 1
              }}
            >
              <div style={{ fontSize: '1.8rem' }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.3rem', color: '#1e293b' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button className={myPlayer?.ready ? 'btn-secondary' : 'btn-primary'} onClick={handleToggleReady} style={{ flex: 1, padding: '1rem' }}>
          <UserCheck size={20} />
          <span>{myPlayer?.ready ? 'Cancel Ready' : "I'm Ready! 💕"}</span>
        </button>

        {isHost && (
          <button className="btn-primary" onClick={handleStartGame} disabled={room.players.length < 2 || !room.players.every(p => p.ready)} style={{ flex: 1, padding: '1rem', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.35)', opacity: (room.players.length < 2 || !room.players.every(p => p.ready)) ? 0.5 : 1 }}>
            <Play size={20} fill="#ffffff" />
            <span>Start Game</span>
          </button>
        )}
      </div>
    </div>
  );
}