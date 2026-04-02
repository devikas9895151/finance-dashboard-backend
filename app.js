const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./src/middleware/errorHandler');
const authRoutes = require('./src/modules/auth/auth.routes');
const userRoutes = require('./src/modules/users/user.routes');
const recordRoutes = require('./src/modules/records/record.routes');
const dashboardRoutes = require('./src/modules/dashboard/dashboard.routes');
const ApiError = require('./src/utils/ApiError');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Request parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res, next) => {
  next(ApiError.notFound(`Cannot ${req.method} ${req.path}`));
});

// Error handler
app.use(errorHandler);

module.exports = app;
