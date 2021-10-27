const db = require('../models/');
const Users = db['users'];


exports.signUp = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const passwordEncrypted = Buffer.from(password).toString('base64')
  Users.create({
    username: username,
    email: email,
    password: passwordEncrypted,
  }).then( results => 
    res.redirect('/login')
  ).catch(error => {
    console.log(error);
    res.json({error: error});
  });
}

exports.login = async (req, res, next) => {
  const reqUsername = req.body.username;

  Users.findOne({
    where: {username: reqUsername}
  }).then( (result) =>
      checkLogin(req, res, result)
  ).catch(error => {
    console.log(error);
    res.json({error: error})
  })
}

function checkLogin(req, res, result) {
  reqPasswordEncrypted = Buffer.from(req.body.password).toString('base64')

  if (result != null) {
    if (result.email == req.body.email && result.password == reqPasswordEncrypted) {
      res.status(200).redirect("/unolobby")
    } else {
      res.status(401).redirect("/login")
    }
  } else {
    res.status(401).redirect("/login");
  }
}

// exports.LoggedIn = (req, res, next) => {
//   // validation
//   req.session.isLogIn = true;
//   req.session.userId = 1;
//   console.log(req.session);
//   res.status(200).render('index');
// }

// exports.LoggedOut = (req, res, next) => {
//   let sessionId = req.session.id;
//   req.session.destroy(sessionId);
//   res.status(200).render('index');
// }

