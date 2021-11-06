const gameListManager = require('../../data/game-list-monitor');

exports.createGame = async (req, res, next) => {
  const game_name = req.body.game_name;

  const user = {
    user_id: req.session.userId,
    username: req.session.userName
  }

  try {
    await gameListManager.createGame(game_name, user);
    const gameList = gameListManager.getGameList();
    const io = require('../../socket/socket').getIO();
    io.to("lobby").emit("gameListUpdate", gameList);
    io.to("lobby").emit("updateUserStatus", {
      username: req.session.userId,
      status: "ready"
    })
    return res.status(200).json({ 
      status: "success",
      message: "Game: " + game_name + " is created!"
    })
  } catch (err) {
    console.error(err);
  }
}

exports.joinGame = (req, res, next) => {
  const game_id = req.body.game_id;

  // TODO broadcast the join status to all users, update lobby state
}

exports.leaveGame = (req, res, next) => {
  const game_id = req.body.game_id;  
  // TODO broadcast the leave status to all users, update lobby state
  // Get penalty inside the game.
}

exports.startGame = (req, res, next) => {
  const game_id = req.body.game_id;
  // TODO start the game and update lobby state
  // initial game and render a game view to all users 
}

exports.getLobby = async (req, res, next) => {
  let isLoggedIn = req.session.isLoggedIn === true ? true : false;
  if (isLoggedIn) {
    const io = require("../../socket/socket").getIO();
    const username = req.session.userName;
    let userList = [];
    io.on("connection", (socket) => {
      io.removeAllListeners();
      socket.join("lobby");
      io.in("lobby")
        .fetchSockets()
        .then((sockets) => {
          // filter possible garbage info
          userList = sockets.filter(socket => socket.request.session.userName!== username);
          userList = userList.map((socket) => {
            return {
              username: socket.request.session.userName,
              status: socket.request.session.userStatus,
              socket: socket.id,
            };
          });
          userList.unshift({
            username: username,
            status: "free",
            socket: socket.id
          })
          // filter to ensure the unique of the userList
          // Because the bug of socket.io which garbage collection is run periodically (not immeadiately)
          // that may cause memory leak (since is not fast enough) which have duplicted sockets in the memory
          io.to(socket.id).emit("userListInitial", {
            user_list: userList
          });
          io.volatile.to("lobby").emit("updateUserStatus", {
            username: username,
            status: "join",
            socket: socket.id
          });
          const gameList = gameListManager.getGameList();
          io.to("lobby").emit("gameListUpdate", gameList);
        });
    });

    io.on("connection", (socket) => {
      socket.on("disconnect", () => {
        socket.volatile.to("lobby").emit("updateUserStatus", {
          username: username,
          status: "leave",
          socket: socket.id
        })
      });
    });
    return res.status(200).render("lobby", {whoami: username});
  } else {
    return res.status(401).render("login");
  }
};
 