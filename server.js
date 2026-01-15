require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const contactdb = require('./contacts/database');

// Import routes
const professionalRoutes = require('./routes/professionalRoutes');
const contactRoutes = require('./routes/contactRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8080;

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/professional', professionalRoutes);
app.use('/contacts', contactRoutes);
app.use('/', healthRoutes);

// Graceful shutdown
async function closeResources() {
  try {
    // If contactdb has close function
    if (contactdb.closeDatabaseConnection) {
      await contactdb.closeDatabaseConnection();
      console.log('Database connection closed');
    }
  } catch (err) {
    console.error('Error closing resources:', err.message);
  }
}

process.on('SIGINT', async () => {
  console.log('SIGINT received — shutting down');
  await closeResources();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received — shutting down');
  await closeResources();
  process.exit(0);
});



// Initialize and start server
async function startServer() {
  try {
    // Initialize database connection
    contactdb.initdb((err, db) => {
      if (err) {
        console.error('⚠️ Database connection failed:', err.message);
        console.log('⚠️ Starting server with fallback mode only');
      } else {
        console.log('✅ Database connected successfully');
      }

      // Start server after database initialization attempt
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`Available endpoints:`);
        console.log(`  GET /professional`);
        console.log(`  GET /contacts`);
        console.log(`  GET /health`);
        console.log(`  GET /debug/collections`);
      });
    });

  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
