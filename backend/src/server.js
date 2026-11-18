require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for seamless evaluation and deployment
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'To-Do MERN Stack Backend API is healthy and operational.',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/tasks', taskRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  console.log(`[Server] Health check available at: http://localhost:${PORT}/api/health`);
});

module.exports = app;
