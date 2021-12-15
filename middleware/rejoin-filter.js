const ValidationError = require("../error/ValidationError");

// The filter to avoid same session join the same game room in different tab(socket)
const rejoinFilter = async (req, res, next) => {
  try {
    const roomSpace = require("../socket/socket").getNameSpace("room");
    const game_id = req.params.game_id;
    const room = "game-" + game_id;
    const user_id = req.session.userId;
    const sockets = await roomSpace.in(room).fetchSockets();
    if (sockets) {
      const filter = sockets.filter(
        (socket) => socket.request.session.userId === +user_id
      );
      if (filter.length > 0) {
        res.status(409).redirect("/lobby");
      } else {
        next();
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = rejoinFilter;
