// NOTE: if you are not filter the route here, you have to check the filter condition in the routes/controllers
// You can find example at /transition 
// Manually added path which cannot visted when logged in
const manuLoggedIn = ['/login', '/signup','/user/login', '/user/signup'];

// Manually added path which cannot visted when logged out
const manuLoggedOut= ['/user/logout', '/user/change_password' ,'/user/profile'];

// Get paths from lobby routes and game routes
const lobbyRoutes = require('../routes/api/lobby-routes');
const gameRoutes = require('../routes/api/game-routes');
const lobbyRootPath = "/lobby";
const lobbyRoutesPaths = lobbyRoutes.routes.stack.map(layer => lobbyRootPath + layer.route.path);
const gameRootPath = "/game";
const gameRoutesPaths = gameRoutes.routes.stack.map(layer => gameRootPath + layer.route.path);



const loggedInFilter = [].concat(manuLoggedIn);
const loggedOutFilter = manuLoggedOut.concat(lobbyRoutesPaths).concat(gameRoutesPaths);
const routerFilter = (req, res, next) => {
  const path = req.url;
  const isLoggedIn = (req.session.isLoggedIn === true ? true : false);

  const isForbidden = ((loggedInFilter.includes(path) && isLoggedIn ) || (loggedOutFilter.includes(path) && !isLoggedIn));
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
