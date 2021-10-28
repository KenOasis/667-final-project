const db = require('../models');
const Users = db['users'];
const { Op } = require('sequelize');


exports.signUp = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const passwordEncrypted = Buffer.from(password).toString('base64');
  let existedUser = null;

  try {
    // checked whether the username already existed in db

    existedUser = await Users.findOne({
      where: {
          username
      }
    });

   if (existedUser !== null) {
     // TODO feedback to frontend validation
     res.status(409).render('error', { title: 'username or email existed', errorcode: ""})
     return;
   }

    // checked whether the email already existed in db

    existedUser = await Users.findOne({
      where: {
        email
      }
    });

    if (existedUser !== null) {
      // TODO feedback to frontend validation
      res.status(409).render('error', { title: 'username or email existed', errorcode: ""})
      return;
    }

    let newUser = await Users.create({
      username: username,
      email: email,
      password: passwordEncrypted,
    });
    
    // TODO add JWT Auth
    res.status(200).render('index');
  } catch (error) {
    // TODO standarize error ouput
    console.log(error)
  }
}

exports.login = async (req, res, next) => {
  const reqUsername = req.body.username;

  try {
    let user = await  Users.findOne({
      where: {username: reqUsername}
    });
    let reqPasswordEncrypted = Buffer.from(req.body.password).toString('base64')
    if (user != null) {
      if (user.password === reqPasswordEncrypted) {
        req.session.isLogIn = true;
        req.session.userId = user.id;
        // TODO feedback to user as login successfully
        res.status(200).redirect("/lobby")
      } else {
        // TODO feedback to user as password wrong 
        console.log("Wrong password");
        res.status(401).redirect("/login");
      }
    } else {
      // TODO feedback to user as username wrong
      console.log("username does not existed");
      res.status(401).redirect("/login");
    }
  } catch (error) {
    // TODO standarize error ouput
    console.log(error)
  }
}

exports.logout = (req, res, next) => {
  let sessionId = req.session.id;
  req.session.destroy(sessionId);
  // TODO notify user successfully logout
  res.status(200).render('index');
}