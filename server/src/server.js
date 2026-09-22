import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

import scanRoutes from './routes/scanRoutes.js';
import passRoutes from './routes/passRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import cohortRoutes from './routes/cohortRoutes.js';
import { startOverdueSweeper } from './services/overdueSweeper.js';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

// Setup Socket.io with permissive CORS for development
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

// Provide io instance to request handlers
app.set('io', io);

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Socket connection & room management
io.on('connection', (socket) => {
  console.log(`[Socket] Staff client connected: ${socket.id}`);

  socket.on('joinSession', (daySessionId) => {
    if (daySessionId) {
      socket.join(daySessionId);
      console.log(`[Socket] Client ${socket.id} joined room: ${daySessionId}`);
    }
  });

  socket.on('leaveSession', (daySessionId) => {
    if (daySessionId) {
      socket.leave(daySessionId);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Staff client disconnected: ${socket.id}`);
  });
});

// API Routes (supports both /api and /api/v1 prefixes)
app.use('/api', scanRoutes);
app.use('/api/v1', scanRoutes);
app.use('/api/passes', passRoutes);
app.use('/api/v1/passes', passRoutes);
app.use('/api/food-requests', foodRoutes);
app.use('/api/v1/food', foodRoutes);
app.use('/api', cohortRoutes);
app.use('/api/v1', cohortRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'hackme26-scan-server', timestamp: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'SERVER_ERROR'
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 HackMe '26 QR Scan & Operations Server running at http://localhost:${PORT}`);
  console.log(`📡 Socket.io server ready for staff panels at http://localhost:${PORT}`);
  // Start background overdue evaluation
  startOverdueSweeper(io);
});
