exports.userJoin = (game_id) => {
  const gameSpace = require("./socket").getNameSpace("game");
  const room = "game-" + game_id;
  gameSpace.on("connect", (socket) => {
    gameSpace.removeAllListeners();
    socket.join(room);
  });
};
