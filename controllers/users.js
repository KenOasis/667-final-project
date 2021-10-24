const { result } = require('../db');
const db = require('../models/');
const Users = db['users'];


exports.signUp = async (req, res, next) => {
  console.log("===========================#===============##==============#==========")
  console.log(req.body)
  console.log(req.body.username)
  console.log("===========================#===============##==============#==========")
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  // const username = "new user";
  // const email = "test@test.com";
  // const password = "Nu123456789";
  Users.create({
    username: username,
    email: email,
    password: password,
  }).then( results => res.status(200).json(
    {
      id: results.id,
      username: results.username,
      email: results.email
    }
  )).catch(error => {
    console.log(error);
    res.json({error: error});
  });
}

exports.signUpPut = async (req, res, next) => {
  console.log("PUT REqUEST")
  this.signUp(req, res, next)
}

exports.signUpPost = async (req, res, next) => {
  console.log("POST REqUEST")
  this.signUp(req, res, next)
}

exports.signUpGet = async (req, res, next) => {
  console.log("GET REqUEST")
  this.signUp(req, res, next)
}
