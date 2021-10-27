exports.getHomepage = (req, res, next) => {
    res.status(200).render('index');
}

exports.getLogin = (req, res, next) => {
    res.status(200).render('login');
}

exports.getSignup = (req, res, next) => {
    res.status(200).render('signup');
}
exports.getLobby = (req, res, next) => {
    res.status(200).render('lobby')
}