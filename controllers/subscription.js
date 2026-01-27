const mongodb = require('../contacts/database');
const ObjectID = require('mongodb').ObjectId;

const getAllSubscription = async (req, res) => {
  const result = await mongodb.getDatabase().db().collection('subscription').find();
  result.toArray().then((contacts) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  })
}

const getSingleSubscription = async (req, res) => {
  const subscriptionid = new ObjectID(req.params.id)
  const result = await mongodb.getDatabase().db().collection('subscription').find({ _id: subscriptionid });
  result.toArray().then((subscriptions) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(subscriptions[0]);
  })
}

const createSubscription = async (req, res) => {
  const subscriptions = {
    _id: req.body._id,
    userId: req.body.userId,
    providerName: req.body.providerName,
    monthlyCost: req.body.monthlyCost,
    category: req.body.category,
    renewalDate: req.body.renewalDate,
    paymentMethod: req.body.paymentMethod,
    status: req.body.status,
    description: req.body.description
  }

  const response = await mongodb.getDatabase().db().collection('subscription').insertOne(subscriptions);
  if (response.acknowledged){
    res.status(204).send();
  }else{
    res.status(500).json(response.error)
  }
}

const updateSubscription = async (req, res) => {
  const subscriptionid = new ObjectID(req.params.id)
  
  const subscriptions = {
    userId: req.body.userId,
    providerName: req.body.providerName,
    monthlyCost: req.body.monthlyCost,
    category: req.body.category,
    renewalDate: req.body.renewalDate,
    paymentMethod: req.body.paymentMethod,
    status: req.body.status,
    description: req.body.description
  }

  const response = await mongodb.getDatabase().db().collection('subscription').find({ _id: subscriptionid }, subscriptions);
  if (response.modifiedCount > 0){
    res.status(204).send();
  }else{
    res.status(500).json(response.error)
  }
}

const deleteSubscription = async (req, res) => {
  const subscriptionid = new ObjectID(req.params.id)
  
  const response = await mongodb.getDatabase().db().collection('subscription').deleteOne({ _id: subscriptionid });
  if (response.deleteCount > 0){
    res.status(204).send();
  }else{
    res.status(500).json(response.error)
  }
}


module.exports = {
  getSingleSubscription,
  getAllSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription
};