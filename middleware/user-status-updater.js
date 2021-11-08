const userStatusUpdater = (req, res, next) => {
  const io = require('../socket/socket').getIO();
  const userStatus = req.session.userStatus;
  const username = req.session.userName; 
  io.on('connect', socket => {
    io.to("lobby").emit("updateUserStatus", {
      username: username,
      status: userStatus,
      id: Buffer.from(socket.id).toString("base64")
    })
  });
  next();
}

module.exports = userStatusUpdater;