exports.sendChat = (req, res, next) => {
  // if game_id equal 0 them do a brocast to lobby (lobby is a specific room exclude all in-game users)
  const game_id = req.query.game_id;
  // Post method to send message
  const message = req.body.message;
  // TODO, broadcast to specific room
}

