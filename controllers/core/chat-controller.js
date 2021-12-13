const eventsLobby = require("../../socket/eventsLobby");
const eventsGame = require("../../socket/eventsGame");
const moment = require("moment");
exports.sendChat = (req, res, next) => {
  // if id equal 0 them do a brocast to lobby
  const id = +req.query.id;
  const message = req.body.message;
  const username = req.session.userName;

  const timestamp = moment();
  if (id === 0) {
    eventsLobby.sendChat(username, timestamp, message);
  } else {
    const game_id = id;
    eventsGame.sendChat(game_id, username, timestamp, message);
  }

  return res.status(200).json({
    status: "success",
  });
};
