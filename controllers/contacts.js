const mongodb = require('../contacts/database');
const ObjectID = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  const result = await mongodb.getDatabase().db().collection('contact').find();
  result.toArray().then((contacts) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  })
}

const getSingle = async (req, res) => {
  const contactid = new ObjectID(req.params.id)
  const result = await mongodb.getDatabase().db().collection('contact').find({ _id: contactid });
  result.toArray().then((contacts) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts[0]);
  })
}

const createContact = async (req, res) => {
  const contacts = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  }

  const response = await mongodb.getDatabase().db().collection('contact').insertOne(contacts);
  if (response.acknowledged){
    res.status(204).send();
  }else{
    res.status(500).json(response.error)
  }
}

const updateContact = async (req, res) => {
  const contactid = new ObjectID(req.params.id)
  
  const contacts = {
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    ipaddress: req.body.ipaddress
  }

  const response = await mongodb.getDatabase().db().collection('contact').find({ _id: contactid }, contacts);
  if (response.modifiedCount > 0){
    res.status(204).send();
  }else{
    res.status(500).json(response.error)
  }
}

const deleteContact = async (req, res) => {
  const contactid = new ObjectID(req.params.id)
  
  const response = await mongodb.getDatabase().db().collection('contact').deleteOne({ _id: contactid });
  if (response.deleteCount > 0){
    res.status(204).send();
  }else{
    res.status(500).json(response.error)
  }
}


module.exports = {
  getSingle,
  getAll,
  createContact,
  updateContact,
  deleteContact
};