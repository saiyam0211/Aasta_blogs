const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const pitchDeckRoutes = require('./routes/pitchdeck');
const paymentRoutes = require('./routes/payments');

// Import database connection
const connectDB = require('./config/database');

// Import error handling middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// CORS configuration for frontend communication
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'https://www.aasta.food',
      'https://aasta.food',
      'http://localhost:54169/',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove any undefined values
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 204, // Set to 204 for preflight requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply middleware
app.use(cors(corsOptions)); // Enable CORS for frontend communication
app.use(express.json({ limit: '10mb' })); // JSON body parsing middleware
app.use(express.urlencoded({ extended: true })); // URL-encoded body parsing

// Request logging middleware for monitoring
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/blogs', blogRoutes); // Blog routes
app.use('/api/pitchdeck', pitchDeckRoutes); // Pitch deck routes
app.use('/api/payments', paymentRoutes); // Payment routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Blog API is running',
    timestamp: new Date().toISOString()
  });
});

// Handle 404 for undefined routes
app.use((req, res, next) => {
  const error = new Error('API endpoint not found');
  error.statusCode = 404;
  next(error);
});

// Global error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;