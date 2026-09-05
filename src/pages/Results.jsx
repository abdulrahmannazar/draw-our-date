import React from 'react';
import Confetti from '../components/Confetti';
import { Heart, RotateCcw, Image, Sparkles, Award } from 'lucide-react';

export default function Results({ history, onPlayAgain, onViewMemories }) {
  const totalRounds = history.length;
  const avgScore = totalRounds > 0 ? Math.round(history.reduce((sum, r) => sum + r.similarity, 0) / totalRounds) : 85;

  const achievements = [
    { title: 'Mind Readers', icon: '🏆', desc: 'Predicted similar drawings in multiple rounds' },
    { title: 'Creative Duo', icon: '🎨', desc: 'Filled both canvases with sheer color & love' },
    { title: 'Chaos Couple', icon: '😂', desc: 'Drew totally different things and laughed anyway' }
  ];

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <Confetti />
      <div className="glass-card" style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💕</div>
        <h1 style={{ fontSize: '2.4rem', color: '#1e293b' }}>You Survived 5 Rounds!</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 600, marginTop: '0.2rem' }}>Here is your couples chemistry report:</p>

        <div style={{ margin: '2rem 0' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ff527b', textTransform: 'uppercase' }}>Couple Affinity Score</div>
          <div style={{ fontSize: '5rem', fontWeight: 900, background: 'linear-gradient(135deg, #ff527b 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
            {avgScore}%
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#334155', marginTop: '0.4rem' }}>
            {avgScore >= 80 ? 'Telepathic Soulmates! 🧠✨' : 'Playfully Incompatible & Perfect! ❤️'}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginTop: '1.5rem' }}>
          <div className="glass-card-sm">
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#e11d48' }}>{totalRounds * 2}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Masterpieces</div>
          </div>
          <div className="glass-card-sm">
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#8b5cf6' }}>{avgScore}%</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Brain Sync</div>
          </div>
          <div className="glass-card-sm">
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#2563eb' }}>100%</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Adorableness</div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Award size={20} color="#e11d48" /> Unlocked Badges</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {achievements.map((ach) => (
            <div key={ach.title} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '2rem' }}>{ach.icon}</span>
              <div>
                <div style={{ fontWeight: 800, color: '#1e293b' }}>{ach.title}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{ach.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn-secondary" onClick={onViewMemories} style={{ padding: '0.9rem 1.8rem' }}>
          <Image size={18} /><span>Our Little Gallery 💕</span>
        </button>
        <button className="btn-primary" onClick={onPlayAgain} style={{ padding: '0.9rem 1.8rem' }}>
          <RotateCcw size={18} /><span>Play Again!</span>
        </button>
      </div>
    </div>
  );
}