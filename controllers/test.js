exports.testMain = (req, res, next) => {
  res.render('index', {title: "Test Main Page", message: "This is the test main page"});
}
exports.login = (req, res)=>{
  res.render("../views/login.pug")
}
exports.register = (req, res)=>{
  res.render("../views/register.pug")
}
const db = require('../db');

exports.testDB =  (req, res, next) => {
    db.any(`INSERT INTO test_table ("testString") VALUES ('Hello at ${Date.now()}')`)
    .then( _ => db.any(`SELECT * FROM test_table`) )
    .then( results => res.json( results ))
    .catch( error => {
    console.log( error )
    res.json({ error })
    })
  };