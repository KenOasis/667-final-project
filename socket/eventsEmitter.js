const gameListManager = require('../data/game-list-monitor');
let socket_id;

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
            status: socket.request.session.userStatus,
            id: Buffer.from(socket.id).toString("base64"),
          };
        });
        // Add current user to the front of list

        userList.unshift({
          username: username,
          status: currentUserStatus,
          id: Buffer.from(socket.id).toString("base64")
        })
        console.log(userList);
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

exports.leaveLobby = (username) => {
  const io = require('./socket').getIO();
  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      socket.volatile.to("lobby").emit("userLeaveLobby", {
        username: username,
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

exports.chatLobby = (username, message) => {
  const io = require('./socket').getIO();
  io.in("lobby").emit("lobbyChat", {  
    username: username,
    message: message
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

exports.joinGame = () => {
  const io = require('./socket').getIO();
}

exports.leaveGame = () => {
  const io = require('./socket').getIO();
}