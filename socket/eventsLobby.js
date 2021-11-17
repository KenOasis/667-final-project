const gameListManager = require("../volatile/gameListManager");
var crypto = require("crypto");

exports.joinLobby = (user, currentUserStatus) => {
  const io = require("./socket").getIO();
  let userList = [];

  // This is where established the connection for lobby
  io.on("connection", (socket) => {
    io.removeAllListeners();
    socket.join("lobby");
    // listen to the client event of disconnect
    socket.on("disconnect", () => {
      const gameList = gameListManager.userLeaveLobby(user.user_id);
      socket.volatile.to("lobby").emit("userLeaveLobby", {
        user: user,
        gameList: gameList,
      });
    });
    io.in("lobby")
      .fetchSockets()
      .then((sockets) => {
        // filter possible garbage info
        userList = sockets.filter(
          (socket) => socket.request.session.userName !== user.username
        );
        userList = userList.map((socket) => {
          return {
            username: socket.request.session.userName,
            status: gameListManager.getUserStatus(
              socket.request.session.userId
            ),
          };
        });
        // Add current user to the front of list

        userList.unshift({
          username: user.username,
          status: currentUserStatus,
        });
        io.to(socket.id).emit("userListInitial", {
          user_list: userList,
        });
        io.volatile.in("lobby").emit("userJoinLobby", {
          username: user.username,
          status: currentUserStatus,
        });
        const gameList = gameListManager.getGameList();
        io.in("lobby").emit("gameListInitial", gameList);
      });
  });
};

exports.userStatusUpdate = (username, status) => {
  const io = require("./socket").getIO();
  io.in("lobby").emit("updateUserStatus", {
    username: username,
    status: status,
  });
};

exports.chatLobby = (username, timestamp, message) => {
  const io = require("./socket").getIO();
  io.in("lobby").emit("lobbyChat", {
    username: username,
    message: message,
    timestamp: timestamp,
  });
};

exports.gameListInitial = (gameList) => {
  const io = require("./socket").getIO();
  io.to("lobby").emit("gameListInitial", gameList);
};

exports.createGame = (new_game) => {
  const io = require("./socket").getIO();
  io.in("lobby").emit("createGame", new_game);
};

exports.joinGame = (game, user) => {
  const io = require("./socket").getIO();
  io.in("lobby").emit("joinGame", {
    game: game,
    user: user,
  });
};

exports.leaveGame = (gameStatus, game, user) => {
  const io = require("./socket").getIO();
  io.in("lobby").emit("leaveGame", {
    game: game,
    user: user,
    game_status: gameStatus,
  });
};

exports.initGame = (game_id, users_id) => {
  const io = require("./socket").getIO();
  const game = gameListManager.initGame(game_id);
  io.in("lobby").emit("initGame", { game });
  io.in("lobby")
    .fetchSockets()
    .then((sockets) => {
      users_socket = sockets.filter((socket) =>
        users_id.includes(socket.request.session.userId)
      );
      users_socket.forEach((socket) => {
        io.to(socket.id).emit("gameReady", {
          message: `Game "${game.name}" is ready, will start in few seconds!`,
        });
      });
    });
};
