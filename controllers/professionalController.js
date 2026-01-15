const contactdb = require('../contacts/database');

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

const getProfessional = async (req, res) => {
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
};

module.exports = {
  getProfessional
};
