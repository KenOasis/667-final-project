const gameListManager = require('../../data/game-list-monitor');

const eventsEmitter = require('../../socket/eventsEmitter');
exports.createGame = async (req, res, next) => {
  const game_name = req.body.game_name;

  const user = {
    user_id: req.session.userId,
    username: req.session.userName
  }

  try {
    const new_game = await gameListManager.createGame(game_name, user);
    eventsEmitter.createGame(new_game);
    req.session.userStatus = "ready";
    eventsEmitter.userStatusUpdate(user.username, "ready");
    res.status(200).json({ 
      status: "success",
      message: "Game: " + game_name + " is created!"
    })
  } catch (err) {
    console.error(err);
  }
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

exports.getLobby = async (req, res, next) => {
  let isLoggedIn = req.session.isLoggedIn === true ? true : false;
  if (isLoggedIn) {
    const username = req.session.userName;
    const userStatus = req.session.userStatus;
    eventsEmitter.joinLobby(username, userStatus);
    eventsEmitter.leaveLobby(username);
    return res.status(200).render("lobby", {whoami: username});
  } else {
    return res.status(401).render("login");
  }
};
 