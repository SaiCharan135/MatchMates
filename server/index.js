require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const dbService = require('./services/dbService');
const apiRoutes = require('./routes/api');
const initSocketManager = require('./sockets/socketManager');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // Allows inline styles & fonts in development
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

// API Routes
app.use('/api', apiRoutes);

// Serve static frontend build if present
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If client not built yet in dev, respond with simple message
      res.status(200).send('MatchMates Game Server is running. Access the client at http://localhost:5173');
    }
  });
});

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingTimeout: 30000,
  pingInterval: 15000
});

initSocketManager(io);

// Initialize DB and Start Server
async function startServer() {
  await dbService.connect(process.env.MONGODB_URI);

  server.listen(PORT, () => {
    console.log(`\n==============================================`);
    console.log(`🎉 MatchMates Game Server Running on Port ${PORT}`);
    console.log(`📡 WebSocket ready on ws://localhost:${PORT}`);
    console.log(`🔗 API available at http://localhost:${PORT}/api`);
    console.log(`==============================================\n`);
  });
}

startServer();
