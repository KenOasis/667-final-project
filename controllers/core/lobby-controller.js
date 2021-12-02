const gameListManager = require("../../db/lobby-game-list-manager/gameListManager");

const eventsLobby = require("../../socket/eventsLobby");

exports.createGame = async (req, res, next) => {
  const game_name = req.body.game_name;

  const user = {
    user_id: req.session.userId,
    username: req.session.userName,
  };

  try {
    const gameList = await gameListManager.createGame(game_name, user);
    eventsLobby.gameListUpdate(gameList);
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
    const gameList = await gameListManager.joinGame(game_id, user);
    if (gameList && gameList.length) {
      eventsLobby.gameListUpdate(gameList);
      const isInitGame = await gameListManager.initGame(game_id);
      if (isInitGame) {
      }
      res.status(200).json({
        status: "success",
        message: "Join game success!",
      });
    } else if (gameList.length === 0) {
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
    const gameList = await gameListManager.leaveGame(game_id, user);
    eventsLobby.gameListUpdate(gameList);
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
  let isLoggedIn = req.session.isLoggedIn === true ? true : false;
  if (isLoggedIn) {
    const username = req.session.userName;
    const user_id = req.session.userId;
    const user = {
      username: username,
      user_id: user_id,
    };
    try {
      const [userStatus, gameList] = await gameListManager.getUserStatus(
        user_id
      );
      eventsLobby.joinLobby(user, userStatus, gameList);
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
