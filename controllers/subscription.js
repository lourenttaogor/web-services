const mongodb = require('../contacts/database');
const ObjectID = require('mongodb').ObjectId;


const createSubscription = async (req, res) => {
  const subscriptions = {
    userId: new ObjectID(req.body.userId), 
    monthlyCost: req.body.monthlyCost,
    category: req.body.category,
    renewalDate: req.body.renewalDate,
    paymentMethod: req.body.paymentMethod,
    status: req.body.status,
    description: req.body.description
  };

  const response = await mongodb.getDatabase().db().collection('subscription').insertOne(subscriptions);
  if (response.acknowledged) {
    res.status(204).json(response); 
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the subscription.');
  }
};

const updateSubscription = async (req, res) => {
  const subscriptionid = new ObjectID(req.params.id);
  const subscriptions = {
    userId: new ObjectID(req.body.userId),
    providerName: req.body.providerName,
    monthlyCost: req.body.monthlyCost,
    category: req.body.category,
    renewalDate: req.body.renewalDate,
    paymentMethod: req.body.paymentMethod,
    status: req.body.status,
    description: req.body.description
  };


  const response = await mongodb.getDatabase().db().collection('subscription').replaceOne({ _id: subscriptionid }, subscriptions);
  
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Update failed or no changes made.');
  }
};

const deleteSubscription = async (req, res) => {
  const subscriptionid = new ObjectID(req.params.id);
  
  // FIX: deletedCount, not deleteCount
  const response = await mongodb.getDatabase().db().collection('subscription').deleteOne({ _id: subscriptionid });
  
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Delete failed - document might not exist.');
  }
};


module.exports = {
  getSingleSubscription,
  getAllSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription
};