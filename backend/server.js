import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

import { createServer } from 'http';
import { Server } from 'socket.io';
import notificationRoutes from './routes/notificationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.io initialization
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.CORS_ORIGIN, 'https://talentbridge-frontend-7xsv.onrender.com', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// User socket mapping
const userSockets = new Map();
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId !== 'undefined') {
    userSockets.set(userId, socket.id);
    console.log(`🔌 User ${userId} connected via socket`);
  }

  socket.on('disconnect', () => {
    if (userId) {
      userSockets.delete(userId);
      console.log(`🔌 User ${userId} disconnected`);
    }
  });
});

// Middleware to inject IO and userSockets into req
app.use((req, res, next) => {
  req.io = io;
  req.userSockets = userSockets;
  next();
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [process.env.CORS_ORIGIN, 'https://talentbridge-frontend-7xsv.onrender.com', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Job Portal API is running' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = (port) => {
  httpServer.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });

  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${port} is already in use. Killing the old process...`);

      import('child_process').then(({ exec }) => {
        // Find the PID using the port
        exec(`netstat -ano | findstr :${port} | findstr LISTENING`, (error, stdout) => {
          if (error || !stdout.trim()) {
            console.error(`❌ Could not find process on port ${port}. Please kill it manually.`);
            process.exit(1);
          }

          // Extract PID from netstat output (last column)
          const lines = stdout.trim().split('\n');
          const pids = [...new Set(lines.map(line => line.trim().split(/\s+/).pop()))];

          console.log(`🔍 Found process(es) on port ${port}: PID ${pids.join(', ')}`);

          let killed = 0;
          pids.forEach((pid) => {
            exec(`taskkill /PID ${pid} /F`, (killErr, killStdout) => {
              killed++;
              if (killErr) {
                console.error(`❌ Failed to kill PID ${pid}:`, killErr.message);
              } else {
                console.log(`✅ Killed PID ${pid}`);
              }

              // After all PIDs are processed, restart
              if (killed === pids.length) {
                console.log(`🔄 Restarting server on port ${port}...`);
                setTimeout(() => {
                  httpServer.close();
                  const newServer = createServer(app);
                  // Re-attach socket.io to new server
                  io.attach(newServer);
                  newServer.listen(port, () => {
                    console.log(`🚀 Server running on port ${port}`);
                  });
                  newServer.on('error', (retryErr) => {
                    console.error(`❌ Failed to start server after retry:`, retryErr.message);
                    process.exit(1);
                  });
                }, 1000);
              }
            });
          });
        });
      });
    } else {
      console.error('❌ Server error:', err.message);
      process.exit(1);
    }
  });
};

startServer(PORT);

export default app;
