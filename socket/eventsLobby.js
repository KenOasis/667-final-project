const gameListManager = require("../volatile/gameListManager");

exports.joinLobby = (user, currentUserStatus) => {
  const lobbySpace = require("./socket").getNameSpace("lobby");
  const gameSpace = require("./socket").getNameSpace("game");

  let userList = [];

  lobbySpace.removeAllListeners();

  // This is where established the connection for lobby
  lobbySpace.on("connection", async (socket) => {
    // listen to the client event of disconnect
    try {
      const socketsOfLobby = await lobbySpace.fetchSockets();
      // filter sockets which is not whoami
      let lobbyUserList = socketsOfLobby.filter(
        (socket) => socket.request.session.userName !== user.username
      );
      lobbyUserList = lobbyUserList.map((socket) => {
        return {
          username: socket.request.session.userName,
          user_id: socket.request.session.userId,
          // status: gameListManager.getUserStatus(socket.request.session.userId),
        };
      });

      const socketsOfGame = await gameSpace.fetchSockets();
      // filter sockets which is not whoami
      let gameUserList = socketsOfGame.filter(
        (socket) => socket.request.session.userName !== user.username
      );

      gameUserList = gameUserList.map((socket) => {
        return {
          username: socket.request.session.userName,
          user_id: socket.request.session.userId,
          // status: gameListManager.getUserStatus(socket.request.session.userId),
        };
      });

      userList = lobbyUserList.concat(gameUserList);
      // stringnify all the user obj to string
      userList = userList.map((user) => JSON.stringify(user));

      // remove duplicate users (multi-tab with same indentity)
      userList = userList.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

      // parsed back the user string to obj
      userList = userList.map((user) => JSON.parse(user));

      userList = userList.map((user) => {
        return {
          username: user.username,
          status: gameListManager.getUserStatus(user.user_id),
        };
      });
      // Add current user to the front of list

      userList.unshift({
        username: user.username,
        status: currentUserStatus,
      });

      lobbySpace.to(socket.id).emit("userListInitial", {
        user_list: userList,
      });
      lobbySpace.emit("userJoinLobby", {
        username: user.username,
        status: currentUserStatus,
      });
      const gameList = gameListManager.getGameList();
      lobbySpace.emit("gameListInitial", gameList);

      socket.on("disconnect", () => {
        const gameList = gameListManager.userLeaveLobby(user.user_id);
        const userInGame = gameUserList.filter(
          (userInGame) => userInGame.username === user.username
        );
        if (userInGame.length == 0) {
          // if not in game, delete it from user list
          lobbySpace.volatile.emit("userLeaveLobby", {
            user: user,
            gameList: gameList,
          });
        }
      });
    } catch (err) {
      console.error(err);
    }
  });
};

exports.userStatusUpdate = (username, status) => {
  const lobbySpace = require("./socket").getNameSpace("lobby");
  lobbySpace.emit("updateUserStatus", {
    username: username,
    status: status,
  });
};

exports.chatLobby = (username, timestamp, message) => {
  const lobbySpace = require("./socket").getNameSpace("lobby");
  lobbySpace.emit("lobbyChat", {
    username: username,
    message: message,
    timestamp: timestamp,
  });
};

exports.gameListInitial = (gameList) => {
  const lobbySpace = require("./socket").getNameSpace("lobby");
  lobbySpace.emit("gameListInitial", gameList);
};

exports.createGame = (new_game) => {
  const lobbySpace = require("./socket").getNameSpace("lobby");
  lobbySpace.emit("createGame", new_game);
};

exports.joinGame = (game, user) => {
  const lobbySpace = require("./socket").getNameSpace("lobby");
  lobbySpace.emit("joinGame", {
    game: game,
    user: user,
  });
};

exports.leaveGame = (gameStatus, game, user) => {
  const lobbySpace = require("./socket").getNameSpace("lobby");
  lobbySpace.emit("leaveGame", {
    game: game,
    user: user,
    game_status: gameStatus,
  });
};

exports.initGame = (game_id, users_id) => {
  const lobbySpace = require("./socket").getNameSpace("lobby");
  const game = gameListManager.initGame(game_id);
  lobbySpace.emit("initGame", { game });
  lobbySpace.fetchSockets().then((sockets) => {
    users_socket = sockets.filter((socket) =>
      users_id.includes(socket.request.session.userId)
    );
    users_socket.forEach((socket) => {
      lobbySpace.to(socket.id).emit("gameReady", {
        game_id: game_id,
        message: `Game "${game.name}" is ready, will start soon!`,
      });
    });
  });
};
