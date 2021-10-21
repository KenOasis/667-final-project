const { result } = require('../db');
const db = require('../models/');
const Users = db['users'];

exports.signUp = async (req, res, next) => {
  // const username = req.body.username;
  // const email = req.body.email;
  // const password = req.body.password;
  const username = "new user";
  const email = "test@test.com";
  const password = "Nu123456789";
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