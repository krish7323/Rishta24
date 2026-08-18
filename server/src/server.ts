import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import { ENV } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { generalLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import apiRoutes from './routes';
import { setupChatSocket } from './socket/chatSocket';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Attach Socket.IO to Express app for route access if needed
app.set('io', io);

// Security & Utility Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: '*', credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.use('/api', generalLimiter);

// Serve uploaded media statically
const uploadsPath = path.resolve(ENV.UPLOAD_PATH);
app.use('/uploads', express.static(uploadsPath));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'RISHTA24 Backend API Server',
    tagline: 'Har Rishta, Ek Nayi Shuruaat',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    code: 'ROUTE_NOT_FOUND',
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

import { User } from './models/User';
import { seed } from './seed/runSeed';

// Setup Socket.IO Event Handlers
setupChatSocket(io);

// Start Server
const startServer = async () => {
  await connectDatabase();

  const userCount = await User.countDocuments().catch(() => 0);
  if (userCount === 0) {
    logger.info('Database empty. Running automatic seed generator...');
    await seed(false);
  }

  server.listen(ENV.PORT, () => {
    logger.info(`=======================================================`);
    logger.info(`🚀 RISHTA24 API Server running on port ${ENV.PORT}`);
    logger.info(`🌐 Mode: ${ENV.NODE_ENV}`);
    logger.info(`📍 Health Endpoint: http://localhost:${ENV.PORT}/api/health`);
    logger.info(`💬 Socket.IO Real-Time Chat Engine: READY`);
    logger.info(`=======================================================`);
  });
};

startServer();


export { app, server, io };
