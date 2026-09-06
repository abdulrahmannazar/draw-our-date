import React, { useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';

export default function Memories({ history, onBack }) {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="btn-secondary" onClick={onBack} style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}><ArrowLeft size={16} /> Back</button>
        <h2 style={{ fontSize: '1.6rem', color: '#1e293b' }}>Our Little Gallery 💕</h2>
        <div style={{ width: '80px' }} />
      </div>

      {history.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🖼️</div>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e293b' }}>No drawings saved yet!</div>
          <p style={{ color: '#64748b', marginTop: '0.4rem' }}>Play a round with your partner to preserve your cute drawings.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {history.map((item, idx) => (
            <div key={idx} className="glass-card" onClick={() => setSelectedItem(item)} style={{ padding: '1rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'transform 0.2s ease' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>&ldquo;{item.prompt}&rdquo;</div>
              
              {/* Check if mode is Draw Together for overlay view */}
              {item.mode === 'Draw Together' ? (
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '12px', background: '#fff', border: '1px solid #8b5cf6', overflow: 'hidden' }}>
                  <img src={item.player1.drawing} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply' }} />
                  <img src={item.player2.drawing} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply' }} />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <img src={item.player1.drawing} alt={item.player1.name} style={{ width: '100%', aspectRatio: '1/1', borderRadius: '12px', background: '#fff', border: '1px solid #fda4af', objectFit: 'contain' }} />
                  <img src={item.player2.drawing} alt={item.player2.name} style={{ width: '100%', aspectRatio: '1/1', borderRadius: '12px', background: '#fff', border: '1px solid #bfdbfe', objectFit: 'contain' }} />
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700, color: '#e11d48' }}>{item.mode === 'Draw Together' ? 'Collaboration' : `${item.similarity}% match`}</span>
                <span style={{ color: '#64748b' }}>Round {item.round}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expanded Modal */}
      {selectedItem && (
        <div onClick={() => setSelectedItem(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div onClick={(e) => e.stopPropagation()} className="glass-card" style={{ maxWidth: '640px', width: '100%', padding: '1.5rem', background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', textAlign: 'center' }}>&ldquo;{selectedItem.prompt}&rdquo;</h3>
            
            {selectedItem.mode === 'Draw Together' ? (
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto 1rem auto', aspectRatio: '1/1', borderRadius: '14px', border: '2px solid #8b5cf6', background: '#fff', overflow: 'hidden' }}>
                <img src={selectedItem.player1.drawing} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply' }} />
                <img src={selectedItem.player2.drawing} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply' }} />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 700, textAlign: 'center', marginBottom: '0.4rem', color: '#e11d48' }}>{selectedItem.player1.name}</div>
                  <img src={selectedItem.player1.drawing} alt="Player 1" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '14px', border: '1px solid #e2e8f0', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, textAlign: 'center', marginBottom: '0.4rem', color: '#2563eb' }}>{selectedItem.player2.name}</div>
                  <img src={selectedItem.player2.drawing} alt="Player 2" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '14px', border: '1px solid #e2e8f0', objectFit: 'contain' }} />
                </div>
              </div>
            )}
            
            <button className="btn-secondary" onClick={() => setSelectedItem(null)} style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}