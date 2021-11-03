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

exports.getAbout = (req, res, next) => {
  const isLoggedIn = (req.session.isLoggedIn === true ? true : false);
  res.status(200).render('about', {isLoggedIn});
}

exports.getTransition = (req, res, next) => {
  const title = req.query.title;
  const description = req.query.description;
  const redirect_path = req.query.redirect_path;
  const page_name = req.query.page_name;
  const isLoggedIn = (req.session.isLoggedIn === true ? true : false);
  console.log(title);
  console.log(description);
  console.log(redirect_path);
  console.log(page_name);
  if (title && description && redirect_path && page_name) {
    res.status(200).render("transition", { 
      isLoggedIn: isLoggedIn,
      title: title,
      description: description,
      redirectPath: redirect_path,
      redirectPageName: page_name 
    })
  } else {
    res.status(403).render('error', {
      errorcode: "403 Forbidden",
      description: "403 Forbidden",
      isLoggedIn: isLoggedIn
    });
  }

}