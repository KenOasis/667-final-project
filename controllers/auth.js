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
     res.status(409).render('signup')
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
      res.status(409).render('signup')
      return;
    }

    let newUser = await Users.create({
      username: username,
      email: email,
      password: passwordEncrypted,
    });
    res.status(200).render("transition", { 
      isLoggedIn: true,
      title: "Successfully signup!",
      description: "Congratulation! You have successfully signup.",
      redirectPath: "/login",
      redirectPageName: "Login" 
    });
  } catch (error) {
    // TODO standarize error ouput
    console.error(error)
  }
}

exports.login = async (req, res, next) => {
  const reqUsername = req.body.username;

  try {
    let user = await  Users.findOne({
      where: {username: reqUsername}
    });
    let reqPasswordEncrypted = Buffer.from(req.body.password).toString('base64')
    if (user !== null) {
      if (user.password === reqPasswordEncrypted) {
        req.session.isLoggedIn = true;
        req.session.userId = user.id;
        res.status(200).render("transition", { 
          isLoggedIn: true,
          title: "Successfully logged in!",
          description: "Congratulation! You have successfully logged in.",
          redirectPath: "/",
          redirectPageName: "Home" 
        })
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
    console.error(error)
  }
}

exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid').status(200).render("transition", { 
      isLoggedIn: false,
      title: "Successfully logged out!",
      description: " You have successfully logged out.",
      redirectPath: "/",
      redirectPageName: "Home" 
    });
  });
}

exports.changePassword = async (req, res, next) => {
  const userId = req.session.userId;
  let reqPasswordEncrypted = Buffer.from(req.body.current_password).toString('base64')
  const newPasswordEncrypted = Buffer.from(req.body.new_password).toString('base64')
  try {
    const user = await Users.findOne({
      where: {
        id: userId
      }
    })

    if (user !== null) {
      if(user.password === reqPasswordEncrypted) {
        user.password = newPasswordEncrypted;
        user.save();
        res.status(200).json({status: "success"})
      } else {
      res.status(401).json({
        errors: [{
          msg: "Your current password is not corrected",
          param: "current_password"
        }]
      })
      }
    } else {
      throw new Error("db error!");
    }
  } catch (error) {
    console.error(error);
  }

}