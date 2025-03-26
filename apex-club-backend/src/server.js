require('dotenv').config();
const express = require('express');
const connectDB = require('./utils/database');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const socketIo = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const contentRoutes = require('./routes/content.routes');
const communityRoutes = require('./routes/community.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const transactionRoutes = require('./routes/transaction.routes');

// Import middleware
const { errorHandler } = require('./middleware/error.middleware');
const { authMiddleware } = require('./middleware/auth.middleware');

const app = express();
const httpServer = createServer(app);
const io = socketIo(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authMiddleware, userRoutes);
app.use('/api/v1/content', authMiddleware, contentRoutes);
app.use('/api/v1/community', authMiddleware, communityRoutes);
app.use('/api/v1/analytics', authMiddleware, analyticsRoutes);
app.use('/api/v1/transactions', authMiddleware, transactionRoutes);

// Error handling
app.use(errorHandler);

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room ${roomId}`);
    });

    socket.on('message', async (data) => {
        // Broadcast message to room
        io.to(data.roomId).emit('message', {
            ...data,
            timestamp: new Date()
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Database connection
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    httpServer.close(() => process.exit(1));
});

module.exports = { app, io }; // Export for testing