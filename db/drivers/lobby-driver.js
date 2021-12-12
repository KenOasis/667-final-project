const gameUsersDriver = require("./game-users-driver");
const gamesDriver = require("./games-driver");
const LogicalError = require("../../error/LogicalError");
exports.getGameList = async () => {
  const game_list = [];
  try {
    const games = await gamesDriver.getAllActiveGame();
    if (games) {
      games.forEach((game) => {
        const game_obj = {};
        game_obj.game_id = game.id;
        game_obj.name = game.name;
        game_obj.capacity = 4;
        game_obj.status = "waiting";
        game_list.push(game_obj);
      });
      for await (const game of game_list) {
        game.users = await gameUsersDriver.getUsersForLobby(game.game_id);
        if (game.users.findIndex((user) => user.status === "playing") >= 0) {
          game.status = "playing";
        }
      }
      return game_list;
    }
  } catch (error) {
    throw error;
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
  } catch (error) {
    throw error;
  }
};

exports.joinGame = async (game_id, user) => {
  try {
    const game_users = await gameUsersDriver.getGameUsersByGameId(game_id);
    if (game_users.length == 0) {
      const error = new LogicalError(
        `Invalid data resource, ${game_id} is not existed in game_users table`,
        404
      );
      throw error;
    } else if (game_users.length < 4) {
      const is_joint = await gameUsersDriver.createGameUsers(
        game_id,
        user.user_id,
        false,
        0
      );
      if (is_joint) {
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

exports.leaveGame = async (game_id, user) => {
  try {
    const is_left = await gameUsersDriver.deleteGameUsers(
      game_id,
      user.user_id
    );
    const game_users = await gameUsersDriver.getGameUsersByGameId(game_id);
    if (game_users && game_users.length === 0) {
      await gamesDriver.deleteGame(game_id);
    } else {
      const error = new LogicalError(
        `Invalid data resource, ${game_id} is not existed in game_users table`,
        404
      );
      throw error;
    }
    if (is_left) {
      return true;
    }
  } catch (error) {
    throw error;
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
  } catch (error) {
    throw error;
  }
};
