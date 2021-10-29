const db = require('../../models/');
const Users = db['users'];
const Game_Users = db['game_users'];
const { Op } = require('sequelize');
Users.hasMany(Game_Users, {foreignKey: "user_id"});
exports.getHomepage = (req, res, next) => {
    const isLoggedIn = (req.session.isLoggedIn === true ? true : false);
    res.status(200).render('index', {isLoggedIn});
}

exports.getLogin = (req, res, next) => {
    res.status(200).render('login');
}

exports.getSignup = (req, res, next) => {
    res.status(200).render('signup');
}

exports.getLobby = (req, res, next) => {
    let isLoggedIn = (req.session.isLoggedIn === true ? true : false);
    if (isLoggedIn) {
      res.status(200).render('lobby');
    } else {
      res.status(401).render('login');
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
    
    if (results && results.length) {
      const gamePlayed = results.length;
      const game_won = (results.filter((element) => element.points > 0)).length;
      const winrate = ( game_won / gamePlayed ) * 100;
      const lostrate = 100 - winrate;
      const points = (results.map(element => element.points)).reduce((previousPoint, currentPoint) => previousPoint + currentPoint);
      res.status(200).render('profile', {
        username: results[0].username,
        email: results[0].email,
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
