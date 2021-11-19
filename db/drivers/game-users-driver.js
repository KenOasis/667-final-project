const db = require("../../models/");
const Users = db["users"];
const GameUsers = db["game_users"];
const { Op } = require("sequelize");

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
  } catch (err) {
    console.error(err);
    return null;
  }
};

exports.getGameUsersByGameId = async (game_id) => {
  try {
    const game_users = await Users.findAll({
      raw: true,
      attributes: ["id", "username"],
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
  } catch (err) {
    console.error(err);
    return null;
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

    return game_user;
  } catch (err) {
    console.error(err);
    return null;
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
  } catch (err) {
    console.error(err);
    return null;
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

    if (game_users && game_users.length) {
      const game_order = game_users.map((game_user) => game_user.user_id);

      return game_order;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
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
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
