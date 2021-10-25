exports.getHomepage = (req, res, next) => {
  res.status(200).render('index');
}

exports.login = (req, res, next) => {
  res.status(200).render('login');
}

exports.signup = (req, res, next) => {
  res.status(200).render('signup');
}