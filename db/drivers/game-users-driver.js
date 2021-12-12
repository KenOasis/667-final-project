const db = require("../../models/");
const Users = db["users"];
const GameUsers = db["game_users"];
const { Op } = require("sequelize");
const LogicalError = require("../../error/LogicalError");

Users.hasMany(GameUsers, { foreignKey: "user_id" });

exports.getGameUsersByUserId = async (id) => {
  try {
    const game_users = await Users.findAll({
      raw: true,
      attributes: ["username", "email", "created_at", "game_users.points"],
      where: {
        id,
      },
      include: [
        {
          model: GameUsers,
          attributes: [],
          required: true,
        },
      ],
    });

    return game_users;
  } catch (error) {
    throw error;
  }
};

exports.getGameUsersByGameId = async (game_id) => {
  try {
    const game_users = await Users.findAll({
      raw: true,
      attributes: ["id", "username", "game_users.initial_order"],
      include: {
        model: GameUsers,
        where: {
          game_id: game_id,
        },
        attributes: [],
        required: true,
      },
    });

    return game_users;
  } catch (error) {
    throw error;
  }
};

exports.createGameUsers = async (
  game_id,
  user_id,
  current_player,
  initial_order
) => {
  try {
    const game_user = await GameUsers.create({
      game_id,
      user_id,
      current_player,
      initial_order,
    });
    if (game_user) {
      return game_user;
    }
  } catch (error) {
    throw error;
  }
};

exports.updateGameUsers = async (
  game_id,
  user_id,
  current_player,
  initial_order
) => {
  try {
    const game_user = await GameUsers.findOne({
      where: {
        game_id,
        user_id,
      },
    });
    if (game_user) {
      game_user.current_player = current_player;
      game_user.initial_order = initial_order;
      await game_user.save();
      return true;
    } else {
      const error = new LogicalError(
        `Invaliad data resource, cannot find the resource in game_users table`,
        404
      );
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

exports.checkUserInGame = async (game_id, user_id) => {
  try {
    const gameUser = await GameUsers.findOne({
      where: {
        game_id,
        user_id,
      },
    });

    if (gameUser) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

exports.getGameOrder = async (game_id) => {
  try {
    const game_users = await GameUsers.findAll({
      where: {
        game_id,
      },
      attributes: ["user_id"],
      order: [["initial_order", "ASC"]],
    });

    if (game_users && game_users.length === 4) {
      const game_order = game_users.map((game_user) => game_user.user_id);

      return game_order;
    } else {
      throw new LogicalError(
        `Invalid data resource, game: (game_id = ${game_id}) is not initial correctly`,
        404
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.getCurrentPlayer = async (game_id) => {
  try {
    const game = await GameUsers.findOne({
      where: {
        game_id,
        current_player: true,
      },
    });
    if (game) {
      return game.user_id;
    } else {
      throw new LogicalError(
        `Invalid data resource, game: (game_id = ${game_id}) is not initial correctly`,
        404
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.setCurrentPlayer = async (game_id, user_id, is_current) => {
  try {
    const game_user = await GameUsers.findOne({
      where: {
        game_id,
        user_id,
      },
    });
    if (game_user) {
      game_user.current_player = is_current;
      await game_user.save();
      return true;
    } else {
      throw new LogicalError(
        `Invalid data resource, game: (game_id = ${game_id}) is not initial correctly`,
        404
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.setUno = async (game_id, user_id, uno_status) => {
  try {
    const game_user = await GameUsers.findOne({
      where: {
        game_id,
        user_id,
      },
    });
    if (game_user) {
      game_user.uno = uno_status;
      await game_user.save();
      return true;
    } else {
      throw new LogicalError(
        `Invalid data resource, game: (game_id = ${game_id}) is not initial correctly`,
        404
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.getUnoStatus = async (game_id, user_id) => {
  try {
    const game_user = await GameUsers.findOne({
      where: {
        game_id,
        user_id,
      },
    });
    if (game_user) {
      return game_user.uno;
    } else {
      throw new LogicalError(
        `Invalid data resource, game: (game_id = ${game_id}) is not initial correctly`,
        404
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.setPoints = async (game_id, user_id, points) => {
  try {
    const game_users = await GameUsers.findOne({
      where: {
        game_id,
        user_id,
      },
    });
    if (game_users) {
      game_users.points = points;
      await game_users.save();
      return true;
    } else {
      throw new LogicalError(
        `Invalid data resource, game: (game_id = ${game_id}) is not existed`,
        404
      );
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Lobby functions
 */

exports.getUsersForLobby = async (game_id) => {
  try {
    const game_users = await Users.findAll({
      raw: true,
      attributes: ["id", "username", "game_users.initial_order"],
      include: {
        model: GameUsers,
        where: {
          game_id: game_id,
        },
        attributes: [],
        required: true,
      },
    });
    if (game_users && game_users.length) {
      const users = [];
      game_users.forEach((game_user) => {
        const user_obj = {};
        user_obj.user_id = game_user.id;
        user_obj.username = game_user.username;
        user_obj.status = game_user.initial_order === 0 ? "ready" : "playing";
        users.push(user_obj);
      });
      return users;
    }
  } catch (error) {
    throw error;
  }
};

exports.deleteGameUsers = async (game_id, user_id) => {
  try {
    const game_user = await GameUsers.findOne({
      where: {
        game_id,
        user_id,
      },
    });
    if (game_user && game_user.initial_order === 0) {
      await game_user.destroy();
      return true;
    }
  } catch (error) {
    throw error;
  }
};
