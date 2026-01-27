const mongodb = require('../contacts/database');
const ObjectID = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
  const result = await mongodb.getDatabase().db().collection('users').find();
  result.toArray().then((user) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);
  })
}

const getSingleUsers = async (req, res) => {
  const userid = new ObjectID(req.params.id)
  const result = await mongodb.getDatabase().db().collection('users').find({ _id: userid });
  result.toArray().then((user) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user[0]);
  })
}

const createUsers = async (req, res) => {
  const user = {
    googleId: req.body.googleId,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    accountCreated: req.body.accountCreated
  }

  const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
  if (response.acknowledged){
    res.status(204).send();
  }else{
    res.status(500).json(response.error)
  }
}

const updateUsers = async (req, res) => {
  const userid = new ObjectID(req.params.id)
  
  const user = {
    googleId: req.body.googleId,
    email: req.body.email,
    firstName: req.body.firstName,
    accountCreated: req.body.accountCreated
  }

  const response = await mongodb.getDatabase().db().collection('users').find({ _id: userid }, user);
  if (response.modifiedCount > 0){
    res.status(204).send();
  }else{
    res.status(500).json(response.error)
  }
}

const deleteUsers = async (req, res) => {
  const userid = new ObjectID(req.params.id)
  
  const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userid });
  if (response.deleteCount > 0){
    res.status(204).send();
  }else{
    res.status(500).json(response.error)
  }
}


module.exports = {
  getSingleUsers,
  getAllUsers,
  createUsers,
  updateUsers,
  deleteUsers
};