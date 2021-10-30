const db = require('../../models/');
const Users = db['users'];
const Game_Users = db['game_users'];
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

