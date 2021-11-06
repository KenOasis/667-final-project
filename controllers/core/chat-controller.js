
exports.sendChat = (req, res, next) => {
  // if id equal 0 them do a brocast to lobby (lobby is a specific room exclude all in-game users)
  const id = +req.query.id;
  const message = req.body.message;
  const username = req.session.userName;
  

  if (id === 0) {
    // what cause the failure by using single quotes rather than double quotes for room name and eventname?
    const io = require("../../socket/socket").getIO();
    io.in("lobby").emit("lobbyChat", {  
      username: username,
      message: message
      });
  }

  return res.status(200).json({
    "status" : "success"
  });
  // TODO, broadcast to specific room
}

