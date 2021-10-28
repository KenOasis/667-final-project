exports.Error404 = (req, res, next) => {
  res.status(404).render('error', {
    errorcode: "404 Not Found",
    description: "Resource cannot be founded"
  });
};