

exports.userJoin = (game_id, user_list) => {
  const io = require('./socket').getIO().of('/loading');
  io.on("connection", socket => {
    const room = "game-" + game_id
    socket.join(room);
    io.in(room).emit("userJoinLoading", { user_list })
  })
}