import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import HeartBackground from './components/HeartBackground';
import Landing from './pages/Landing';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Results from './pages/Results';
import Memories from './pages/Memories';
import { Heart } from 'lucide-react';

const socket = io();

export default function App() {
  const [view, setView] = useState('landing');
  const [room, setRoom] = useState(null);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('❤️');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    socket.on('room_created', (newRoom) => {
      setRoom(newRoom);
      setView('lobby');
    });

    socket.on('room_updated', (updatedRoom) => {
      setRoom(updatedRoom);
      if (updatedRoom.gameState === 'lobby') {
        setView('lobby');
      }
    });

    socket.on('game_started', (gameRoom) => {
      setRoom(gameRoom);
      setView('game');
    });

    socket.on('round_advanced', (gameRoom) => {
      setRoom(gameRoom);
      setView('game');
    });

    socket.on('game_finished', ({ history }) => {
      setGameHistory(history);
      setView('results');
    });

    socket.on('error_message', (msg) => {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(''), 3500);
    });

    socket.on('partner_disconnected', () => {
      setErrorMessage('Partner disconnected from the room 🥺');
    });

    return () => {
      socket.off('room_created');
      socket.off('room_updated');
      socket.off('game_started');
      socket.off('round_advanced');
      socket.off('game_finished');
      socket.off('error_message');
      socket.off('partner_disconnected');
    };
  }, []);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    socket.emit('create_room', { nickname: nickname.trim(), avatar });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!nickname.trim() || !roomCodeInput.trim()) return;
    socket.emit('join_room', { code: roomCodeInput.trim(), nickname: nickname.trim(), avatar });
  };

  const handlePlayAgain = () => {
    socket.emit('play_again');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <HeartBackground />

      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '2rem',
          cursor: 'pointer',
          zIndex: 10
        }}
        onClick={() => setView('landing')}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff80a0, #70b6ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255, 128, 160, 0.3)'
          }}
        >
          <Heart size={20} fill="#ffffff" color="#ffffff" />
        </div>
        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>Draw Our Date</span>
      </header>

      {errorMessage && (
        <div
          style={{
            position: 'fixed',
            top: '1.5rem',
            zIndex: 1000,
            background: '#fee2e2',
            border: '1.5px solid #f87171',
            color: '#b91c1c',
            padding: '0.75rem 1.5rem',
            borderRadius: '999px',
            fontWeight: 700,
            boxShadow: '0 8px 20px rgba(239, 68, 68, 0.2)'
          }}
        >
          {errorMessage}
        </div>
      )}

      <main style={{ width: '100%', zIndex: 1, flex: 1 }}>
        {view === 'landing' && <Landing onNavigate={(dest) => setView(dest)} />}

        {view === 'create' && (
          <div className="glass-card" style={{ maxWidth: '420px', margin: '2rem auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '0.4rem' }}>Create Your Room 💕</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Set up your cute drawing room for two.
            </p>

            <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Your Nickname</label>
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Sarah, Honeybun..."
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '14px',
                    border: '1.5px solid #e2e8f0',
                    outline: 'none',
                    marginTop: '0.3rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Pick an Emoji Avatar</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                  {['❤️', '🌸', '🧸', '🍓', '✨', '🔵'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setAvatar(emoji)}
                      style={{
                        flex: 1,
                        fontSize: '1.4rem',
                        padding: '0.4rem',
                        borderRadius: '12px',
                        border: avatar === emoji ? '2px solid #ff527b' : '1px solid #e2e8f0',
                        background: avatar === emoji ? '#fff1f2' : '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Create Room ❤️
              </button>
            </form>
          </div>
        )}

        {view === 'join' && (
          <div className="glass-card" style={{ maxWidth: '420px', margin: '2rem auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '0.4rem' }}>Join Room 💕</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Enter the room code sent by your partner.
            </p>

            <form onSubmit={handleJoinRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Room Code</label>
                <input
                  type="text"
                  required
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. LOVE-4821"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '14px',
                    border: '1.5px solid #e2e8f0',
                    outline: 'none',
                    marginTop: '0.3rem',
                    fontSize: '1rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}
                />
              </div>

              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Your Nickname</label>
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Alex..."
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '14px',
                    border: '1.5px solid #e2e8f0',
                    outline: 'none',
                    marginTop: '0.3rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Pick an Emoji Avatar</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                  {['🔵', '🐻', '🥑', '🌙', '🎨', '❤️'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setAvatar(emoji)}
                      style={{
                        flex: 1,
                        fontSize: '1.4rem',
                        padding: '0.4rem',
                        borderRadius: '12px',
                        border: avatar === emoji ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                        background: avatar === emoji ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Join My Partner 💕
              </button>
            </form>
          </div>
        )}

        {view === 'lobby' && room && (
          <Lobby room={room} socket={socket} isHost={room.players[0]?.id === socket.id} />
        )}

        {view === 'game' && room && (
          <Game room={room} socket={socket} />
        )}

        {view === 'results' && (
          <Results
            history={gameHistory}
            onPlayAgain={handlePlayAgain}
            onViewMemories={() => setView('memories')}
          />
        )}

        {view === 'memories' && (
          <Memories
            history={gameHistory}
            onBack={() => setView('results')}
          />
        )}
      </main>
    </div>
  );
}