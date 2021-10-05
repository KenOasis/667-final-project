exports.testMain = (req, res, next) => {
  res.render('index', {title: "Test Main Page", message: "This is the test main page"});
}