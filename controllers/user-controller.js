const db = require('../models');
const Users = db['users'];
const { Op } = require('sequelize');
const bcrpyt = require('bcrypt');
const saltround = 11;
const Game_Users = db['game_users'];
const path = require('path');
const jimp = require('jimp');
const fs = require('fs');
Users.hasMany(Game_Users, {foreignKey: "user_id"});

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
    let hashPassword = await bcrpyt.hash(password, saltround);

    let newUser = await Users.create({
      username: username,
      email: email,
      password: hashPassword,
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
  const username = req.body.username;
  const password = req.body.password;
  try {
    let user = await  Users.findOne({
      where: {
        username: username}
    });
    if (user !== null) {
      let hashPassword = user.password;
      let comparedResult = await bcrpyt.compare(password, hashPassword);
      if (comparedResult) {
        req.session.isLoggedIn = true;
        req.session.userId = user.id;
        req.session.userName = user.username;
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
    let profileImg = undefined;
    let filePath =  path.join(__dirname, "..", "public", "images", "profile", Buffer.from(req.session.userName).toString("base64") + ".jpeg");
    if ((fs.existsSync(filePath))) {
      profileImg = "/images/profile/" + Buffer.from(req.session.userName).toString("base64") + ".jpeg";
    }
    console.log(profileImg);
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


exports.profileImageUpload = (req, res, next) => {
  const filePath = req.file.path;
  const fileDir = filePath.slice(0, filePath.lastIndexOf('/'));
  // tranfer profile image to jpeg format
  if (filePath.slice(filePath.lastIndexOf(".")) !== "jpeg") {
    const newfilePath = fileDir + "/" + Buffer.from(req.session.userName).toString('base64') + ".jpeg";
    jimp.read(filePath)
    .then(lenna => {
      return lenna
        .quality(60)
        .write(newfilePath);
    })
    .catch(error => console.error(error));
    fs.unlink(filePath, err => {
      if(err) {
        console.log(err)
      } else {
        console.log("successfully delete " + filePath);
      }
    });
  }

  if (filePath) {
    res.status(200).redirect("/user/profile");
  } else {
    res.status(400).json({
      errors: "file upload failed"
    })
  }
}