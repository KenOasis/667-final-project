const { result } = require('../db');
const db = require('../models/');
const Users = db['users'];

exports.signUp = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);
  Users.create({
    username: username,
    email: email,
    password: password,
  }).then( results => res.status(200).json(
    {
      id: results.id,
      username: results.username,
      email: result.email
    }
  )).catch(error => {
    console.log(error);
    res.json({error: error});
  });
}

exports.LoggedIn = (req, res, next) => {
  // validation
  req.session.isLogIn = true;
  req.session.userId = 1;
  console.log(req.session);
  res.status(200).render('index');
}

exports.LoggedOut = (req, res, next) => {
  let sessionId = req.session.id;
  req.session.destroy(sessionId);
  res.status(200).render('index');
}