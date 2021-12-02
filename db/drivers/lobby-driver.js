const gameUsersDriver = require("./game-users-driver");
const gamesDriver = require("./games-driver");

exports.getGameList = async () => {
  const game_list = [];
  try {
    const games = await gamesDriver.getAllActiveGame();
    if (games) {
      games.forEach((game) => {
        const gameObj = {};
        gameObj.game_id = game.id;
        gameObj.name = game.name;
        gameObj.capacity = 4;
        gameObj.status = "waiting";
        game_list.push(gameObj);
      });
      for await (const game of game_list) {
        game.users = await gameUsersDriver.getUsersForLobby(game.game_id);
        if (game.users.findIndex((user) => user.status === "playing") >= 0) {
          game.status = "playing";
        }
      }
      return game_list;
    }
  } catch (err) {
    throw err;
  }
};

exports.createGame = async (game_name, user) => {
  try {
    const game = await gamesDriver.createGame(game_name);
    if (game) {
      const game_user = await gameUsersDriver.createGameUsers(
        game.id,
        user.user_id,
        false,
        0
      );
      if (game_user) {
        return true;
      }
    }
  } catch (err) {
    throw err;
  }
};

exports.joinGame = async (game_id, user) => {
  try {
    const game_users = await gameUsersDriver.getGameUsersByGameId(game_id);
    if (game_users.length < 4) {
      const isJoint = await gameUsersDriver.createGameUsers(
        game_id,
        user.user_id,
        false,
        0
      );
      if (isJoint) {
        return true;
      }
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  }
};

exports.leaveGame = async (game_id, user) => {
  try {
    const isLeft = await gameUsersDriver.deleteGameUsers(game_id, user.user_id);
    const game_users = await gameUsersDriver.getGameUsersByGameId(game_id);
    if (game_users && game_users.length === 0) {
      await gamesDriver.deleteGame(game_id);
    }
    if (isLeft) {
      return true;
    }
  } catch (err) {
    throw err;
  }
};

exports.checkGameFull = async (game_id) => {
  try {
    const game_users = await gameUsersDriver.getGameUsersByGameId(game_id);
    if (game_users && game_users.length === 4) {
      const user_list = game_users.map((game_user) => {
        return {
          user_id: game_user.id,
          username: game_user.username,
        };
      });
      return [true, user_list];
    } else {
      return [false, []];
    }
  } catch (err) {
    throw err;
  }
};
