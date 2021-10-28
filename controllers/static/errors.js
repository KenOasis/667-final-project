exports.Error404 = (req, res, next) => {
  res.status(404).render('error', {title: 'Page Not Found!', errorcode: "404 Not Found"});
};