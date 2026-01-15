const contactdb = require('../contacts/database');

const getContacts = async (req, res) => {
  try {
    const db = contactdb.getDatabase();

    if (!db) {
      return res.status(500).json({
        message: 'Database not connected'
      });
    }

    // Collection name should be 'contact'
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
};

module.exports = {
  getContacts
};
