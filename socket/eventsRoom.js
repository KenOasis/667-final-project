exports.joinRoom = (game_id, user_list) => {
  const roomSpace = require("./socket").getNameSpace("room");
  const room = "game-" + game_id;
  roomSpace.removeAllListeners();
  roomSpace.on("connect", (socket) => {
    socket.join(room);
    roomSpace.in(room).emit("userListUpdate", { user_list });
  });
};

exports.leaveRoom = (game_id, user_list) => {
  const roomSpace = require("./socket").getNameSpace("room");
  const room = "game-" + game_id;
  roomSpace.in(room).emit("userListUpdate", { user_list });
};

exports.startGame = (game_id) => {
  const roomSpace = require("./socket").getNameSpace("room");
  const room = "game-" + game_id;
  roomSpace.in(room).emit("gameReady", { game_id });
};
