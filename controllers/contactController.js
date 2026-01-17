const contactdb = require('../contacts/database');
const { ObjectId } = require('mongodb');

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

const getContact = async (req, res) => {
  try {
    const db = contactdb.getDatabase();

    if (!db) {
      return res.status(500).json({
        message: 'Database not connected'
      });
    }

    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
    }

    const contact = await db.collection('contact').findOne({
      _id: new ObjectId(id)
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (err) {
    console.error('Error querying contact:', err.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    });
  }
};

const createContact = async (req, res) => {
  try {
    const db = contactdb.getDatabase();

    if (!db) {
      return res.status(500).json({
        message: 'Database not connected'
      });
    }

    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        success: false,
        message: 'All fields (firstName, lastName, email, favoriteColor, birthday) are required'
      });
    }

    const newContact = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('contact').insertOne(newContact);

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      id: result.insertedId
    });

  } catch (err) {
    console.error('Error creating contact:', err.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    });
  }
};

const updateContact = async (req, res) => {
  try {
    const db = contactdb.getDatabase();

    if (!db) {
      return res.status(500).json({
        message: 'Database not connected'
      });
    }

    const { id } = req.params;
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
    }

    const updateData = {
      updatedAt: new Date()
    };

    // Only include fields that are provided
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (favoriteColor !== undefined) updateData.favoriteColor = favoriteColor;
    if (birthday !== undefined) updateData.birthday = birthday;

    const result = await db.collection('contact').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      modifiedCount: result.modifiedCount
    });

  } catch (err) {
    console.error('Error updating contact:', err.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const db = contactdb.getDatabase();

    if (!db) {
      return res.status(500).json({
        message: 'Database not connected'
      });
    }

    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
    }

    const result = await db.collection('contact').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
      deletedCount: result.deletedCount
    });

  } catch (err) {
    console.error('Error deleting contact:', err.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    });
  }
};

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
};
