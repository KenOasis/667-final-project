const { result } = require('../db');
const db = require('../models/');
const Users = db['users'];


exports.signUp = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  Users.create({
    username: username,
    email: email,
    password: password,
  }).then( results => 
    res.redirect('/login')
  ).catch(error => {
    console.log(error);
    res.json({error: error});
  });
}

