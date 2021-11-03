//TODO create a Game object/class and a lobby observer 

exports.createGame = (req, res, next) => {
  const game_name = req.body.game_name;

  // TODO create an instance of Game object and create an row in game table
  // return a game_id
}

exports.joinGame = (req, res, next) => {
  const game_id = req.body.game_id;

  // TODO broadcast the join status to all users, update lobby state
}

exports.leaveGame = (req, res, next) => {
  const game_id = req.body.game_id;  
  // TODO broadcast the leave status to all users, update lobby state
  // Get penalty inside the game.
}

exports.startGame = (req, res, next) => {
  const game_id = req.body.game_id;
  // TODO start the game and update lobby state
  // initial game and render a game view to all users 
}