const loggeInFilter = ['/login', '/signup','/auth/login', '/auth/signup'];
const loggedOutFilter = ['/auth/logout', '/lobby'];

const routerFilter = (req, res, next) => {
  const path = req.url;
  const isLoggedIn = req.session.isLoggedIn;
  const isForbidden = ((loggeInFilter.includes(path) && isLoggedIn ) || (loggedOutFilter.includes(path) && !isLoggedIn));
  if (isForbidden) {
    // TODO redirect after errorpage
    res.status(403).render('error', {
      title: "Error 403",
      errorcode: "403 Forbidden",
      isLoggedIn: isLoggedIn === true ? true : false
    });
  } else {
    next();
  }
}

module.exports = routerFilter;
