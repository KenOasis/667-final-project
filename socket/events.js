const gameListManager = require('../volatile/game-list-manager');
var crypto = require("crypto");
let socket_id;

exports.joinLobby = (user, currentUserStatus) => {
  const io = require('./socket').getIO();
  let userList = [];

  // This is where established the connection for lobby
  io.on("connection", (socket) => {
    io.removeAllListeners();
    socket_id = socket.id;
    socket.join("lobby");

    socket.on("disconnect", () => {
      const gameList = gameListManager.userLeaveLobby(user.user_id);
      socket.volatile.to("lobby").emit("userLeaveLobby", {
        user: user,
        gameList: gameList,
        id: crypto.randomBytes(20).toString('hex')
      })
    });
    io.in("lobby")
      .fetchSockets()
      .then((sockets) => {
        // filter possible garbage info
        userList = sockets.filter(socket => socket.request.session.userName!== user.username);
        userList = userList.map((socket) => {
          return {
            username: socket.request.session.userName,
            status: gameListManager.getUserStatus(socket.request.session.userId),
            id: crypto.randomBytes(20).toString('hex')
          };
        });
        // Add current user to the front of list

        userList.unshift({
          username: user.username,
          status: currentUserStatus,
          id: crypto.randomBytes(20).toString('hex')
        })
        io.to(socket.id).emit("userListInitial", {
          user_list: userList
        });
        io.volatile.in("lobby").emit("userJoinLobby", {
          username: user.username,
          status: currentUserStatus,
          id: crypto.randomBytes(20).toString('hex')
        });
        const gameList = gameListManager.getGameList();
        io.in("lobby").emit("gameListInitial", gameList);
      });
  });
};

exports.userStatusUpdate = (username, status) => {
  const io = require('./socket').getIO();
  io.in("lobby").emit("updateUserStatus", {
    username: username,
    status: status,
    id: crypto.randomBytes(20).toString('hex')
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

exports.joinGame = (game, user) => {
  const io = require('./socket').getIO();
  io.in("lobby").emit("joinGame", {
    game: game,
    user: user
  })
}

exports.leaveGame = (gameStatus, game, user) => {
  const io = require('./socket').getIO();
  io.in("lobby").emit("leaveGame", {
    game: game,
    user: user,
    game_status: gameStatus
  })
}