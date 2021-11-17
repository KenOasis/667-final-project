const gameListManager = require("../volatile/gameListManager");

exports.joinLobby = (user, currentUserStatus) => {
  const lobby = require("./socket").getNameSpace("lobby");
  let userList = [];

  // This is where established the connection for lobby
  lobby.on("connection", (socket) => {
    lobby.removeAllListeners();
    // listen to the client event of disconnect
    socket.on("disconnect", () => {
      const gameList = gameListManager.userLeaveLobby(user.user_id);
      lobby.volatile.emit("userLeaveLobby", {
        user: user,
        gameList: gameList,
      });
    });
    lobby.fetchSockets().then((sockets) => {
      // filter possible garbage info
      userList = sockets.filter(
        (socket) => socket.request.session.userName !== user.username
      );
      userList = userList.map((socket) => {
        return {
          username: socket.request.session.userName,
          status: gameListManager.getUserStatus(socket.request.session.userId),
        };
      });
      // Add current user to the front of list

      userList.unshift({
        username: user.username,
        status: currentUserStatus,
      });
      lobby.to(socket.id).emit("userListInitial", {
        user_list: userList,
      });
      lobby.volatile.emit("userJoinLobby", {
        username: user.username,
        status: currentUserStatus,
      });
      const gameList = gameListManager.getGameList();
      lobby.emit("gameListInitial", gameList);
    });
  });
};

exports.userStatusUpdate = (username, status) => {
  const lobby = require("./socket").getNameSpace("lobby");
  lobby.emit("updateUserStatus", {
    username: username,
    status: status,
  });
};

exports.chatLobby = (username, timestamp, message) => {
  const lobby = require("./socket").getNameSpace("lobby");
  lobby.emit("lobbyChat", {
    username: username,
    message: message,
    timestamp: timestamp,
  });
};

exports.gameListInitial = (gameList) => {
  const lobby = require("./socket").getNameSpace("lobby");
  lobby.emit("gameListInitial", gameList);
};

exports.createGame = (new_game) => {
  const lobby = require("./socket").getNameSpace("lobby");
  lobby.emit("createGame", new_game);
};

exports.joinGame = (game, user) => {
  const lobby = require("./socket").getNameSpace("lobby");
  lobby.emit("joinGame", {
    game: game,
    user: user,
  });
};

exports.leaveGame = (gameStatus, game, user) => {
  const lobby = require("./socket").getNameSpace("lobby");
  lobby.emit("leaveGame", {
    game: game,
    user: user,
    game_status: gameStatus,
  });
};

exports.initGame = (game_id, users_id) => {
  const lobby = require("./socket").getNameSpace("lobby");
  const game = gameListManager.initGame(game_id);
  lobby.emit("initGame", { game });
  lobby.fetchSockets().then((sockets) => {
    users_socket = sockets.filter((socket) =>
      users_id.includes(socket.request.session.userId)
    );
    users_socket.forEach((socket) => {
      lobby.to(socket.id).emit("gameReady", {
        message: `Game "${game.name}" is ready, will start in few seconds!`,
      });
    });
  });
};
