require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const contactdb = require('./contacts/database');
const ObjectId = require('mongodb').ObjectId;

const app = express();

// Allow cross-origin requests from the frontend if it's served from a different origin
app.use(cors());
// Serve JSON and URL-encoded bodies if you add POST endpoints later
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL; // set this in your .env file
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'web_services';

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

let dbClient = null;
let db = null;

async function connectMongo() {
  if (!MONGO_URL) {
    console.warn('MONGO_URL not set — using fallback data only');
    return;
  }

  try {
    dbClient = new MongoClient(MONGO_URL);
    await dbClient.connect();
    db = dbClient.db(MONGO_DB_NAME);
    console.log('Connected to MongoDB:', MONGO_DB_NAME);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    db = null;
  }
}

// Connect on startup (do not block server start if DB fails)
connectMongo().catch(err => console.error(err));

app.get('/professional', async (req, res) => {
  if (db) {
    try {
      const collection = db.collection('professional');
      const doc = await collection.findOne({});
      if (doc) {
        const { _id, ...data } = doc;
        return res.json(data);
      }
      console.log('No document found in DB — returning fallback');
    } catch (err) {
      console.error('Error querying MongoDB:', err.message);
    }
  }
  // Fallback
  res.json(fallbackProfessional);
});


//get Contact

app.get('/contact-project', async (req, res) => {
    try {
        // 1. Use the exported getDatabase function correctly
        const db = contactdb.getDatabase(); 
        // 2. Await the toArray() directly for cleaner code
        const contact = await db.collection('contact-project').find().toArray();

        // 3. Send the actual data (remove quotes from 'contact')
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contact); 

    } catch (err) {
        console.error('Error querying MongoDB:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Graceful shutdown
async function closeResources() {
  try {
    if (dbClient) {
      await dbClient.close();
      console.log('MongoDB connection closed');
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

contactdb.initdb((err) => {
  if (err) {
    console.error('Failed to initialize database module:', err);
  } else {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  }
});