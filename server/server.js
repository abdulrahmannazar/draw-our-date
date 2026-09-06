import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const rooms = new Map();

function generateSimilarity(drawingA, drawingB) {
  const lenA = drawingA ? drawingA.length : 1000;
  const lenB = drawingB ? drawingB.length : 1000;
  const ratio = Math.min(lenA, lenB) / Math.max(lenA, lenB);
  const base = Math.floor(ratio * 35) + 55;
  const jitter = Math.floor(Math.random() * 12) - 4;
  return Math.min(99, Math.max(48, base + jitter));
}

function getVerdict(score) {
  if (score >= 90) return { title: "Mind Readers! ❤️", subtitle: "Are you two telepathic or what?!" };
  if (score >= 70) return { title: "Same Brain Energy 🧠💕", subtitle: "You two are totally in sync." };
  if (score >= 50) return { title: "Pretty Close! 🎨", subtitle: "Great minds draw alike... almost!" };
  if (score >= 30) return { title: "Opposites Attract 😂", subtitle: "Different styles, perfect match." };
  return { title: "What Were You Thinking?! 😭", subtitle: "Abstract art at its finest!" };
}

io.on('connection', (socket) => {
  socket.on('create_room', ({ nickname, avatar, mode }) => {
    const code = 'LOVE-' + Math.floor(1000 + Math.random() * 9000);
    const room = {
      code,
      mode: mode || 'Same Prompt',
      players: [{ id: socket.id, nickname, avatar, ready: false, drawing: null }],
      round: 1,
      maxRounds: 5,
      gameState: 'lobby',
      timer: 60,
      timerInterval: null,
      currentPrompt: null,
      history: []
    };
    rooms.set(code, room);
    socket.join(code);
    socket.roomCode = code;
    socket.emit('room_created', room);
  });

  socket.on('join_room', ({ code, nickname, avatar }) => {
    const formattedCode = code?.trim().toUpperCase();
    const room = rooms.get(formattedCode);

    if (!room) return socket.emit('error_message', 'Room not found! Double check the code 💕');
    if (room.players.length >= 2) return socket.emit('error_message', 'Room is already full of love (2/2 players)!');

    room.players.push({ id: socket.id, nickname, avatar, ready: false, drawing: null });
    socket.join(formattedCode);
    socket.roomCode = formattedCode;
    io.to(formattedCode).emit('room_updated', room);
  });

  socket.on('toggle_ready', () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.ready = !player.ready;
      io.to(room.code).emit('room_updated', room);
    }
  });

  // NEW: Sync the game mode when the host changes it
  socket.on('update_mode', ({ mode }) => {
    const room = rooms.get(socket.roomCode);
    if (room) {
      room.mode = mode;
      io.to(room.code).emit('room_updated', room);
    }
  });

  socket.on('start_game', ({ prompt }) => {
    const room = rooms.get(socket.roomCode);
    if (!room || room.players.length < 2) return;

    room.gameState = 'drawing';
    room.currentPrompt = prompt;
    room.timer = 60;
    room.players.forEach(p => { p.drawing = null; p.submitted = false; });

    if (room.timerInterval) clearInterval(room.timerInterval);
    io.to(room.code).emit('game_started', room);

    room.timerInterval = setInterval(() => {
      room.timer -= 1;
      io.to(room.code).emit('timer_tick', room.timer);
      if (room.timer <= 0) {
        clearInterval(room.timerInterval);
        io.to(room.code).emit('times_up');
      }
    }, 1000);
  });

  socket.on('submit_drawing', ({ drawingData }) => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.drawing = drawingData;
      player.submitted = true;
    }

    io.to(room.code).emit('player_submitted', { playerId: socket.id });

    const allSubmitted = room.players.every(p => p.submitted);
    if (allSubmitted) {
      if (room.timerInterval) clearInterval(room.timerInterval);
      io.to(room.code).emit('start_reveal_countdown');
      
      setTimeout(() => {
        const p1 = room.players[0];
        const p2 = room.players[1];
        const score = generateSimilarity(p1.drawing, p2.drawing);
        const verdict = getVerdict(score);

        const roundRecord = {
          round: room.round,
          prompt: room.currentPrompt,
          player1: { name: p1.nickname, avatar: p1.avatar, drawing: p1.drawing },
          player2: { name: p2.nickname, avatar: p2.avatar, drawing: p2.drawing },
          similarity: score,
          verdict,
          reactions: []
        };

        room.history.push(roundRecord);
        room.gameState = 'revealed';

        io.to(room.code).emit('drawings_revealed', {
          drawings: { [p1.id]: p1.drawing, [p2.id]: p2.drawing },
          score,
          verdict,
          roundRecord
        });
      }, 3500);
    }
  });

  socket.on('send_reaction', ({ emoji, targetPlayerId, message }) => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    io.to(room.code).emit('reaction_received', {
      fromPlayerId: socket.id,
      targetPlayerId,
      emoji,
      message,
      timestamp: Date.now()
    });
  });

  socket.on('next_round', ({ prompt }) => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;

    if (room.round >= room.maxRounds) {
      room.gameState = 'finished';
      io.to(room.code).emit('game_finished', { history: room.history });
    } else {
      room.round += 1;
      room.gameState = 'drawing';
      room.currentPrompt = prompt;
      room.timer = 60;
      room.players.forEach(p => { p.drawing = null; p.submitted = false; });

      if (room.timerInterval) clearInterval(room.timerInterval);
      io.to(room.code).emit('round_advanced', room);

      room.timerInterval = setInterval(() => {
        room.timer -= 1;
        io.to(room.code).emit('timer_tick', room.timer);
        if (room.timer <= 0) {
          clearInterval(room.timerInterval);
          io.to(room.code).emit('times_up');
        }
      }, 1000);
    }
  });

  socket.on('play_again', () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    room.round = 1;
    room.gameState = 'lobby';
    room.history = [];
    room.players.forEach(p => { p.ready = false; p.drawing = null; p.submitted = false; });
    io.to(room.code).emit('room_updated', room);
  });

  socket.on('disconnect', () => {
    const room = rooms.get(socket.roomCode);
    if (room) {
      room.players = room.players.filter(p => p.id !== socket.id);
      if (room.players.length === 0) {
        if (room.timerInterval) clearInterval(room.timerInterval);
        rooms.delete(socket.roomCode);
      } else {
        io.to(room.code).emit('partner_disconnected');
        io.to(room.code).emit('room_updated', room);
      }
    }
  });
});

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Draw Our Date Server running on port ${PORT}`);
});