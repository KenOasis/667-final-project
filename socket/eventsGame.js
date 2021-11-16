

exports.userJoin = (game_id, user_list) => {
  const io = require('./socket').getIO().of('/game');
  io.on("connection", socket => {
    const room = "game-" + game_id
    socket.join(room);
    io.in(room).emit("testEvent", { user_list })
  })
}