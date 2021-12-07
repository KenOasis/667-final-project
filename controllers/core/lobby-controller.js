const gameListManager = require("../../db/lobby-game-list-manager/gameListManager");

const eventsLobby = require("../../socket/eventsLobby");

exports.createGame = async (req, res, next) => {
  const game_name = req.body.game_name;

  const user = {
    user_id: req.session.userId,
    username: req.session.userName,
  };

  try {
    const game_list = await gameListManager.createGame(game_name, user);
    eventsLobby.gameListUpdate(game_list);
    res.status(200).json({
      status: "success",
      message: "Game: " + game_name + " is created!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error.",
    });
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
      if (is_init_game) {
      }
      res.status(200).json({
        status: "success",
        message: "Join game success!",
      });
    } else if (game_list.length === 0) {
      res.status(409).json({
        status: "failed",
        message: "The game is full.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
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
    res.status(200).json({
      status: "success",
      message: "You have leave the game",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
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
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error." });
    }
  } else {
    return res.status(401).render("login");
  }
};
