const express = require('express');
const cors = require('cors');

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const certificateRoutes = require('./routes/certificate');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', quizRoutes);
app.use('/api', certificateRoutes);

// Simple test endpoint (no database)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    env: {
      hasJWT: !!process.env.JWT_SECRET,
      hasDBHost: !!process.env.MYSQLHOST,
      hasDBPassword: !!process.env.MYSQLPASSWORD
    }
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await testConnection();
    res.json({ 
      message: 'LMS Micro-Certification Portal API is running',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'API is running but database connection failed',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// For Vercel serverless functions
module.exports = app;

// For local development
if (require.main === module) {
  const startServer = async () => {
    try {
      await testConnection();
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  startServer();
}
