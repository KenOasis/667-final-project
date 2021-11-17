exports.userJoin = (game_id, username, user_list) => {
  const gameNS = require("./socket").getNameSpace("game");
  const room = "game-" + game_id;
  gameNS.on("connection", (socket) => {
    socket.join(room);
    console.log(socket.request.session.userId + " joins " + room);
  });

  gameNS.in(room).fetchSockets((sockets) => {
    console.log(sockets.length);
    const users_id = user_list.map((user) => user.user_id);
    sockets.forEach((socket) => {
      let socket_user_id = socket.request.session.userId;
      console.log(socket_user_id);
      // check whether the user is join the game, if yes, change their status as "ready".
      if (users_id.includes(socket_user_id)) {
        user_list.forEach((user) => {
          if (user.user_id === socket_user_id) {
            user.status = "ready";
          }
        });
      }
    });
  });
  // console.log(user_list);
  gameNS.in(room).emit("userJoin", {
    username,
    user_list,
  });
  let isFulled = true;
  for (let i = 0; i < user_list.length; ++i) {
    if (user_list[i].status === "loading") {
      isFulled = false;
      break;
    }
  }
  if (isFulled) {
    gameNS.in(room).emit("gameStart", { user_list });
  }
};
