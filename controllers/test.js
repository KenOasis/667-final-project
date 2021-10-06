exports.testMain = (req, res, next) => {
  res.render('index', {title: "Test Main Page", message: "This is the test main page"});
}

const db = require('../db');

exports.testDB =  (request, response) => {
    db.any(`INSERT INTO test_table ("testString") VALUES ('Hello at ${Date.now()}')`)
    .then( _ => db.any(`SELECT * FROM test_table`) )
    .then( results => response.json( results ) )
    .catch( error => {
    console.log( error )
    response.json({ error })
    })
  };