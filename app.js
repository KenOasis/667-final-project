if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const app = express();
const socketIO = require("./socket/socket");
// Setup for session
const session = require("express-session");
const sequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./models/");

const extendDefaultFields = (defaults, session) => {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.userId,
    userName: session.userName,
  };
};

const store = new sequelizeStore({
  db: db.sequelize,
  table: "sessions",
  extendDefaultFields: extendDefaultFields,
});

// end of setup session
const errorController = require("./controllers/static/errors");

const userRoutes = require("./routes/api/user-routes");
const staticRoutes = require("./routes/static/static-routes");
const errorRoutes = require("./routes/errors");
const lobbyRoutes = require("./routes/api/lobby-routes");
const gameRoutes = require("./routes/api/game-routes");

const routerFilter = require("./middleware/router-filter");
app.set("view engine", "pug");
app.set("views", "views");

const sessionMiddleware = session({
  secret: "This is the secret",
  store: store,
  resave: false,
  saveUninitialized: false,
});
app.use(sessionMiddleware);

store.sync();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routerFilter);

app.use("/", staticRoutes.routes);
app.use("/user", userRoutes.routes);
app.use("/lobby", lobbyRoutes.routes);
app.use("/game", gameRoutes.routes);
app.use(errorRoutes.routes);

let port_number = process.env.PORT || 3000;
const server = app.listen(port_number);

// socket.io initialize
const io = socketIO.init(server);
socketIO.initNameSpace();
// @references: https://github.com/socketio/socket.io/blob/master/examples/passport-example/index.js
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

for (const key of io._nsps.keys()) {
  io.of(key).use(wrap(sessionMiddleware));
  io.of(key).use((socket, next) => {
    if (socket.request.session.userId) {
      next();
    } else {
      next(new Error("Unauthorize"));
    }
  });
}
