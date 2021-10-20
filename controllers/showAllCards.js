const db = require('../models/');
const Cards = db['cards'];
exports.showAllCards = async (req, res, next) => {
  Cards.findAll({raw: true})
    .then(cards => res.json({cards}))
    .catch(error => res.json({error}));
  
}