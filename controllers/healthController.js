const contactdb = require('../contacts/database');

const getHealth = async (req, res) => {
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
};

const getCollections = async (req, res) => {
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
};

module.exports = {
  getHealth,
  getCollections
};
