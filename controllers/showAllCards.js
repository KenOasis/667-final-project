const db = require('../models/');

exports.showAllCards = async (req, res, next) => {
  db['cards'].findAll({raw: true})
    .then(cards => res.json({cards}))
    .catch(error => res.json({error}));
  
}