exports.getHomepage = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn === true ? true : false;
  res.status(200).render("index", { isLoggedIn });
};

exports.getLogin = (req, res, next) => {
  res.status(200).render("login");
};

exports.getSignup = (req, res, next) => {
  res.status(200).render("signup");
};

exports.getAbout = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn === true ? true : false;
  res.status(200).render("about", { isLoggedIn });
};

exports.getTransition = (req, res, next) => {
  const title = req.query.title;
  const description = req.query.description;
  const redirect_path = req.query.redirect_path;
  const page_name = req.query.page_name;
  const isLoggedIn = (req.session.isLoggedIn === true ? true : false);
  if (title && description && redirect_path && page_name) {
    res.status(200).render("transition", {
      isLoggedIn: isLoggedIn,
      title: title,
      description: description,
      redirectPath: redirect_path,
      redirectPageName: page_name,
    });
  } else {
    res.status(403).render("error", {
      errorcode: "403 Forbidden",
      description: "403 Forbidden",
      isLoggedIn: isLoggedIn,
    });
  }
};
