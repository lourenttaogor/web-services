const mongodb = require('../contacts/database');
const ObjectID = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('contact').find();
    result.toArray().then((contacts) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(contacts);
    }).catch((err) => {
      res.status(500).json({ message: 'Error retrieving contacts', error: err.message });
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

const getSingle = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }
    const contactid = new ObjectID(req.params.id)
    const result = await mongodb.getDatabase().db().collection('contact').find({ _id: contactid });
    result.toArray().then((contacts) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(contacts[0]);
    }).catch((err) => {
      res.status(500).json({ message: 'Error retrieving contact', error: err.message });
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

const createContact = async (req, res) => {
  try {
    if (!req.body.firstName || !req.body.lastName || !req.body.email) {
      return res.status(400).json({
        message: 'firstName, lastName, and email are required fields'
      });
    }

    const contacts = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    }

    const response = await mongodb.getDatabase().db().collection('contact').insertOne(contacts);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Contact created successfully', id: response.insertedId });
    } else {
      res.status(500).json({ message: 'Error creating contact' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

const updateContact = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }
    const contactid = new ObjectID(req.params.id)

    const contacts = {
      username: req.body.username,
      email: req.body.email,
      name: req.body.name,
      ipaddress: req.body.ipaddress
    }

    const response = await mongodb.getDatabase().db().collection('contact').replaceOne({ _id: contactid }, contacts);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Contact not found or no changes made' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

const deleteContact = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }
    const contactid = new ObjectID(req.params.id)

    const response = await mongodb.getDatabase().db().collection('contact').deleteOne({ _id: contactid });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Contact not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}


module.exports = {
  getSingle,
  getAll,
  createContact,
  updateContact,
  deleteContact
};