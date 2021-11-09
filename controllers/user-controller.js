const db = require('../models');
const Users = db['users'];
const { Op } = require('sequelize');
const bcrpyt = require('bcrypt');
const saltround = 11;
const Game_Users = db['game_users'];
const path = require('path');
const { randomInt } = require('crypto');
Users.hasMany(Game_Users, {foreignKey: "user_id"});
const url = require('url');

exports.signUp = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  let existedUser = null;
  
  try {
    // checked whether the username already existed in db

    existedUser = await Users.findOne({
      where: {
          username
      }
    });

   if (existedUser !== null) {
     return res.status(409).json({errors: [{
       param: "username",
       msg: username + " already exists!"
     }]});
   }

    // checked whether the email already existed in db

    existedUser = await Users.findOne({
      where: {
        email
      }
    });

    if (existedUser !== null) {
      return res.status(409).json({errors: [{
        param: "email",
        msg: "Email already exists!"
      }]});
    }
    let hashPassword = await bcrpyt.hash(password, saltround);

    let newUser = await Users.create({
      username: username,
      email: email,
      password: hashPassword,
    });

    return res.status(200).json({url: url.format({
      pathname:"/transition",
      query: {
         "title": "Successfully signup!",
         "description": "Congratulation! You have successfully signed up.",
         "redirect_path": "/login",
         "page_name": "Login" 
       }
    })});
  } catch (error) {
    // TODO standarize error ouput
    console.error(error)
  }
}

exports.login = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    let user = await  Users.findOne({
      where: {
        username: username
      }
    });
    if (user !== null) {
      let hashPassword = user.password;
      let comparedResult = await bcrpyt.compare(password, hashPassword);
      if (comparedResult) {
        req.session.isLoggedIn = true;
        req.session.userId = user.id;
        req.session.userName = user.username;
        return res.status(200).json({url: url.format({
          pathname:"/transition",
          query: {
             "title": "Successfully signup!",
             "description": "Congratulation! You have successfully logged in.",
             "redirect_path": "/lobby",
             "page_name": "Game Lobby" 
           }
        })});
      } else {
        return res.status(401).json({errors: [{
          param: "password",
          msg: "Entered password is wrong"
        }]});
      }
    } else {
      return res.status(401).json({errors: [{
        param: "username",
        msg: "Username does not exist!"
      }]});
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
      description: " You have successfully been logged out.",
      redirectPath: "/",
      redirectPageName: "Home" 
    });
  });
}

exports.changePassword = async (req, res, next) => {
  const userId = req.session.userId;
  const current_password = req.body.current_password;
  const new_password = req.body.new_password;
  try {
    const user = await Users.findOne({
      where: {
        id: userId
      }
    })

    if (user !== null) {
      let hashPassword = user.password;
      let comparedResult = await bcrpyt.compare(current_password, hashPassword);
      if(comparedResult) {
        user.password = await bcrpyt.hash(new_password, saltround);
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

exports.getProfile = async (req, res, next) => {
  const userId = req.session.userId;
  try {
    let results = await Users.findAll({
      raw: true,
      attributes: ["username", "email", "created_at", "game_users.points"],
      where: {
        id: userId
      },
      include: [{
        model: Game_Users,
        attributes: [],
        required: true
      }]
    });
    let profileImg = `/images/profile/profile${Math.floor(Math.random() * 3) + 1}.gif`;
    if (results && results.length) {
      const gamePlayed = results.length;
      const game_won = (results.filter((element) => element.points > 0)).length;
      const winrate = ( game_won / gamePlayed ) * 100;
      const lostrate = 100 - winrate;
      const points = (results.map(element => element.points)).reduce((previousPoint, currentPoint) => previousPoint + currentPoint);
  
      res.status(200).render('profile', {
        username: results[0].username,
        email: results[0].email,
        profileImg: profileImg,
        gamePlayed: gamePlayed,
        winrate: winrate,
        lostrate: lostrate,
        points: points
      })
    } else if (results.length === 0) {
      let user = await Users.findOne({
        where: {
          id: userId
        }
      })
      res.status(200).render('profile', {
        username: user.username,
        email: user.email,
        profileImg: profileImg,
        gamePlayed: 0,
        winrate: 100,
        lostrate: 0,
        points: 0
      })
      return;
    } else {
      throw new Error("db error");
    }
  } catch (error) {
    console.error(error);
  }
}

