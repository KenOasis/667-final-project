// NOTE: if you are not filter the route here, you have to check the filter condition in the routes/controllers
// You can find example at /transition
// Manually added path which cannot visted when logged in
const forbid_logged_in = ["/login", "/signup", "/user/login", "/user/signup"];

// Manually added path which cannot visted when logged out
const forbid_logged_out = [
  "/user/logout",
  "/user/change_password",
  "/user/profile",
];

// Get paths from lobby routes and game routes
const lobby_routes = require("../routes/api/lobby-routes");
const game_routes = require("../routes/api/game-routes");
const lobby_path = "/lobby";
const lobby_route_paths = lobby_routes.routes.stack.map(
  (layer) => lobby_path + layer.route.path
);
const game_path = "/game";
const game_route_paths = game_routes.routes.stack.map(
  (layer) => game_path + layer.route.path
);

const logged_in_filter = [].concat(forbid_logged_in);
const logged_out_filter = forbid_logged_out
  .concat(lobby_route_paths)
  .concat(game_route_paths);
const routerFilter = (req, res, next) => {
  const path = req.url;
  const is_logged_in = req.session.isLoggedIn === true ? true : false;

  const is_forbidden =
    (logged_in_filter.includes(path) && is_logged_in) ||
    (logged_out_filter.includes(path) && !is_logged_in);
  if (is_forbidden) {
    // TODO redirect after errorpage
    res.status(403).render("error", {
      errorcode: "403 Forbidden",
      description: "Forbidden action due to your auth status",
      isLoggedIn: is_logged_in === true ? true : false,
    });
  } else {
    next();
  }
};

module.exports = routerFilter;
