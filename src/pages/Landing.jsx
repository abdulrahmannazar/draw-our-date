import React from 'react';
import { Heart, Sparkles, Pencil } from 'lucide-react';

export default function Landing({ onNavigate }) {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '999px',
          background: 'rgba(255, 128, 160, 0.15)',
          color: '#e11d48',
          fontSize: '0.9rem',
          fontWeight: 700,
          marginBottom: '1.5rem'
        }}
      >
        <Sparkles size={16} />
        <span>The Romantic Drawing Game for Two</span>
      </div>

      <h1 style={{ fontSize: '3.4rem', letterSpacing: '-0.02em', lineHeight: 1.15, color: '#1e293b', marginBottom: '1rem' }}>
        Draw Our Date <span style={{ color: '#ff527b' }}>💕</span>
      </h1>

      <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569', maxWidth: '580px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
        Draw it. Reveal it. Discover how similarly — or hilariously differently — you and your favorite person think.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
        <button className="btn-primary" onClick={() => onNavigate('create')} style={{ fontSize: '1.15rem', padding: '1rem 2.2rem' }}>
          <Heart size={20} fill="#ffffff" />
          <span>Create a Room</span>
        </button>
        <button className="btn-secondary" onClick={() => onNavigate('join')} style={{ fontSize: '1.15rem', padding: '1rem 2.2rem' }}>
          <Pencil size={20} />
          <span>Join with Code</span>
        </button>
      </div>

      <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1.5rem', alignItems: 'center', maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '20px', background: '#ffffff', border: '2px dashed #fbcfe8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <span style={{ fontSize: '3rem' }}>🏖️🍹</span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem', fontWeight: 600 }}>&ldquo;Beach picnic date&rdquo;</span>
          </div>
          <div style={{ marginTop: '0.6rem', fontWeight: 700, color: '#e11d48' }}>You ❤️</div>
        </div>

        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff80a0, #70b6ff)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(255, 82, 123, 0.3)' }}>
          VS
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '20px', background: '#ffffff', border: '2px dashed #bfdbfe', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <span style={{ fontSize: '3rem' }}>🍕⛺</span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem', fontWeight: 600 }}>&ldquo;Camping with pizza&rdquo;</span>
          </div>
          <div style={{ marginTop: '0.6rem', fontWeight: 700, color: '#2563eb' }}>Partner 🔵</div>
        </div>
      </div>
      <div style={{ marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
        🔒 Private 2-player rooms • Real-time synchronous reveal
      </div>
    </div>
  );
}