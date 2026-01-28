const mongodb = require('../contacts/database');
const ObjectID = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
  try {
    const users = await mongodb.getDatabase().db().collection('users').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getSingleUsers = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const userid = new ObjectID(req.params.id);
    const user = await mongodb.getDatabase().db().collection('users').findOne({ _id: userid });

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const createUsers = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.email || !req.body.firstName || !req.body.lastName) {
      return res.status(400).json({
        message: 'email, firstName, and lastName are required fields'
      });
    }

    const user = {
      googleId: req.body.googleId,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      accountCreated: req.body.accountCreated || new Date()
    };

    const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
    if (response.acknowledged) {
      res.status(201).json({ message: 'User created successfully', id: response.insertedId });
    } else {
      res.status(500).json({ message: 'Error creating user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const updateUsers = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    const userid = new ObjectID(req.params.id);
    const user = {
      googleId: req.body.googleId,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      accountCreated: req.body.accountCreated
    };

    const response = await mongodb.getDatabase().db().collection('users').replaceOne({ _id: userid }, user);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'User not found or no changes made.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const deleteUsers = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    const userid = new ObjectID(req.params.id);

    const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userid });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}


module.exports = {
  getSingleUsers,
  getAllUsers,
  createUsers,
  updateUsers,
  deleteUsers
};
