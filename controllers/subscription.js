const mongodb = require('../contacts/database');
const ObjectID = require('mongodb').ObjectId;

const getAllSubscription = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('subscription').find();
    result.toArray().then((subscriptions) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(subscriptions);
    }).catch((err) => {
      res.status(500).json({ message: 'Error retrieving subscriptions', error: err.message });
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

const getSingleSubscription = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid subscription ID format' });
    }
    const subscriptionid = new ObjectID(req.params.id)
    const result = await mongodb.getDatabase().db().collection('subscription').find({ _id: subscriptionid });
    result.toArray().then((subscriptions) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(subscriptions[0]);
    }).catch((err) => {
      res.status(500).json({ message: 'Error retrieving subscription', error: err.message });
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

const createSubscription = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.userId || !req.body.providerName || !req.body.monthlyCost || !req.body.category) {
      return res.status(400).json({
        message: 'userId, providerName, monthlyCost, and category are required fields'
      });
    }

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

    const response = await mongodb.getDatabase().db().collection('subscription').insertOne(subscriptions);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Subscription created successfully', id: response.insertedId });
    } else {
      res.status(500).json({ message: 'Error creating subscription' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const updateSubscription = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid subscription ID format' });
    }
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
      res.status(500).json({ message: 'Subscription not found or no changes made.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const deleteSubscription = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid subscription ID format' });
    }
    const subscriptionid = new ObjectID(req.params.id);

    const response = await mongodb.getDatabase().db().collection('subscription').deleteOne({ _id: subscriptionid });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}


module.exports = {
  getSingleSubscription,
  getAllSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription
}