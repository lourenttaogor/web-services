const mongodb = require('../contacts/database');
const ObjectID = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
  const users = await mongodb.getDatabase().db().collection('users').find().toArray();
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(users);
};

const getSingleUsers = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).json('Invalid ID format');
  }
  const userid = new ObjectID(req.params.id);
  const user = await mongodb.getDatabase().db().collection('users').findOne({ _id: userid });
  
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(user);
};

const createUsers = async (req, res) => {
  const user = {
    googleId: req.body.googleId,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    accountCreated: req.body.accountCreated || new Date() 
  };

  const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
  if (response.acknowledged) {
    res.status(201).json(response); 
  } else {
    res.status(500).json('An error occurred while creating the user.');
  }
};

const updateUsers = async (req, res) => {
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
    res.status(500).json('Update failed or no changes made.');
  }
};

const deleteUsers = async (req, res) => {
  const userid = new ObjectID(req.params.id);
  
  
  const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userid });
  
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json('Could not find the user to delete.');
  }
};

module.exports = {
  getSingleUsers,
  getAllUsers,
  createUsers,
  updateUsers,
  deleteUsers
};
