const gameListManager = require("../../db/lobby-game-list-manager/gameListManager");
const lobbyDriver = require("../../db/drivers/lobby-driver");
const eventsLobby = require("../../socket/eventsLobby");
const eventsRoom = require("../../socket/eventsRoom");
exports.createGame = async (req, res, next) => {
  const game_name = req.body.game_name;

  const user = {
    user_id: req.session.userId,
    username: req.session.userName,
  };

  try {
    const [game_id, game_list] = await gameListManager.createGame(
      game_name,
      user
    );
    eventsLobby.gameListUpdate(game_list);
    res.status(200).json({
      status: "success",
      message: "Game: " + game_name + " is created!",
      game_id: game_id,
    });
    // res.status(200).redirect(`/lobby/room/${game_id}&${game_name}`);
  } catch (error) {
    next(error);
  }
};

exports.joinGame = async (req, res, next) => {
  const game_id = +req.body.game_id;
  const user = {
    username: req.session.userName,
    user_id: req.session.userId,
  };
  try {
    const game_list = await gameListManager.joinGame(game_id, user);
    if (game_list && game_list.length) {
      eventsLobby.gameListUpdate(game_list);
      const is_init_game = await gameListManager.initGame(game_id);
      res.status(200).json({
        status: "success",
        message: "Join game success!",
      });
    } else if (game_list.length === 0) {
      // If game_list is empty array, it means the game is full.
      res.status(409).json({
        status: "failed",
        message: "The game is full.",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.leaveGame = async (req, res, next) => {
  const game_id = +req.body.game_id;
  const user = {
    username: req.session.userName,
    user_id: req.session.userId,
  };
  try {
    const game_list = await gameListManager.leaveGame(game_id, user);
    eventsLobby.gameListUpdate(game_list);
    const user_list = await lobbyDriver.getGameUsersByGameId(game_id);
    eventsRoom.leaveRoom(game_id, user_list);
    return res.status(200).json({
      status: "success",
      message: "You have leave the game",
    });
  } catch (error) {
    next(error);
  }
};

exports.getLobby = async (req, res, next) => {
  let is_logged_in = req.session.isLoggedIn === true ? true : false;
  if (is_logged_in) {
    const username = req.session.userName;
    const user_id = req.session.userId;
    const user = {
      username: username,
      user_id: user_id,
    };
    try {
      const [user_status, game_list] = await gameListManager.getUserStatus(
        user_id
      );
      eventsLobby.joinLobby(user, user_status, game_list);
      return res.status(200).render("lobby", { whoami: username });
    } catch (error) {
      next(error);
    }
  } else {
    return res.status(401).render("login");
  }
};

exports.joinRoom = async (req, res, next) => {
  const game_id = req.params.game_id;
  const game_name = req.params.game_name;
  // TODO check whether the user id is in this game, if not then 403
  try {
    const user_list = await lobbyDriver.getGameUsersByGameId(game_id);
    eventsRoom.joinRoom(game_id, user_list);
    if (user_list) {
      res.status(200).render("room", {
        title: game_name,
        game_id: game_id,
        user_list: user_list,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.startGame = async (req, res, next) => {
  const game_id = +req.body.game_id;
  try {
    eventsRoom.startGame(game_id);
  } catch (error) {
    next(error);
  }
};
