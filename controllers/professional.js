const mongodb = require('../contacts/database');

const getProfessional = async (req, res) => {
  const result = await mongodb.getDatabase().db().collection('professional').find();
  result.toArray().then((professionals) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(professionals[0]);
  })
}

module.exports = {
  getProfessional
};
