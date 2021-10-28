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
     res.status(409).render('error', { title: 'username or email existed', errorcode: "409 Conflict"})
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
      res.status(409).render('error', { title: 'username or email existed', errorcode: "409 Conflict"})
      return;
    }

    let newUser = await Users.create({
      username: username,
      email: email,
      password: passwordEncrypted,
    });
    
    // TODO add JWT Auth
    res.status(200).render('login');
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
        req.session.isLoggedIn = true;
        req.session.userId = user.id;
        // TODO feedback to user as login successfully
        res.status(200).render("lobby", { isLoggedIn: true })
      } else {
        // TODO feedback to user as password wrong 
        console.log("Wrong password");
        res.status(401).render("login");
      }
    } else {
      // TODO feedback to user as username wrong
      console.log("username does not existed");
      res.status(401).render("login");
    }
  } catch (error) {
    // TODO standarize error ouput
    console.log(error)
  }
}

exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid').status(200).render('index', { isLoggedIn: false });
  });
  // TODO notify user successfully logout
  // res.status(200).render('index', { removeSession: true, sessionId: sessionId });
}