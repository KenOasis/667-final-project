exports.Error404 = (req, res, next) => {
  let isLoggedIn = (req.session.isLoggedIn === true ? true : false);
  res.status(404).render('error', {
    errorcode: "404 Not Found",
    description: "Resource cannot be founded",
    isLoggedIn: true
  });
};