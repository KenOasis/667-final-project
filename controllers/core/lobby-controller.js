const gameListManager = require('../../volatile/gameListManager');

const events = require('../../socket/events');


exports.createGame = async (req, res, next) => {
  const game_name = req.body.game_name;

  const user = {
    user_id: req.session.userId,
    username: req.session.userName
  }

  try {
    const new_game = await gameListManager.createGame(game_name, user);
    events.createGame(new_game);
    const userStatus = gameListManager.getUserStatus(user.user_id);
    events.userStatusUpdate(user.username, userStatus);
    res.status(200).json({ 
      status: "success",
      message: "Game: " + game_name + " is created!"
    })
  } catch (err) {
    console.error(err);
  }
}

exports.joinGame = (req, res, next) => {
  const game_id = +req.body.game_id;
  const user = {
    username: req.session.userName,
    user_id: req.session.userId
  }
  const game = gameListManager.joinGame(game_id, user);
  if (game) {
    const userStatus = gameListManager.getUserStatus(user.user_id);
    events.userStatusUpdate(user.username, userStatus);
    events.joinGame(game, user);
    res.status(200).json({
      status: "success",
      message: "You have joint the game " + game.name
    });
  } else {
    res.status(409).json({
      status: "failed",
      message: "The game is full."
    })
  }
}

exports.leaveGame = (req, res, next) => {
  const game_id = +req.body.game_id;  
  const user = {
    username: req.session.userName,
    user_id: req.session.userId
  }
  const [gameStatus, game] = gameListManager.leaveGame(game_id, user);

  events.leaveGame(gameStatus, game, user);
  const userStatus = gameListManager.getUserStatus(user.user_id);
  events.userStatusUpdate(user.username, userStatus);
  res.status(200).json({ 
    status: "success",
    message: "You have leave the game " + game.name
   });
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
    const user_id = req.session.userId;
    const user = {
      username: username,
      user_id: user_id
    }
    const userStatus = gameListManager.getUserStatus(user_id);
    events.joinLobby(user, userStatus);
    return res.status(200).render("lobby", {whoami: username});
  } else {
    return res.status(401).render("login");
  }
};
 