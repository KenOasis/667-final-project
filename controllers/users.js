// const { raw } = require('body-parser');
// const { response } = require('express');
// const { result } = require('../db');
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

exports.login = async (req, res, next) => {
  const reqUsername = req.body.username;
  const reqEmail = req.body.email;
  const reqPassword = req.body.password;

  Users.findOne({
    where: {username: reqUsername}
  }).then( (result) =>
      checkLogin(req, res, result)
  ).catch(error => {
    console.log(error);
    res.json({error: error})
  })
}

function checkLogin(req, res, result) {
  if (result != null) {
    if (result.email == req.body.email && result.password == req.body.password) {
      res.status(200).redirect("/unolobby")
    } else {
      res.status(401).redirect("/login")
    }
  } else {
    res.status(401).redirect("/login");
  }
}
