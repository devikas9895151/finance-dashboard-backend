require('dotenv').config();

const app = require('./app');
const database = require('./src/config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Initialize database
    await database.initialize();
    console.log('Database initialized successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// 👇 VERY IMPORTANT CHANGE
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// 👇 Export app for testing
module.exports = app;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});