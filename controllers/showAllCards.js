const db = require('../db');

exports.showAllCards = (req, res, next) => {
  db.any(`SELECT * FROM cards`)
    .then( results => res.json( results ))
    .catch( error => {
    console.log( error )
    res.json({ error })
    })
}