const gameListManager = require('../volatile/game-list-manager');
let socket_id;

// TODO socket event when server restarted or stop ?
exports.joinLobby = (username, currentUserStatus) => {
  const io = require('./socket').getIO();
  let userList = [];
  io.on("connection", (socket) => {
    io.removeAllListeners();
    socket_id = socket.id;
    socket.join("lobby");
    io.in("lobby")
      .fetchSockets()
      .then((sockets) => {
        // filter possible garbage info
        userList = sockets.filter(socket => socket.request.session.userName!== username);
        userList = userList.map((socket) => {
          return {
            username: socket.request.session.userName,
            status: gameListManager.getUserStatus(socket.request.session.userId),
            id: Buffer.from(socket.id).toString("base64"),
          };
        });
        // Add current user to the front of list

        userList.unshift({
          username: username,
          status: currentUserStatus,
          id: Buffer.from(socket.id).toString("base64")
        })
        io.to(socket.id).emit("userListInitial", {
          user_list: userList
        });
        io.volatile.in("lobby").emit("userJoinLobby", {
          username: username,
          status: currentUserStatus,
          id: Buffer.from(socket.id).toString("base64")
        });
        const gameList = gameListManager.getGameList();
        io.in("lobby").emit("gameListInitial", gameList);
      });
  });
};

exports.leaveLobby = (user) => {
  const io = require('./socket').getIO();
  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      gameListManager.userLeaveLobby(user.user_id);
      socket.volatile.to("lobby").emit("userLeaveLobby", {
        user: user,
        id: Buffer.from(socket.id).toString("base64")
      })
    });
  });
}

exports.userStatusUpdate = (username, status) => {
  const io = require('./socket').getIO();
  io.in("lobby").emit("updateUserStatus", {
    username: username,
    status: status,
    id: Buffer.from(socket_id).toString("base64")
  });
}

exports.chatLobby = (username, timestamp, message) => {
  const io = require('./socket').getIO();
  io.in("lobby").emit("lobbyChat", {  
    username: username,
    message: message,
    timestamp: timestamp
    });
}

exports.gameListInitial = (gameList) => {
  const io = require('./socket').getIO();
  io.to("lobby").emit("gameListInitial", gameList);
}

exports.createGame = (new_game) => {
  const io = require('./socket').getIO();
  io.in("lobby").emit("createGame", new_game);
}

exports.joinGame = (game_id, user) => {
  const io = require('./socket').getIO();
  io.in("lobby").emit("joinGame", {
    game_id: game_id,
    user: user
  })
}

exports.leaveGame = (game_id, user) => {
  const io = require('./socket').getIO();
  io.in("lobby").emit("leaveGame", {
    game_id: game_id,
    user: user
  })
}