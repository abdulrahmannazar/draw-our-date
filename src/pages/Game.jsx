import React, { useRef, useState, useEffect } from 'react';
import DrawingCanvas from '../components/DrawingCanvas';
import Timer from '../components/Timer';
import ReactionBar from '../components/ReactionBar';
import Confetti from '../components/Confetti';
import { getRandomPrompt } from '../data/prompts';
import { Sparkles, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';

export default function Game({ room, socket }) {
  const canvasRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [revealedData, setRevealedData] = useState(null);
  const [recentReactions, setRecentReactions] = useState([]);
  const [timerSeconds, setTimerSeconds] = useState(room.timer || 60);

  const myPlayer = room.players.find(p => p.id === socket.id);
  const partner = room.players.find(p => p.id !== socket.id);
  const isPlayer1 = room.players[0]?.id === socket.id;

  // Dynamically change instructions based on the active mode
  let displayPrompt = `🎨 "${room.currentPrompt}"`;
  if (room.mode === 'Draw Together') {
    displayPrompt = isPlayer1
      ? `🎨 Draw the LEFT half of: "${room.currentPrompt}"`
      : `🎨 Draw the RIGHT half of: "${room.currentPrompt}"`;
  } else if (room.mode === 'Draw & Guess') {
    displayPrompt = isPlayer1
      ? `🤫 Secretly Draw: "${room.currentPrompt}"`
      : `🤔 Partner is drawing a secret! Sketch your guess!`;
  }

  useEffect(() => {
    socket.on('timer_tick', (secs) => { setTimerSeconds(secs); });
    socket.on('times_up', () => { if (!submitted) handleSubmitDrawing(); });
    socket.on('player_submitted', ({ playerId }) => { if (playerId !== socket.id) setPartnerSubmitted(true); });
    
    socket.on('start_reveal_countdown', () => {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { clearInterval(timer); return null; }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('drawings_revealed', (data) => { setRevealedData(data); });
    socket.on('reaction_received', (reaction) => { setRecentReactions(prev => [reaction, ...prev.slice(0, 5)]); });

    return () => {
      socket.off('timer_tick'); socket.off('times_up'); socket.off('player_submitted');
      socket.off('start_reveal_countdown'); socket.off('drawings_revealed'); socket.off('reaction_received');
    };
  }, [submitted]);

  const handleSubmitDrawing = () => {
    if (submitted) return;
    const drawingData = canvasRef.current ? canvasRef.current.getDrawingData() : null;
    socket.emit('submit_drawing', { drawingData });
    setSubmitted(true);
  };

  const handleNextRound = () => {
    let category = null;
    if (room.mode === 'Guess Me') category = 'Guess Me 🧠';
    
    const nextPrompt = getRandomPrompt(category);
    socket.emit('next_round', { prompt: nextPrompt });
  };

  const handleSendReaction = ({ emoji, message }) => {
    socket.emit('send_reaction', { emoji, targetPlayerId: partner?.id, message });
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {revealedData && <Confetti />}

      <div className="glass-card" style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ff527b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ROUND {room.round} / {room.maxRounds} • {room.mode}
          </div>
          <h2 style={{ fontSize: '1.25rem', color: '#1e293b', marginTop: '0.2rem' }}>{displayPrompt}</h2>
        </div>
        {!revealedData && <Timer seconds={timerSeconds} />}
      </div>

      {countdown !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99, backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '8rem', fontWeight: 900, background: 'linear-gradient(135deg, #ff80a0, #70b6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{countdown}</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#475569' }}>Hold on... Revealing both masterpieces! 💕</div>
        </div>
      )}

      {!revealedData ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#e11d48' }}>Your Canvas ❤️ ({myPlayer?.nickname})</div>
              {submitted && <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#16a34a', fontWeight: 700, fontSize: '0.9rem' }}><CheckCircle size={16} /> Saved!</div>}
            </div>

            <DrawingCanvas ref={canvasRef} readOnly={submitted} />

            {!submitted ? (
              <button className="btn-primary" onClick={handleSubmitDrawing} style={{ width: '100%', marginTop: '1rem', padding: '0.9rem' }}>
                <Sparkles size={18} /><span>I&apos;m Finished! Lock it in 💕</span>
              </button>
            ) : (
              <div style={{ marginTop: '1rem', padding: '0.9rem', borderRadius: '16px', backgroundColor: '#fdf2f8', color: '#db2777', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', width: '100%' }}>
                Your drawing is safe with us 👀 Waiting for {partner?.nickname || 'partner'}...
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#2563eb' }}>{partner?.nickname}&apos;s Canvas 🔵</div>
              {partnerSubmitted && <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#16a34a', fontWeight: 700, fontSize: '0.9rem' }}><CheckCircle size={16} /> Done!</div>}
            </div>

            <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '24px', border: '2px dashed #bfdbfe', backgroundColor: 'rgba(239, 246, 255, 0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🤫</div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1e3a8a' }}>No peeking allowed!</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.4rem' }}>
                {partnerSubmitted ? `${partner?.nickname} finished and is waiting for you!` : `${partner?.nickname} is busily sketching...`}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Round Chemistry Score</div>
            <div style={{ fontSize: '4.2rem', fontWeight: 900, background: 'linear-gradient(135deg, #ff527b, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>{revealedData.score}%</div>
            <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginTop: '0.5rem' }}>{revealedData.verdict.title}</h3>
            <p style={{ color: '#64748b', fontWeight: 600 }}>{revealedData.verdict.subtitle}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, color: '#e11d48', marginBottom: '0.8rem' }}>Your Art ❤️ ({myPlayer?.nickname})</div>
              <img src={revealedData.drawings[socket.id]} alt="My drawing" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '18px', border: '2px solid #fecdd3', objectFit: 'contain', background: '#fff' }} />
            </div>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, color: '#2563eb', marginBottom: '0.8rem' }}>{partner?.nickname}&apos;s Art 🔵</div>
              <img src={revealedData.drawings[partner?.id]} alt="Partner drawing" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '18px', border: '2px solid #bfdbfe', objectFit: 'contain', background: '#fff' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <ReactionBar onSendReaction={handleSendReaction} partnerName={partner?.nickname || 'Partner'} />
            <div className="glass-card-sm" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MessageCircle size={16} /> Partner Reactions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '140px', overflowY: 'auto' }}>
                {recentReactions.length === 0 ? (
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No reactions yet. Send some love above!</span>
                ) : (
                  recentReactions.map((r, i) => (
                    <div key={i} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', borderRadius: '12px', background: '#ffffff', border: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '1.2rem', marginRight: '0.4rem' }}>{r.emoji}</span>
                      <span style={{ fontWeight: 600 }}>{r.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {isPlayer1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button className="btn-primary" onClick={handleNextRound} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                <span>{room.round >= room.maxRounds ? 'View Final Results 🏆' : 'Next Romantic Round 💕'}</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}
          {!isPlayer1 && (
             <div style={{ textAlign: 'center', color: '#64748b', fontWeight: 700, marginTop: '1.5rem' }}>
               Waiting for host to start next round...
             </div>
          )}
        </div>
      )}
    </div>
  );
}