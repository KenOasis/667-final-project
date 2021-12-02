const gameListManager = require("../volatile/gameListManager");

exports.joinLobby = async (user, currentUserStatus, gameList) => {
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

      const userListWithStatus = [];
      for await (const user of userList) {
        const userObj = {};
        userObj.username = user.username;
        const status = await gameListManager.getUserStatus(user.user_id);
        userObj.status = status[0];
        userListWithStatus.push(userObj);
      }

      // userList = userList.map((user) => {
      //   return {
      //     username: user.username,
      //     status: gameListManager.getUserStatus(user.user_id)[0],
      //   };
      // });
      // Add current user to the front of list

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
        // const gameList = gameListManager.userLeaveLobby(user.user_id);
        // const userInGame = gameUserList.filter(
        //   (userInGame) => userInGame.username === user.username
        // );
        // if (userInGame.length == 0) {
        //   // if not in game, delete it from user list
        //   lobbySpace.volatile.emit("userLeaveLobby", {
        //     user: user,
        //     gameList: gameList,
        //   });
        // }
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
