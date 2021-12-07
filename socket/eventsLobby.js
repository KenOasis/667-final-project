const gameListManager = require("../db/lobby-game-list-manager/gameListManager");

exports.joinLobby = async (user, currentUserStatus, gameList) => {
  const lobbySpace = require("./socket").getNameSpace("lobby");
  const gameSpace = require("./socket").getNameSpace("game");

  let user_list = [];

  lobbySpace.removeAllListeners();

  // This is where established the connection for lobby
  lobbySpace.on("connection", async (socket) => {
    // listen to the client event of disconnect
    try {
      const sockets_of_lobby_space = await lobbySpace.fetchSockets();
      // filter sockets which is not whoami
      let sockets_in_lobby = sockets_of_lobby_space.filter(
        (socket) => socket.request.session.userName !== user.username
      );
      sockets_in_lobby = sockets_in_lobby.map((socket) => {
        return {
          username: socket.request.session.userName,
          user_id: socket.request.session.userId,
          // status: gameListManager.getUserStatus(socket.request.session.userId),
        };
      });

      const sockets_of_game_space = await gameSpace.fetchSockets();
      // filter sockets which is not whoami
      let sockets_in_game = sockets_of_game_space.filter(
        (socket) => socket.request.session.userName !== user.username
      );

      sockets_in_game = sockets_in_game.map((socket) => {
        return {
          username: socket.request.session.userName,
          user_id: socket.request.session.userId,
        };
      });

      user_list = sockets_in_lobby.concat(sockets_in_game);
      // stringnify all the user obj to string
      user_list = user_list.map((user) => JSON.stringify(user));

      // remove duplicate users (multi-tab with same indentity)
      user_list = user_list.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

      // parsed back the user string to obj
      user_list = user_list.map((user) => JSON.parse(user));

      const userListWithStatus = [];
      for await (const user of user_list) {
        const user_obj = {};
        user_obj.username = user.username;
        const status = await gameListManager.getUserStatus(user.user_id);
        user_obj.status = status[0];
        userListWithStatus.push(user_obj);
      }

      userListWithStatus.unshift({
        username: user.username,
        status: currentUserStatus,
      });

      lobbySpace.to(socket.id).emit("userListInitial", {
        user_list: userListWithStatus,
      });
      lobbySpace.emit("userJoinLobby", {
        username: user.username,
        status: currentUserStatus,
      });
      lobbySpace.emit("gameListInitial", gameList);

      socket.on("disconnect", () => {
        const username = socket.request.session.userName;
        lobbySpace.emit("userLeaveLobby", { username });
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

exports.sendChat = (username, timestamp, message) => {
  const lobbySpace = require("./socket").getNameSpace("lobby");
  lobbySpace.emit("chat", {
    username: username,
    message: message,
    timestamp: timestamp,
  });
};

exports.gameListUpdate = (gameList) => {
  const lobbySpace = require("./socket").getNameSpace("lobby");
  lobbySpace.emit("updateGameList", {
    game_list: gameList,
  });
};

exports.initGame = (game_id, user_id_list, game_list) => {
  const lobbySpace = require("./socket").getNameSpace("lobby");
  lobbySpace.emit("updateGameList", { game_list });
  lobbySpace.fetchSockets().then((sockets) => {
    users_socket = sockets.filter((socket) =>
      user_id_list.includes(socket.request.session.userId)
    );
    users_socket.forEach((socket) => {
      lobbySpace.to(socket.id).emit("gameReady", {
        game_id: game_id,
        message: `Game is ready, will start soon!`,
      });
    });
  });
};
