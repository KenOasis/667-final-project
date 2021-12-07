exports.getHomepage = (req, res, next) => {
  const is_logged_in = req.session.isLoggedIn === true ? true : false;
  res.status(200).render("index", { isLoggedIn: is_logged_in });
};

exports.getLogin = (req, res, next) => {
  res.status(200).render("login");
};

exports.getSignup = (req, res, next) => {
  res.status(200).render("signup");
};

exports.getAbout = (req, res, next) => {
  const is_logged_in = req.session.isLoggedIn === true ? true : false;
  res.status(200).render("about", { isLoggedIn: is_logged_in });
};

exports.getTransition = (req, res, next) => {
  const title = req.query.title;
  const description = req.query.description;
  const redirect_path = req.query.redirect_path;
  const page_name = req.query.page_name;
  const is_logged_in = req.session.isLoggedIn === true ? true : false;
  if (title && description && redirect_path && page_name) {
    res.status(200).render("transition", {
      isLoggedIn: is_logged_in,
      title: title,
      description: description,
      redirectPath: redirect_path,
      redirectPageName: page_name,
    });
  } else {
    res.status(403).render("error", {
      errorcode: "403 Forbidden",
      description: "403 Forbidden",
      isLoggedIn: is_logged_in,
    });
  }
};
