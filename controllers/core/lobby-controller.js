const gameListManager = require("../../volatile/gameListManager");

const coreDriver = require("../../db/drivers/core-driver");

const eventsLobby = require("../../socket/eventsLobby");

exports.createGame = async (req, res, next) => {
  const game_name = req.body.game_name;

  const user = {
    user_id: req.session.userId,
    username: req.session.userName,
  };

  try {
    const new_game = await gameListManager.createGame(game_name, user);
    eventsLobby.createGame(new_game);
    res.status(200).json({
      status: "success",
      message: "Game: " + game_name + " is created!",
    });
  } catch (err) {
    console.error(err);
  }
};

exports.joinGame = async (req, res, next) => {
  const game_id = +req.body.game_id;
  const user = {
    username: req.session.userName,
    user_id: req.session.userId,
  };
  const game = gameListManager.joinGame(game_id, user);
  if (game) {
    eventsLobby.joinGame(game, user);
    // If game is full, initial game data in db
    if (game.status === "full") {
      const users_id = gameListManager
        .getUserListOfGame(game_id)
        .map((user) => user.user_id);
      eventsLobby.initGame(game_id, users_id);

      try {
        const isInitialSuccess = await coreDriver.initialGame(
          game_id,
          users_id
        );

        if (isInitialSuccess) {
          // join success
        } else {
          throw new Error("DB error.");
        }
      } catch (err) {
        console.error(err);
        return res
          .status(202)
          .json({ status: "failed", message: "Initial game failed" });
      }
    }
    res.status(200).json({
      status: "success",
      message: "You have joint the game " + game.name,
    });
  } else {
    res.status(409).json({
      status: "failed",
      message: "The game is full.",
    });
  }
};

exports.leaveGame = (req, res, next) => {
  const game_id = +req.body.game_id;
  const user = {
    username: req.session.userName,
    user_id: req.session.userId,
  };
  const [gameStatus, game] = gameListManager.leaveGame(game_id, user);

  eventsLobby.leaveGame(gameStatus, game, user);
  res.status(200).json({
    status: "success",
    message: "You have leave the game " + game.name,
  });
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
    const userStatus = gameListManager.getUserStatus(user_id);
    eventsLobby.joinLobby(user, userStatus);
    return res.status(200).render("lobby", { whoami: username });
  } else {
    return res.status(401).render("login");
  }
};
