const loggeInFilter = ['/login', '/signup','/auth/login', '/auth/signup'];
const loggedOutFilter = ['/auth/logout'];

// NOTE: if you are not filter the route here, you have to check the filter condition in the routes/controllers

const routerFilter = (req, res, next) => {
  const path = req.url;
  const isLoggedIn = req.session.isLoggedIn;
  const isForbidden = ((loggeInFilter.includes(path) && isLoggedIn ) || (loggedOutFilter.includes(path) && !isLoggedIn));
  if (isForbidden) {
    // TODO redirect after errorpage
    res.status(403).render('error', {
      errorcode: "403 Forbidden",
      description: "Forbidden action due to your auth status",
      isLoggedIn: isLoggedIn === true ? true : false,
    });
  } else {
    next();
  }
}

module.exports = routerFilter;
