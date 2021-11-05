const db = require("../../models/");
const Users = db["users"];
const Game_Users = db["game_users"];
Users.hasMany(Game_Users, { foreignKey: "user_id" });
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

exports.getLobby = async (req, res, next) => {
  let isLoggedIn = req.session.isLoggedIn === true ? true : false;
  if (isLoggedIn) {
    const io = require("../../socket/socket").getIO();
    const username = req.session.userName;
    let userList = [];
    io.on("connect", (socket) => {
      socket.join("lobby");
      io.in("lobby")
        .fetchSockets()
        .then((sockets) => {
          userList = sockets.map((socket) => {
            return {
              username: socket.request.session.userName,
              user_id: socket.request.session.userId,
              status: "free", //TODO status should be change as join/start the game
            };
          });
          io.to(socket.id).emit("userName", username);
          io.to("lobby").emit("userJoin", userList);
        });
    });

    io.on("connection", (socket) => {
      socket.on("disconnect", () => {
        io.in("lobby")
          .fetchSockets()
          .then((sockets) => {
            userList = sockets.map((socket) => {
              return {
                username: socket.request.session.userName,
                user_id: socket.request.session.userId,
                status: "free",
              };
            });
            io.to("lobby").emit("userJoin", userList);
          });
      });
    });
    res.status(200).render("lobby");
  } else {
    res.status(401).render("login");
  }
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
  const isLoggedIn = req.session.isLoggedIn === true ? true : false;

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
