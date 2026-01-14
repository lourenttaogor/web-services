require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const contactdb = require('./contacts/database'); // Assuming this has connectToDatabase and getDatabase

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8080;

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Fallback data if DB is unavailable
const fallbackProfessional = {
  professionalName: "Okuku Lourentta",
  base64Image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
  nameLink: { firstName: "Okuku", url: "https://example.com" },
  primaryDescription: "Software engineer & problem solver.",
  workDescription1: "Frontend development.",
  workDescription2: "Backend & APIs.",
  linkTitleText: "Find me on:",
  linkedInLink: { text: "LinkedIn", link: "https://linkedin.com/" },
  githubLink: { text: "GitHub", link: "https://github.com/" }
};

// Professional Route
app.get('/professional', async (req, res) => {
  try {
    const db = contactdb.getDatabase(); // Get the shared database connection
    
    if (!db) {
      throw new Error('Database not connected');
    }
    
    const collection = db.collection('professional');
    const doc = await collection.findOne({});
    
    if (doc) {
      const { _id, ...data } = doc;
      return res.json(data);
    }
    
    console.log('No document found in DB — returning fallback');
    res.json(fallbackProfessional);
    
  } catch (err) {
    console.error('Error querying MongoDB:', err.message);
    res.json(fallbackProfessional); // Fallback on error
  }
});

// Contact Route - FIXED
app.get('/contacts', async (req, res) => { // Changed from '/contact-project' to '/contacts'
  try {
    const db = contactdb.getDatabase(); 
    
    if (!db) {
      return res.status(500).json({ 
        message: 'Database not connected' 
      });
    }
    
    // FIXED: Collection name should be 'contact' not 'contact-project'
    const contacts = await db.collection('contact').find().toArray();

    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });

  } catch (err) {
    console.error('Error querying contacts:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Internal Server Error',
      error: err.message 
    });
  }
});

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    const db = contactdb.getDatabase();
    
    if (!db) {
      return res.status(500).json({ 
        status: 'unhealthy',
        message: 'Database not connected'
      });
    }
    
    // Test connection
    await db.command({ ping: 1 });
    
    res.json({
      status: 'healthy',
      database: db.databaseName, // Should show 'contact-project'
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      error: err.message
    });
  }
});

// Debug Route - List collections
app.get('/debug/collections', async (req, res) => {
  try {
    const db = contactdb.getDatabase();
    
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    res.json({
      database: db.databaseName,
      collections: collectionNames
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
